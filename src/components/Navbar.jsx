import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Download, 
  Upload, 
  Trash2, 
  RotateCcw, 
  Compass, 
  Clock,
  MoreVertical,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({
  soundEnabled,
  toggleSound,
  onExport,
  onImport,
  onClearCompleted,
  onResetDefault,
  completedCount,
  totalCount,
}) {
  const [time, setTime] = useState(new Date());
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  // Live space clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          onImport(parsed);
          setShowMenu(false);
        } catch (err) {
          alert('Tệp JSON không hợp lệ. Vui lòng kiểm tra lại!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-space-950/60 border-b border-white/10 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between py-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <motion.div 
            className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-full h-full bg-space-900/90 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
          </motion.div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-pink-300 text-lg sm:text-xl">
                COSMIC TODO
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium cosmic-badge-cyan">
                v2.0 Orbit
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
              Trạm Quản Lý Nhiệm Vụ Không Gian
            </p>
          </div>
        </div>

        {/* Live Clock & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Universal Time */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-cyan-300/90">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          {/* Sound FX Toggle */}
          <motion.button
            onClick={toggleSound}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ${
              soundEnabled
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
            aria-label="Toggle Sound Effects"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline text-[11px]">Âm thanh: Bật</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline text-[11px]">Âm thanh: Tắt</span>
              </>
            )}
          </motion.button>

          {/* Actions Dropdown */}
          <div className="relative" ref={menuRef}>
            <motion.button
              onClick={() => setShowMenu((prev) => !prev)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
              title="Tùy chọn dữ liệu & sao lưu"
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 rounded-xl glass-panel shadow-2xl p-1.5 border border-white/15 z-50 text-xs"
                >
                  <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/10 mb-1">
                    Quản lý Dữ liệu
                  </div>

                  <button
                    onClick={() => {
                      onExport();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 text-slate-200 transition-colors text-left"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Xuất nhiệm vụ (.JSON)</span>
                  </button>

                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 text-slate-200 transition-colors text-left"
                  >
                    <Upload className="w-4 h-4 text-purple-400" />
                    <span>Nhập từ tệp JSON</span>
                  </button>

                  {completedCount > 0 && (
                    <button
                      onClick={() => {
                        onClearCompleted();
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-500/20 text-rose-300 transition-colors text-left"
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                      <span>Xóa các mục đã xong ({completedCount})</span>
                    </button>
                  )}

                  <div className="my-1 border-t border-white/10" />

                  <button
                    onClick={() => {
                      if (confirm('Bạn có chắc muốn đặt lại danh sách nhiệm vụ mẫu không gian không?')) {
                        onResetDefault();
                        setShowMenu(false);
                      }
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-amber-500/20 text-amber-300 transition-colors text-left"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    <span>Khôi phục nhiệm vụ mẫu</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
