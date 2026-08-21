import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, CheckCircle2, Orbit, Flame, Target } from 'lucide-react';

export default function StatsDashboard({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Determine Mission Status message
  let statusText = 'Trạm không gian sẵn sàng';
  let statusColor = 'text-cyan-400';
  if (total === 0) {
    statusText = 'Chưa có nhiệm vụ trong quỹ đạo';
    statusColor = 'text-slate-400';
  } else if (percentage === 100) {
    statusText = '🌟 Tuyệt hảo! Hoàn tất mọi sứ mệnh!';
    statusColor = 'text-amber-300';
  } else if (percentage >= 50) {
    statusText = '⚡ Đang tăng tốc quỹ đạo vượt mức 50%';
    statusColor = 'text-emerald-400';
  } else if (completed > 0) {
    statusText = '🚀 Đang trong hành trình chinh phục';
    statusColor = 'text-purple-400';
  }

  // Circular gauge calculations
  const strokeDashoffset = 100 - percentage;

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-white/10 mb-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Orbit Progress Circular Indicator */}
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            {/* SVG Circular Progress */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
              {/* Background Circle */}
              <path
                className="text-slate-800"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Animated Progress Circle */}
              <motion.path
                className="text-cyan-400"
                strokeDasharray="100, 100"
                strokeDashoffset={strokeDashoffset}
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke="url(#orbitGradient)"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center Percentage */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-lg font-extrabold font-mono text-white tracking-tight">
                {percentage}%
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Tiến độ Sứ Mệnh
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100">
              Chỉ số Quỹ Đạo (Orbit Velocity)
            </h3>
            <p className={`text-xs sm:text-sm font-medium ${statusColor}`}>
              {statusText}
            </p>
          </div>
        </div>

        {/* Right: Quick Stat Badges */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full md:w-auto">
          {/* Total Tasks */}
          <div className="glass-panel-subtle rounded-xl p-3 text-center border border-white/5 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tổng số</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-white">
              {total}
            </div>
          </div>

          {/* Active Tasks */}
          <div className="glass-panel-subtle rounded-xl p-3 text-center border border-white/5 hover:border-purple-500/30 transition-all">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
              <Rocket className="w-3.5 h-3.5 text-purple-400" />
              <span>Đang làm</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-purple-300">
              {active}
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="glass-panel-subtle rounded-xl p-3 text-center border border-white/5 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Đã xong</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-300">
              {completed}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
