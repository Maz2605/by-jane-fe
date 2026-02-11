import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

// Helper để merge class tailwind
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastNotificationProps {
  visible: boolean; // Received from react-hot-toast's t.visible
  message: string;
  type?: ToastType;
  onClose?: () => void; // Optional, defaults to toast.dismiss
  id?: string; // To dismiss specific toast if needed
}

// Config màu sắc và icon
const toastConfig = {
  success: {
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-800',
    iconColor: 'text-emerald-500',
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: 'Thành công'
  },
  error: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-500',
    icon: <AlertCircle className="w-6 h-6" />,
    title: 'Lỗi'
  },
  warning: {
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    iconColor: 'text-amber-500',
    icon: <AlertTriangle className="w-6 h-6" />,
    title: 'Cảnh báo'
  },
  info: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-500',
    icon: <Info className="w-6 h-6" />,
    title: 'Thông tin'
  }
};

const ToastNotification: React.FC<ToastNotificationProps> = ({
  visible,
  message,
  type = 'success',
  onClose,
  id,
}) => {
  const config = toastConfig[type];

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (id) {
      toast.dismiss(id);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className={cn(
            "pointer-events-auto flex w-full max-w-sm rounded-lg shadow-lg p-4",
            config.bgColor,
            config.borderColor,
            "border"
          )}
        >
          <div className="flex-shrink-0 pt-0.5">
            <div className={cn("rounded-full p-1", config.iconColor.replace('text-', 'bg-').replace('500', '100'))}>
              {config.icon}
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className={cn("text-sm font-semibold", config.textColor)}>
              {config.title}
            </p>
            <p className={cn("mt-1 text-sm font-medium opacity-90", config.textColor)}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className={cn(
                "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2",
                config.textColor,
                "hover:bg-black/5"
              )}
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastNotification;