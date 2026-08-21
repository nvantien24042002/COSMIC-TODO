import React, { useState, useMemo, useRef } from 'react';
import CosmicBackground from './components/CosmicBackground';
import Navbar from './components/Navbar';
import StatsDashboard from './components/StatsDashboard';
import TaskInput from './components/TaskInput';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import TaskEditModal from './components/TaskEditModal';
import ToastNotification from './components/ToastNotification';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSoundEffects } from './hooks/useSoundEffects';
import { INITIAL_TASKS, PRIORITIES } from './utils/initialTasks';

export default function App() {
  const [tasks, setTasks] = useLocalStorage('cosmic_tasks_v2', INITIAL_TASKS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Modal & Toast states
  const [editingTask, setEditingTask] = useState(null);
  const [toast, setToast] = useState(null);

  // Sound Effects
  const {
    soundEnabled,
    toggleSound,
    playAddTaskSound,
    playCompleteSound,
    playDeleteSound,
    playClickSound,
  } = useSoundEffects();

  const mainInputRef = useRef(null);

  // Add new task
  const handleAddTask = (newTaskData) => {
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: newTaskData.title,
      category: newTaskData.category || 'work',
      priority: newTaskData.priority || 'medium',
      dueDate: newTaskData.dueDate || null,
      notes: newTaskData.notes || '',
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setToast({
      type: 'success',
      message: `Đã phóng nhiệm vụ "${newTask.title.slice(0, 24)}..." vào quỹ đạo!`,
    });
  };

  // Toggle complete
  const handleToggleComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  // Delete task with Undo capability
  const handleDeleteTask = (taskId) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    if (!taskToDelete) return;

    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setToast({
      type: 'warning',
      message: `Đã hủy nhiệm vụ "${taskToDelete.title.slice(0, 20)}..."`,
      undoData: { task: taskToDelete, index: tasks.findIndex((t) => t.id === taskId) },
    });
  };

  // Undo delete
  const handleUndo = (undoData) => {
    if (!undoData?.task) return;
    setTasks((prev) => {
      const copy = [...prev];
      copy.splice(undoData.index ?? 0, 0, undoData.task);
      return copy;
    });
    playAddTaskSound();
    setToast({
      type: 'info',
      message: `Đã khôi phục nhiệm vụ "${undoData.task.title.slice(0, 20)}..."`,
    });
  };

  // Update task from Modal
  const handleSaveEditModal = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setToast({
      type: 'success',
      message: 'Đã cập nhật thông số nhiệm vụ thành công!',
    });
  };

  // Inline update title
  const handleInlineUpdateTitle = (taskId, newTitle) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, title: newTitle } : t))
    );
  };

  // Clear all completed tasks
  const handleClearCompleted = () => {
    const completedTasks = tasks.filter((t) => t.completed);
    if (completedTasks.length === 0) return;

    setTasks((prev) => prev.filter((t) => !t.completed));
    playDeleteSound();
    setToast({
      type: 'info',
      message: `Đã dọn dẹp ${completedTasks.length} nhiệm vụ đã hoàn thành!`,
    });
  };

  // Reset to default sample missions
  const handleResetDefault = () => {
    setTasks(INITIAL_TASKS);
    playAddTaskSound();
    setToast({
      type: 'info',
      message: 'Đã khôi phục lại các sứ mệnh vũ trụ mẫu!',
    });
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cosmic_tasks_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setToast({
      type: 'success',
      message: 'Đã xuất dữ liệu nhiệm vụ (.JSON) thành công!',
    });
  };

  // Import JSON
  const handleImportJSON = (importedTasks) => {
    if (!Array.isArray(importedTasks)) {
      alert('Tệp dữ liệu không hợp lệ!');
      return;
    }
    setTasks(importedTasks);
    playAddTaskSound();
    setToast({
      type: 'success',
      message: `Đã nạp thành công ${importedTasks.length} nhiệm vụ từ tệp!`,
    });
  };

  // Filter & Search & Sort logic
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (statusFilter === 'active' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;

        // Category filter
        if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;

        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(query);
          const matchNotes = task.notes?.toLowerCase().includes(query);
          if (!matchTitle && !matchNotes) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }
        if (sortBy === 'priority') {
          const rankA = PRIORITIES[a.priority]?.rank || 1;
          const rankB = PRIORITIES[b.priority]?.rank || 1;
          return rankB - rankA;
        }
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title, 'vi');
        }
        return 0;
      });
  }, [tasks, statusFilter, selectedCategory, searchQuery, sortBy]);

  // Counts for status tabs
  const counts = useMemo(() => {
    const all = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = all - completed;
    return { all, active, completed };
  }, [tasks]);

  return (
    <div className="relative min-h-screen flex flex-col font-sans text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Interactive Canvas Starfield Background */}
      <CosmicBackground />

      {/* Navigation Header */}
      <Navbar
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        onExport={handleExportJSON}
        onImport={handleImportJSON}
        onClearCompleted={handleClearCompleted}
        onResetDefault={handleResetDefault}
        completedCount={counts.completed}
        totalCount={counts.all}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Orbit Progress Dashboard */}
        <StatsDashboard tasks={tasks} />

        {/* Task Input Box */}
        <TaskInput
          onAddTask={handleAddTask}
          playAddSound={playAddTaskSound}
          playClickSound={playClickSound}
        />

        {/* Filters, Search & Sort */}
        <FilterBar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          counts={counts}
          playClickSound={playClickSound}
        />

        {/* Tasks List */}
        <TaskList
          tasks={filteredTasks}
          statusFilter={statusFilter}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
          onOpenEditModal={(task) => setEditingTask(task)}
          onInlineUpdateTitle={handleInlineUpdateTitle}
          onResetFilter={() => {
            setStatusFilter('all');
            setSelectedCategory('all');
            setSearchQuery('');
          }}
          onFocusInput={() => {
            window.scrollTo({ top: 180, behavior: 'smooth' });
          }}
          playCompleteSound={playCompleteSound}
          playDeleteSound={playDeleteSound}
          playClickSound={playClickSound}
        />
      </main>

      {/* Edit Modal */}
      <TaskEditModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEditModal}
        playClickSound={playClickSound}
      />

      {/* Toast Notification */}
      <ToastNotification
        toast={toast}
        onClose={() => setToast(null)}
        onUndo={handleUndo}
      />

      {/* Cosmic Footer */}
      <footer className="relative z-10 w-full text-center py-6 text-xs text-slate-500 border-t border-white/5 backdrop-blur-md bg-space-950/40">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          <span>✨</span>
          <span>Cosmic Todo Space Edition • Thiết kế Glassmorphism & Framer Motion</span>
          <span>✨</span>
        </p>
      </footer>
    </div>
  );
}
