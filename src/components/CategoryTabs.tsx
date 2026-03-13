interface CategoryTabsProps {
  categories: readonly string[];
  selectedCategory: string;
  onChange: (category: string) => void;
}

const categoryIcons: Record<string, string> = {
  length: '📏',
  mass: '⚖️',
  temperature: '🌡️',
  speed: '🚀',
  area: '📐',
  volume: '🧪',
  time: '⏱️',
  digital: '💾',
  pressure: '🎈',
  energy: '⚡',
  currency: '💰',
};

const categoryLabels: Record<string, string> = {
  length: 'Length',
  mass: 'Mass',
  temperature: 'Temp',
  speed: 'Speed',
  area: 'Area',
  volume: 'Volume',
  time: 'Time',
  digital: 'Digital',
  pressure: 'Pressure',
  energy: 'Energy',
  currency: 'Currency',
};

export function CategoryTabs({ categories, selectedCategory, onChange }: CategoryTabsProps) {
  return (
    <div className="bg-[#0d0d0d]/50 border-b border-[#2a2a2a]">
      <div className="flex overflow-x-auto scrollbar-hide px-2 py-2 gap-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`
              flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
              flex flex-col items-center gap-1 min-w-[60px]
              ${selectedCategory === cat 
                ? 'bg-gradient-to-br from-[#4a9eff] to-[#7b61ff] text-white shadow-lg shadow-[#4a9eff]/20' 
                : 'bg-[#1f1f1f] text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-300'
              }
            `}
          >
            <span className="text-base">{categoryIcons[cat] || '📦'}</span>
            <span>{categoryLabels[cat] || cat}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
