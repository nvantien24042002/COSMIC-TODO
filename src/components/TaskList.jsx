import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import EmptySpaceState from './EmptySpaceState';

export default function TaskList({
  tasks,
  statusFilter,
  onToggleComplete,
  onDeleteTask,
  onOpenEditModal,
  onInlineUpdateTitle,
  onResetFilter,
  onFocusInput,
  playCompleteSound,
  playDeleteSound,
  playClickSound,
}) {
  if (tasks.length === 0) {
    return (
      <EmptySpaceState
        filterType={statusFilter}
        onResetFilter={onResetFilter}
        onFocusInput={onFocusInput}
      />
    );
  }

  return (
    <div className="w-full space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDeleteTask={onDeleteTask}
            onOpenEditModal={onOpenEditModal}
            onInlineUpdateTitle={onInlineUpdateTitle}
            playCompleteSound={playCompleteSound}
            playDeleteSound={playDeleteSound}
            playClickSound={playClickSound}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
