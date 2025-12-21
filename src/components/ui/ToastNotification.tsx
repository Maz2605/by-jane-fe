import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper để merge class tailwind
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Định nghĩa các loại thông báo
type ToastType = 'success' | 'error' | 'warning';

interface ToastNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
  type?: ToastType;
  duration?: number;
  action?: React.ReactNode; // <--- MỚI: Thêm prop này để nhận nút bấm
}

// Config màu sắc và icon (Giữ nguyên bản gốc bạn thích)
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
  warning: {
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    iconColor: 'text-amber-500',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
  action, // <--- Destructure action
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Logic tự động đóng: Nếu có action thì chờ lâu hơn (8s), không thì 3s
  useEffect(() => {
    if (isOpen) {
      const autoCloseDuration = action ? 8000 : duration;
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose, action]);

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed top-0 left-0 right-0 z-[9999] flex justify-center pointer-events-none px-4"
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

            {/* Content Container */}
            <div className="flex-1 min-w-0">
              {/* Title & Message */}
              <div>
                {title && (
                  <h3 className={cn("text-sm font-bold", toastConfig[type].textColor)}>
                    {title}
                  </h3>
                )}
                <p className={cn("text-sm mt-1 leading-relaxed", toastConfig[type].textColor, !title && "font-medium")}>
                  {message}
                </p>
              </div>

              {/* --- ACTION AREA (Nút bấm hiển thị ở đây) --- */}
              {action && (
                <div className="mt-3 animate-enter">
                  {action}
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={cn("flex-shrink-0 -mr-1 -mt-1 p-1 rounded-md hover:bg-black/10 transition-colors", toastConfig[type].textColor)}
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