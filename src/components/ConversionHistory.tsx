// Conversion History Component

export interface HistoryItem {
  id: string;
  timestamp: number;
  category: string;
  fromUnit: string;
  toUnit: string;
  value: string;
  result: string;
}

interface ConversionHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export function ConversionHistory({ history, onSelect, onClear }: ConversionHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden flex flex-col h-full">
      <div className="p-3 border-b border-[#2a2a2a] flex items-center justify-between bg-[#252525]/30">
        <h3 className="text-xs text-gray-500 uppercase tracking-widest font-bold">Recent History</h3>
        <button 
          onClick={onClear}
          className="text-[10px] text-red-400/70 hover:text-red-400 transition-colors uppercase tracking-tighter"
        >
          Clear
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        <div className="space-y-2">
          {history.map(item => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left bg-[#252525]/40 hover:bg-[#252525] border border-transparent hover:border-[#3a3a3a] p-3 rounded-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#4a9eff] uppercase font-bold tracking-tighter">{item.category}</span>
                <span className="text-[9px] text-gray-600 font-mono">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs truncate">
                <span className="text-white font-mono">{item.value}</span>
                <span className="text-gray-500 truncate">{item.fromUnit}</span>
                <span className="text-[#4a9eff]">→</span>
                <span className="text-white font-mono truncate">{item.result}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
