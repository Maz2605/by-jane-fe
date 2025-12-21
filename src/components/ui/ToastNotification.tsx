import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper để merge class tailwind (Best practice)
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Định nghĩa các loại thông báo
type ToastType = 'success' | 'error' | 'warning';

interface ToastNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string; // Tiêu đề tùy chọn
  type?: ToastType;
  duration?: number; // Thời gian tự tắt (ms)
}

// Config màu sắc và icon dựa trên Type
const toastConfig = {
  success: {
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-800',
    iconColor: 'text-emerald-500',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  error: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-500',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  warning: { // Dùng cho Logout hoặc cảnh báo
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    iconColor: 'text-amber-500',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
  },
};

const ToastNotification: React.FC<ToastNotificationProps> = ({
  isOpen,
  onClose,
  message,
  title,
  type = 'success',
  duration = 3000,
}) => {
  // Logic tự động đóng sau X giây
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  // Render ra Portal để đảm bảo luôn nằm trên cùng
  // Nếu bạn dùng Next.js App Router, có thể bỏ createPortal và render trực tiếp ở layout
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          // --- Animation Logic ---
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }} // Cách top 20px
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }} // Chuyển động nảy nhẹ
          // -----------------------
          
          className="fixed top-0 left-0 right-0 z-[9999] flex justify-center pointer-events-none" // pointer-events-none để không chặn click chuột xung quanh
        >
          <div
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg min-w-[320px] max-w-md backdrop-blur-sm",
              toastConfig[type].bgColor,
              toastConfig[type].borderColor
            )}
          >
            {/* Icon */}
            <div className={cn("flex-shrink-0 mt-0.5", toastConfig[type].iconColor)}>
              {toastConfig[type].icon}
            </div>

            {/* Content */}
            <div className="flex-1">
              {title && (
                <h3 className={cn("text-sm font-semibold", toastConfig[type].textColor)}>
                  {title}
                </h3>
              )}
              <p className={cn("text-sm mt-1", toastConfig[type].textColor, !title && "font-medium")}>
                {message}
              </p>
            </div>

            {/* Close Button (Optional) */}
            <button
              onClick={onClose}
              className={cn("flex-shrink-0 -mr-1 -mt-1 p-1 rounded-md hover:bg-black/5 transition-colors", toastConfig[type].textColor)}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ToastNotification;