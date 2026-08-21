import React from 'react';
import { motion } from 'framer-motion';
import { Search, X, ArrowUpDown, Filter } from 'lucide-react';
import { CATEGORIES } from '../utils/initialTasks';

export default function FilterBar({
  statusFilter,
  setStatusFilter,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  counts,
  playClickSound,
}) {
  const tabs = [
    { id: 'all', label: 'Tất cả', count: counts.all },
    { id: 'active', label: 'Đang làm', count: counts.active },
    { id: 'completed', label: 'Đã hoàn thành', count: counts.completed },
  ];

  return (
    <div className="w-full space-y-3 mb-6">
      {/* Top Filter Controls Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Tabs (All / Active / Completed) */}
        <div className="flex items-center p-1 rounded-xl glass-panel-subtle border border-white/10 relative overflow-hidden">
          {tabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound?.();
                  setStatusFilter(tab.id);
                }}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 z-10 flex items-center gap-1.5 ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>

                {/* Animated Background Pill for Active Tab */}
                {isActive && (
                  <motion.div
                    layoutId="activeStatusTab"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/80 to-purple-600/80 rounded-lg -z-10 shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Container */}
        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm nhiệm vụ..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl glass-input text-xs sm:text-sm text-slate-200 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                playClickSound?.();
                setSortBy(e.target.value);
              }}
              className="px-3 py-1.5 rounded-xl glass-input text-xs text-slate-200 bg-space-900/90 appearance-none pr-7 cursor-pointer hover:border-cyan-500/40"
              title="Sắp xếp nhiệm vụ"
            >
              <option value="newest" className="bg-space-900 text-slate-200">
                Mới nhất trước
              </option>
              <option value="oldest" className="bg-space-900 text-slate-200">
                Cũ nhất trước
              </option>
              <option value="priority" className="bg-space-900 text-slate-200">
                Ưu tiên cao nhất
              </option>
              <option value="dueDate" className="bg-space-900 text-slate-200">
                Hạn chót gần nhất
              </option>
              <option value="alphabetical" className="bg-space-900 text-slate-200">
                Theo bảng chữ cái (A-Z)
              </option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1 flex-shrink-0">
          <Filter className="w-3 h-3 text-cyan-400" />
          <span>Danh mục:</span>
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              onClick={() => {
                playClickSound?.();
                setSelectedCategory(cat.id);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all flex-shrink-0 ${
                isSelected
                  ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
