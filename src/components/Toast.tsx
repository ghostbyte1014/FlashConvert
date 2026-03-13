import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, visible, onClose, duration = 2000 }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 200);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible && !show) return null;

  return (
    <div
      className={`
        fixed bottom-20 left-1/2 -translate-x-1/2 
        bg-[#252525] text-white px-4 py-2 rounded-lg
        shadow-lg border border-[#3a3a3a]
        transition-all duration-200 z-50
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-[#4a9eff]">✓</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
