import { useState } from 'react';

interface UnitSwapProps {
  onSwap: () => void;
}

export function UnitSwap({ onSwap }: UnitSwapProps) {
  const [isRotating, setIsRotating] = useState(false);

  const handleClick = () => {
    setIsRotating(true);
    onSwap();
    setTimeout(() => setIsRotating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full bg-[#252525] border border-[#3a3a3a] text-[#4a9eff] hover:border-[#4a9eff] transition-all hover:bg-[#2a2a2a] active:scale-90"
      title="Swap units"
    >
      <svg 
        className={`w-5 h-5 transition-transform duration-300 ${isRotating ? 'rotate-180' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    </button>
  );
}
