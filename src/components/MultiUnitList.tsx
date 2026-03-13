import { Unit, convert, UnitCategory } from '../utils/conversions';

interface MultiUnitListProps {
  value: string;
  fromUnit: string;
  category: UnitCategory;
  units: Unit[];
  precision: number;
}

export function MultiUnitList({ value, fromUnit, category, units, precision }: MultiUnitListProps) {
  const numValue = parseFloat(value) || 0;

  return (
    <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
      <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-3">Conversions</h3>
      <div className="grid grid-cols-1 gap-2">
        {units.filter(u => u.id !== fromUnit).map(unit => {
          const converted = convert(numValue, fromUnit, unit.id, category);
          const formatted = converted.toLocaleString(undefined, {
            maximumFractionDigits: precision,
            minimumFractionDigits: 0
          });

          return (
            <div 
              key={unit.id} 
              className="bg-[#252525]/50 border border-[#3a3a3a]/30 rounded-lg p-3 flex items-center justify-between hover:bg-[#252525] transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-gray-400 text-[10px] uppercase font-medium">{unit.name}</span>
                <span className="text-white font-mono text-sm">{formatted}</span>
              </div>
              <span className="bg-[#3a3a3a]/50 text-gray-400 text-[10px] px-2 py-0.5 rounded">
                {unit.symbol}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
