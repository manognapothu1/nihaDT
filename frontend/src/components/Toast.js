import React, { useEffect } from 'react';

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const toastStyles = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-3xl px-5 py-4 text-white shadow-xl ${toastStyles[type]}`}>
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}

export default Toast;
