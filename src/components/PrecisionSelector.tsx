interface PrecisionSelectorProps {
  precision: number;
  onChange: (precision: number) => void;
}

export function PrecisionSelector({ precision, onChange }: PrecisionSelectorProps) {
  return (
    <div className="flex items-center gap-3 bg-[#1a1a1a] p-2 rounded-lg border border-[#2a2a2a]">
      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Decimals</span>
      <div className="flex items-center gap-1">
        {[0, 2, 4, 6].map(val => (
          <button
            key={val}
            onClick={() => onChange(val)}
            className={`
              w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-all
              ${precision === val 
                ? 'bg-[#4a9eff] text-white shadow-lg shadow-[#4a9eff]/20' 
                : 'text-gray-500 hover:text-white hover:bg-[#2a2a2a]'}
            `}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
}
