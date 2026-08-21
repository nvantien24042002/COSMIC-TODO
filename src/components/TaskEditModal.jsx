import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Tag, AlertCircle, Calendar, FileText, Sparkles } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../utils/initialTasks';

export default function TaskEditModal({
  isOpen,
  task,
  onClose,
  onSave,
  playClickSound,
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('work');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setCategory(task.category || 'work');
      setPriority(task.priority || 'medium');
      setDueDate(task.dueDate || '');
      setNotes(task.notes || '');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...task,
      title: title.trim(),
      category,
      priority,
      dueDate: dueDate || null,
      notes: notes.trim(),
    });
    playClickSound?.();
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        onKeyDown={handleKeyDown}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-space-950/80 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg glass-panel rounded-2xl p-6 border border-white/20 shadow-2xl z-10 overflow-hidden"
        >
          {/* Header Glow */}
          <div className="absolute top-0 right-0 w-48 h-24 bg-cyan-500/15 rounded-full blur-xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Hiệu Chỉnh Nhiệm Vụ Không Gian
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tiêu đề nhiệm vụ <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tên nhiệm vụ..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white"
              />
            </div>

            {/* Category & Priority Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Category */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
                  <Tag className="w-3.5 h-3.5 text-purple-400" />
                  <span>Danh mục</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs sm:text-sm text-slate-200 bg-space-900"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-space-900 text-slate-200">
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mức độ ưu tiên</span>
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs sm:text-sm text-slate-200 bg-space-900"
                >
                  {Object.values(PRIORITIES).map((p) => (
                    <option key={p.id} value={p.id} className="bg-space-900 text-slate-200">
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hạn chót thực thi (Due Date)</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs sm:text-sm text-white"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-pink-400" />
                <span>Ghi chú chi tiết</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú thêm thông tin hoặc nhật ký..."
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs sm:text-sm text-white resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl glass-panel-subtle text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Hủy bỏ
              </button>

              <motion.button
                type="submit"
                disabled={!title.trim()}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu thay đổi</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
