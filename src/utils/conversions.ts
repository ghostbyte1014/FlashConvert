// Unit conversion utilities - all done client-side

export type UnitCategory = 
  | 'length' 
  | 'mass' 
  | 'temperature' 
  | 'speed' 
  | 'area' 
  | 'volume' 
  | 'time' 
  | 'digital' 
  | 'pressure' 
  | 'energy'

export interface Unit {
  id: string
  name: string
  symbol: string
}

export interface UnitDefinition {
  category: UnitCategory
  units: Unit[]
}

const lengthUnits: UnitDefinition = {
  category: 'length',
  units: [
    { id: 'meter', name: 'Meter', symbol: 'm' },
    { id: 'kilometer', name: 'Kilometer', symbol: 'km' },
    { id: 'centimeter', name: 'Centimeter', symbol: 'cm' },
    { id: 'millimeter', name: 'Millimeter', symbol: 'mm' },
    { id: 'mile', name: 'Mile', symbol: 'mi' },
    { id: 'yard', name: 'Yard', symbol: 'yd' },
    { id: 'foot', name: 'Foot', symbol: 'ft' },
    { id: 'inch', name: 'Inch', symbol: 'in' },
    { id: 'nautical_mile', name: 'Nautical Mile', symbol: 'nmi' },
  ],
}

const lengthConversions: Record<string, number> = {
  meter: 1,
  kilometer: 1000,
  centimeter: 0.01,
  millimeter: 0.001,
  mile: 1609.344,
  yard: 0.9144,
  foot: 0.3048,
  inch: 0.0254,
  nautical_mile: 1852,
}

const massUnits: UnitDefinition = {
  category: 'mass',
  units: [
    { id: 'kilogram', name: 'Kilogram', symbol: 'kg' },
    { id: 'gram', name: 'Gram', symbol: 'g' },
    { id: 'milligram', name: 'Milligram', symbol: 'mg' },
    { id: 'metric_ton', name: 'Metric Ton', symbol: 't' },
    { id: 'pound', name: 'Pound', symbol: 'lb' },
    { id: 'ounce', name: 'Ounce', symbol: 'oz' },
    { id: 'stone', name: 'Stone', symbol: 'st' },
  ],
}

const massConversions: Record<string, number> = {
  kilogram: 1,
  gram: 0.001,
  milligram: 0.000001,
  metric_ton: 1000,
  pound: 0.45359237,
  ounce: 0.0283495231,
  stone: 6.35029318,
}

const temperatureUnits: UnitDefinition = {
  category: 'temperature',
  units: [
    { id: 'celsius', name: 'Celsius', symbol: '°C' },
    { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F' },
    { id: 'kelvin', name: 'Kelvin', symbol: 'K' },
  ],
}

const speedUnits: UnitDefinition = {
  category: 'speed',
  units: [
    { id: 'mps', name: 'Meters per Second', symbol: 'm/s' },
    { id: 'kmh', name: 'Kilometers per Hour', symbol: 'km/h' },
    { id: 'mph', name: 'Miles per Hour', symbol: 'mph' },
    { id: 'knot', name: 'Knot', symbol: 'kn' },
    { id: 'fts', name: 'Feet per Second', symbol: 'ft/s' },
  ],
}

const speedConversions: Record<string, number> = {
  mps: 1,
  kmh: 0.277778,
  mph: 0.44704,
  knot: 0.514444,
  fts: 0.3048,
}

const areaUnits: UnitDefinition = {
  category: 'area',
  units: [
    { id: 'sqmeter', name: 'Square Meter', symbol: 'm²' },
    { id: 'sqkilometer', name: 'Square Kilometer', symbol: 'km²' },
    { id: 'sqcentimeter', name: 'Square Centimeter', symbol: 'cm²' },
    { id: 'sqmile', name: 'Square Mile', symbol: 'mi²' },
    { id: 'sqyard', name: 'Square Yard', symbol: 'yd²' },
    { id: 'sqfoot', name: 'Square Foot', symbol: 'ft²' },
    { id: 'sqinch', name: 'Square Inch', symbol: 'in²' },
    { id: 'hectare', name: 'Hectare', symbol: 'ha' },
    { id: 'acre', name: 'Acre', symbol: 'ac' },
  ],
}

const areaConversions: Record<string, number> = {
  sqmeter: 1,
  sqkilometer: 1000000,
  sqcentimeter: 0.0001,
  sqmile: 2589988.110336,
  sqyard: 0.83612736,
  sqfoot: 0.09290304,
  sqinch: 0.00064516,
  hectare: 10000,
  acre: 4046.8564224,
}

const volumeUnits: UnitDefinition = {
  category: 'volume',
  units: [
    { id: 'liter', name: 'Liter', symbol: 'L' },
    { id: 'milliliter', name: 'Milliliter', symbol: 'mL' },
    { id: 'cubicmeter', name: 'Cubic Meter', symbol: 'm³' },
    { id: 'gallon_us', name: 'US Gallon', symbol: 'gal' },
    { id: 'gallon_uk', name: 'UK Gallon', symbol: 'gal' },
    { id: 'quart', name: 'Quart', symbol: 'qt' },
    { id: 'pint', name: 'Pint', symbol: 'pt' },
    { id: 'cup', name: 'Cup', symbol: 'cup' },
    { id: 'fluidounce', name: 'Fluid Ounce', symbol: 'fl oz' },
    { id: 'cubicfoot', name: 'Cubic Foot', symbol: 'ft³' },
    { id: 'cubicinch', name: 'Cubic Inch', symbol: 'in³' },
  ],
}

const volumeConversions: Record<string, number> = {
  liter: 1,
  milliliter: 0.001,
  cubicmeter: 1000,
  gallon_us: 3.785411784,
  gallon_uk: 4.54609,
  quart: 0.946352946,
  pint: 0.473176473,
  cup: 0.2365882365,
  fluidounce: 0.0295735295625,
  cubicfoot: 28.316846592,
  cubicinch: 0.016387064,
}

const timeUnits: UnitDefinition = {
  category: 'time',
  units: [
    { id: 'second', name: 'Second', symbol: 's' },
    { id: 'millisecond', name: 'Millisecond', symbol: 'ms' },
    { id: 'minute', name: 'Minute', symbol: 'min' },
    { id: 'hour', name: 'Hour', symbol: 'h' },
    { id: 'day', name: 'Day', symbol: 'd' },
    { id: 'week', name: 'Week', symbol: 'wk' },
    { id: 'month', name: 'Month (30d)', symbol: 'mo' },
    { id: 'year', name: 'Year (365d)', symbol: 'yr' },
  ],
}

const timeConversions: Record<string, number> = {
  second: 1,
  millisecond: 0.001,
  minute: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2592000,
  year: 31536000,
}

const digitalUnits: UnitDefinition = {
  category: 'digital',
  units: [
    { id: 'byte', name: 'Byte', symbol: 'B' },
    { id: 'kilobyte', name: 'Kilobyte', symbol: 'KB' },
    { id: 'megabyte', name: 'Megabyte', symbol: 'MB' },
    { id: 'gigabyte', name: 'Gigabyte', symbol: 'GB' },
    { id: 'terabyte', name: 'Terabyte', symbol: 'TB' },
    { id: 'petabyte', name: 'Petabyte', symbol: 'PB' },
    { id: 'bit', name: 'Bit', symbol: 'b' },
    { id: 'kilobit', name: 'Kilobit', symbol: 'Kb' },
    { id: 'megabit', name: 'Megabit', symbol: 'Mb' },
    { id: 'gigabit', name: 'Gigabit', symbol: 'Gb' },
  ],
}

const digitalConversions: Record<string, number> = {
  byte: 1,
  kilobyte: 1024,
  megabyte: 1048576,
  gigabyte: 1073741824,
  terabyte: 1099511627776,
  petabyte: 1125899906842624,
  bit: 0.125,
  kilobit: 128,
  megabit: 131072,
  gigabit: 134217728,
}

const pressureUnits: UnitDefinition = {
  category: 'pressure',
  units: [
    { id: 'pascal', name: 'Pascal', symbol: 'Pa' },
    { id: 'kilopascal', name: 'Kilopascal', symbol: 'kPa' },
    { id: 'bar', name: 'Bar', symbol: 'bar' },
    { id: 'atm', name: 'Atmosphere', symbol: 'atm' },
    { id: 'psi', name: 'PSI', symbol: 'psi' },
    { id: 'torr', name: 'Torr', symbol: 'Torr' },
    { id: 'mmhg', name: 'mmHg', symbol: 'mmHg' },
  ],
}

const pressureConversions: Record<string, number> = {
  pascal: 1,
  kilopascal: 1000,
  bar: 100000,
  atm: 101325,
  psi: 6894.757293168,
  torr: 133.322368,
  mmhg: 133.322387,
}

const energyUnits: UnitDefinition = {
  category: 'energy',
  units: [
    { id: 'joule', name: 'Joule', symbol: 'J' },
    { id: 'kilojoule', name: 'Kilojoule', symbol: 'kJ' },
    { id: 'calorie', name: 'Calorie', symbol: 'cal' },
    { id: 'kilocalorie', name: 'Kilocalorie', symbol: 'kcal' },
    { id: 'watt_hour', name: 'Watt Hour', symbol: 'Wh' },
    { id: 'kilowatt_hour', name: 'Kilowatt Hour', symbol: 'kWh' },
    { id: 'btu', name: 'BTU', symbol: 'BTU' },
    { id: 'electronvolt', name: 'Electron Volt', symbol: 'eV' },
  ],
}

const energyConversions: Record<string, number> = {
  joule: 1,
  kilojoule: 1000,
  calorie: 4.184,
  kilocalorie: 4184,
  watt_hour: 3600,
  kilowatt_hour: 3600000,
  btu: 1055.05585262,
  electronvolt: 1.602176634e-19,
}

const definitions: Record<UnitCategory, UnitDefinition> = {
  length: lengthUnits,
  mass: massUnits,
  temperature: temperatureUnits,
  speed: speedUnits,
  area: areaUnits,
  volume: volumeUnits,
  time: timeUnits,
  digital: digitalUnits,
  pressure: pressureUnits,
  energy: energyUnits,
}

const conversions: Record<UnitCategory, Record<string, number>> = {
  length: lengthConversions,
  mass: massConversions,
  temperature: {},
  speed: speedConversions,
  area: areaConversions,
  volume: volumeConversions,
  time: timeConversions,
  digital: digitalConversions,
  pressure: pressureConversions,
  energy: energyConversions,
}

function temperatureToBase(value: number, fromUnit: string): number {
  switch (fromUnit) {
    case 'celsius': return value
    case 'fahrenheit': return (value - 32) * 5/9
    case 'kelvin': return value - 273.15
    default: return value
  }
}

function temperatureFromBase(value: number, toUnit: string): number {
  switch (toUnit) {
    case 'celsius': return value
    case 'fahrenheit': return value * 9/5 + 32
    case 'kelvin': return value + 273.15
    default: return value
  }
}

export function getUnitsForCategory(category: UnitCategory): Unit[] {
  return definitions[category]?.units || []
}

export function convert(
  value: number, 
  fromUnit: string, 
  toUnit: string, 
  category: UnitCategory
): number {
  if (category === 'temperature') {
    const baseValue = temperatureToBase(value, fromUnit)
    return temperatureFromBase(baseValue, toUnit)
  }
  
  const categoryConversions = conversions[category]
  if (!categoryConversions) return value
  
  const fromFactor = categoryConversions[fromUnit] || 1
  const toFactor = categoryConversions[toUnit] || 1
  
  const baseValue = value * fromFactor
  return baseValue / toFactor
}

export function getCategoryLabel(category: UnitCategory): string {
  const labels: Record<UnitCategory, string> = {
    length: 'Length',
    mass: 'Mass',
    temperature: 'Temperature',
    speed: 'Speed',
    area: 'Area',
    volume: 'Volume',
    time: 'Time',
    digital: 'Digital Storage',
    pressure: 'Pressure',
    energy: 'Energy',
  }
  return labels[category]
}

export const allCategories: UnitCategory[] = [
  'length', 'mass', 'temperature', 'speed', 'area', 
  'volume', 'time', 'digital', 'pressure', 'energy'
]

export const categoryLabels: Record<string, string> = {
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
}

export const categoryIcons: Record<string, string> = {
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
}
