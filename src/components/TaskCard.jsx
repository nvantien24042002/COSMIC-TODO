import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Trash2, 
  Edit3, 
  Calendar, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CATEGORIES, PRIORITIES } from '../utils/initialTasks';

export default function TaskCard({
  task,
  onToggleComplete,
  onDeleteTask,
  onOpenEditModal,
  onInlineUpdateTitle,
  playCompleteSound,
  playDeleteSound,
  playClickSound,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [inlineTitle, setInlineTitle] = useState(task.title);
  const inlineInputRef = useRef(null);

  useEffect(() => {
    if (isEditingInline) {
      inlineInputRef.current?.focus();
      inlineInputRef.current?.select();
    }
  }, [isEditingInline]);

  // Find category & priority objects
  const categoryObj = CATEGORIES.find((c) => c.id === task.category) || CATEGORIES[1];
  const priorityObj = PRIORITIES[task.priority] || PRIORITIES.medium;

  // Handle completion toggle with confetti & sound
  const handleCheck = (e) => {
    e.stopPropagation();
    const willBeCompleted = !task.completed;

    if (willBeCompleted) {
      playCompleteSound?.();
      // Cosmic stardust confetti burst
      try {
        const rect = e.target.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
          particleCount: 35,
          spread: 60,
          origin: { x, y },
          colors: ['#06b6d4', '#a855f7', '#ec4899', '#fde047'],
          disableForReducedMotion: true,
          ticks: 120,
          gravity: 0.8,
          scalar: 0.8,
        });
      } catch (err) {
        // Fallback gracefully
      }
    } else {
      playClickSound?.();
    }

    onToggleComplete(task.id);
  };

  const handleSaveInline = () => {
    if (inlineTitle.trim() && inlineTitle.trim() !== task.title) {
      onInlineUpdateTitle(task.id, inlineTitle.trim());
    } else {
      setInlineTitle(task.title);
    }
    setIsEditingInline(false);
  };

  const handleInlineKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveInline();
    } else if (e.key === 'Escape') {
      setInlineTitle(task.title);
      setIsEditingInline(false);
    }
  };

  // Due date status formatting
  let dueDateText = null;
  let isOverdue = false;
  if (task.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0 && !task.completed) {
      dueDateText = `Quá hạn ${Math.abs(diffDays)} ngày`;
      isOverdue = true;
    } else if (diffDays === 0) {
      dueDateText = 'Hôm nay';
    } else if (diffDays === 1) {
      dueDateText = 'Ngày mai';
    } else {
      dueDateText = due.toLocaleDateString('vi-VN');
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 45, scale: 0.93, filter: 'blur(4px)' }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        filter: 'blur(0px)',
        transition: { type: 'spring', stiffness: 350, damping: 25 } 
      }}
      exit={{ 
        opacity: 0, 
        y: -55, 
        scale: 0.82, 
        filter: 'blur(10px)',
        transition: { duration: 0.35, ease: 'easeInOut' } 
      }}
      whileHover={{ y: -3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-300 border ${
        task.completed
          ? 'glass-card-completed border-emerald-500/20'
          : 'glass-card hover:border-cyan-400/40'
      }`}
    >
      {/* Glow highlight line on left edge depending on priority */}
      <div 
        className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${priorityObj.dotColor} opacity-70 group-hover:opacity-100 transition-opacity`}
      />

      <div className="flex items-start gap-3.5">
        {/* Checkbox (Cosmic Portal / Ring) */}
        <motion.button
          onClick={handleCheck}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.88 }}
          className={`relative flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-xl border flex items-center justify-center transition-all duration-200 mt-0.5 ${
            task.completed
              ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500 border-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              : 'border-white/20 hover:border-cyan-400 bg-space-900/60 text-transparent hover:text-cyan-400/40'
          }`}
          title={task.completed ? 'Đánh dấu chưa xong' : 'Đánh dấu hoàn thành'}
        >
          <Check className={`w-4 h-4 stroke-[3] transition-transform ${task.completed ? 'scale-100' : 'scale-75'}`} />
          
          {/* Subtle pulse ring around active checkbox */}
          {!task.completed && (
            <span className="absolute inset-0 rounded-xl border border-cyan-400/0 hover:border-cyan-400/40 animate-pulse pointer-events-none" />
          )}
        </motion.button>

        {/* Task Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            {/* Title / Inline Edit */}
            {isEditingInline ? (
              <input
                ref={inlineInputRef}
                type="text"
                value={inlineTitle}
                onChange={(e) => setInlineTitle(e.target.value)}
                onBlur={handleSaveInline}
                onKeyDown={handleInlineKeyDown}
                className="w-full px-2 py-1 rounded-lg glass-input text-sm sm:text-base text-white focus:ring-2 focus:ring-cyan-400"
              />
            ) : (
              <h4
                onDoubleClick={() => setIsEditingInline(true)}
                className={`text-sm sm:text-base font-semibold leading-snug cursor-pointer transition-all select-none break-words ${
                  task.completed
                    ? 'line-through text-slate-400 decoration-slate-500 decoration-2'
                    : 'text-slate-100 group-hover:text-cyan-200'
                }`}
                title="Nhấp đúp để chỉnh sửa nhanh tiêu đề"
              >
                {task.title}
              </h4>
            )}

            {/* Quick Actions (Edit / Delete) */}
            <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound?.();
                  onOpenEditModal(task);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 transition-colors"
                title="Chỉnh sửa chi tiết nhiệm vụ"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </motion.button>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  playDeleteSound?.();
                  onDeleteTask(task.id);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-white/5 hover:border-rose-500/30 transition-colors"
                title="Xóa nhiệm vụ khỏi quỹ đạo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

          {/* Badges & Meta Row */}
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
            {/* Category Pill */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.06] border border-white/10 text-slate-300">
              <span>{categoryObj.icon}</span>
              <span>{categoryObj.label}</span>
            </span>

            {/* Priority Badge */}
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${priorityObj.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${priorityObj.dotColor}`} />
              <span>{priorityObj.shortLabel}</span>
            </span>

            {/* Due Date */}
            {dueDateText && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                  isOverdue
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                    : 'bg-white/[0.04] border-white/10 text-slate-300'
                }`}
              >
                <Calendar className="w-3 h-3 text-cyan-400" />
                <span>{dueDateText}</span>
              </span>
            )}

            {/* Notes Toggle Pill */}
            {task.notes && (
              <button
                onClick={() => {
                  playClickSound?.();
                  setShowNotes((prev) => !prev);
                }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-colors"
              >
                <FileText className="w-3 h-3" />
                <span>Ghi chú</span>
                {showNotes ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* Expandable Notes View */}
          <AnimatePresence>
            {showNotes && task.notes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-3 pt-2.5 border-t border-white/10"
              >
                <p className="text-xs text-slate-300 bg-space-950/40 rounded-xl p-3 border border-white/5 whitespace-pre-wrap leading-relaxed">
                  {task.notes}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
