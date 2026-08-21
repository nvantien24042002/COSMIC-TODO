import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, SlidersHorizontal, Calendar, Tag, AlertCircle, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../utils/initialTasks';

export default function TaskInput({ onAddTask, playAddSound, playClickSound }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('work');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      category,
      priority,
      dueDate: dueDate || null,
      notes: notes.trim() || '',
    });

    playAddSound();

    // Reset input
    setTitle('');
    setNotes('');
    setDueDate('');
    if (!isExpanded) {
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isExpanded) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-5 border border-white/12 shadow-2xl relative mb-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Main Input Row */}
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập nhiệm vụ mới vào không gian... (vd: Hiệu chỉnh động cơ Warp)"
              className="w-full px-4 py-3.5 pl-11 rounded-xl glass-input text-sm sm:text-base text-slate-100 placeholder-slate-400/80 focus:ring-2 focus:ring-cyan-500/40"
            />
            <Sparkles className="w-5 h-5 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
          </div>

          {/* Toggle Details Button */}
          <motion.button
            type="button"
            onClick={() => {
              playClickSound?.();
              setIsExpanded(!isExpanded);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3.5 rounded-xl border text-sm font-medium flex items-center gap-1.5 transition-colors ${
              isExpanded
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
            title="Chi tiết & Tùy chọn nâng cao"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden md:inline text-xs">
              {isExpanded ? 'Thu gọn' : 'Tùy chọn'}
            </span>
          </motion.button>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!title.trim()}
            whileHover={{ scale: title.trim() ? 1.03 : 1 }}
            whileTap={{ scale: title.trim() ? 0.96 : 1 }}
            className={`px-4 sm:px-5 py-3.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
              title.trim()
                ? 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer'
                : 'bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed opacity-50'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span className="font-semibold">Thêm Task</span>
          </motion.button>
        </div>

        {/* Expandable Advanced Options */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden pt-3 border-t border-white/10 space-y-4"
            >
              {/* Category, Priority & Due Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category Select */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
                    <Tag className="w-3.5 h-3.5 text-purple-400" />
                    <span>Danh mục</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg glass-input text-xs sm:text-sm text-slate-200 bg-space-900/90"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-space-900 text-slate-100">
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Select */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mức độ ưu tiên</span>
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg glass-input text-xs sm:text-sm text-slate-200 bg-space-900/90"
                  >
                    {Object.values(PRIORITIES).map((p) => (
                      <option key={p.id} value={p.id} className="bg-space-900 text-slate-100">
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due Date Picker */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Hạn chót (Due Date)</span>
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg glass-input text-xs sm:text-sm text-slate-200"
                  />
                </div>
              </div>

              {/* Notes TextArea */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Ghi chú chi tiết cho phi hành đoàn (Tùy chọn):
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Thêm thông số, tọa độ hoặc hướng dẫn thực thi..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg glass-input text-xs sm:text-sm text-slate-200 placeholder-slate-500 resize-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
