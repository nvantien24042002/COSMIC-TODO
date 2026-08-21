import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, RotateCcw, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose, onUndo }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    info: <Info className="w-4 h-4 text-cyan-400" />,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel border border-white/20 shadow-2xl max-w-sm text-xs sm:text-sm text-slate-100"
      >
        <div className="flex-shrink-0">
          {iconMap[toast.type] || iconMap.info}
        </div>

        <div className="flex-1 font-medium">
          {toast.message}
        </div>

        {toast.undoData && (
          <button
            onClick={() => {
              onUndo(toast.undoData);
              onClose();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold text-xs border border-cyan-500/40 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Hoàn tác</span>
          </button>
        )}

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
