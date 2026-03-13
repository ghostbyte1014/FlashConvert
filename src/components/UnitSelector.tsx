import React from 'react';
import { Unit } from '../utils/conversions';
import { Currency } from '../utils/currency';

interface UnitSelectorProps {
  units: Unit[] | Currency[];
  selectedUnit: string;
  onChange: (unitId: string) => void;
  label: string;
}

export function UnitSelector({ units, selectedUnit, onChange, label }: UnitSelectorProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 uppercase tracking-wide">{label}</label>
      <select
        value={selectedUnit}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="w-full bg-[#252525] text-white p-3 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-[#4a9eff]"
      >
        {units.map((unit) => (
          <option key={'id' in unit ? unit.id : unit.code} value={'id' in unit ? unit.id : unit.code}>
            {'id' in unit ? unit.name : `${unit.code} - ${unit.name}`} ({'symbol' in unit ? unit.symbol : ''})
          </option>
        ))}
      </select>
    </div>
  );
}
