'use client';

import { useState, useEffect } from 'react';

export default function Notification({ id, message, type = 'info', onClose, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          if (onClose && id) {
            onClose(id);
          }
        }, 300); // Aguarda animação
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose, id]);

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Chamar onClose imediatamente para remover do array
    if (onClose && id) {
      onClose(id);
    }
    
    // Também esconder visualmente
    setIsVisible(false);
  };

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  if (!isVisible) return null;

  return (
    <div
      className={`relative p-4 rounded-lg shadow-lg border-2 flex items-center gap-3 min-w-[300px] max-w-md transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      } ${typeStyles[type]}`}
      role="alert"
    >
      <span className="text-2xl flex-shrink-0">{icons[type]}</span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={handleClose}
        className="text-gray-500 hover:text-gray-700 text-xl leading-none cursor-pointer"
        aria-label="Fechar notificação"
        type="button"
      >
        ×
      </button>
    </div>
  );
}

