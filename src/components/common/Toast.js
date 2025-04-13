import React, { useEffect, useState } from 'react';
import './animations.css';

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsClosing(true);
    }, duration - 300); // Start fade out animation 300ms before closing

    const closeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center ${isClosing ? 'animate-fade-out' : 'animate-fade-in-up'}`}>
      {type === 'success' && (
        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      )}
      {type === 'error' && (
        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {message}
    </div>
  );
}

export default Toast;
