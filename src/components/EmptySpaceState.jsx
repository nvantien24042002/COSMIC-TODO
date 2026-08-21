import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Plus } from 'lucide-react';

export default function EmptySpaceState({ filterType, onResetFilter, onFocusInput }) {
  let title = 'Không gian tĩnh lặng...';
  let subtitle = 'Chưa có nhiệm vụ nào trong quỹ đạo hiện tại. Hãy bắt đầu phóng một sứ mệnh mới!';

  if (filterType === 'active') {
    title = 'Tuyệt vời! Không còn nhiệm vụ tồn đọng';
    subtitle = 'Tất cả các sứ mệnh đã hoàn thành hoặc chưa được giao.';
  } else if (filterType === 'completed') {
    title = 'Chưa có nhiệm vụ hoàn thành';
    subtitle = 'Hãy kích hoạt và hoàn thành các nhiệm vụ trong danh sách của bạn!';
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full glass-panel rounded-2xl p-8 sm:p-12 text-center border border-white/10 my-6 relative overflow-hidden"
    >
      <div className="relative z-10 max-w-md mx-auto flex flex-col items-center">
        {/* Floating Space Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-white/15 p-4 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
        >
          <Compass className="w-10 h-10 text-cyan-400 animate-spin-slow" />
          <Sparkles className="w-4 h-4 text-purple-400 absolute top-2 right-2 animate-ping" />
        </motion.div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-2">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
          {subtitle}
        </p>

        <div className="flex items-center gap-3">
          {filterType !== 'all' && (
            <button
              onClick={onResetFilter}
              className="px-4 py-2 rounded-xl glass-button text-xs font-semibold text-cyan-200"
            >
              Xem tất cả nhiệm vụ
            </button>
          )}

          <button
            onClick={onFocusInput}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 hover:opacity-95 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo nhiệm vụ ngay</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
