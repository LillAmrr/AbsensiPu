'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
  duration?: number; // Milliseconds
}

const iconMap = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
};

const bgColorMap = {
  success: 'bg-green-100 border-green-400',
  info: 'bg-blue-100 border-blue-400',
  warning: 'bg-yellow-100 border-yellow-400',
  error: 'bg-red-100 border-red-400',
};

const textColorMap = {
  success: 'text-green-800',
  info: 'text-blue-800',
  warning: 'text-yellow-800',
  error: 'text-red-800',
};

export default function Toast({ id, message, type, onClose, duration = 5000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`flex items-center p-4 mb-4 rounded-lg shadow-md border-l-4 ${bgColorMap[type]}`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">
        {iconMap[type]}
      </div>
      <div className={`text-sm font-medium ${textColorMap[type]} flex-grow`}>
        {message}
      </div>
      <button
        onClick={() => onClose(id)}
        className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 ${textColorMap[type]} hover:bg-opacity-80`}
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
