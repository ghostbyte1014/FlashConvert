import { useState, useEffect, useCallback } from 'react';
import { NumericKeypad } from './components/NumericKeypad';
import { UnitSelector } from './components/UnitSelector';
import { Toast } from './components/Toast';
import { UnitSwap } from './components/UnitSwap';
import { MultiUnitList } from './components/MultiUnitList';
import { PrecisionSelector } from './components/PrecisionSelector';
import { ConversionHistory, HistoryItem } from './components/ConversionHistory';
import { Calculator } from './components/Calculator';
import {
  UnitCategory,
  convert,
  getUnitsForCategory
} from './utils/conversions';
import { formatCurrency, currencies } from './utils/currency';
import { fetchExchangeRates, isOnline } from './services/api';
import { saveExchangeRates, getExchangeRates, isRatesDataStale } from './services/indexedDB';

// App categories (excluding currency which is handled separately)
const unitCategories: UnitCategory[] = [
  'length', 'mass', 'temperature', 'speed', 'area',
  'volume', 'time', 'digital', 'pressure', 'energy'
];

const appCategories = [...unitCategories, 'currency', 'calculator'] as const;
type AppCategory = typeof appCategories[number];

const categoryIcons: Record<AppCategory, string> = {
  calculator: '🧮',
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

function App() {
  // State
  const [category, setCategory] = useState<AppCategory>('length');
  const [inputValue, setInputValue] = useState('0');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');
  const [result, setResult] = useState('0');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [isOffline, setIsOffline] = useState(false);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [currencyFrom, setCurrencyFrom] = useState('USD');
  const [currencyTo, setCurrencyTo] = useState('EUR');
  const [precision, setPrecision] = useState(2);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('conversion_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Load exchange rates on mount
  useEffect(() => {
    loadExchangeRates();

    // Listen for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync history to localStorage
  useEffect(() => {
    localStorage.setItem('conversion_history', JSON.stringify(history));
  }, [history]);

  // Add to history when result changes (debounced or on a specific trigger)
  // For simplicity and immediate feedback, we'll do it via a more intentional way or just on change
  // Let's add an explicit save or auto-save after a delay
  useEffect(() => {
    if (inputValue === '0' || result === '0') return;

    const timer = setTimeout(() => {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        category: category as any, // Cast to any to match HistoryItem expected UnitCategory for now or fix HistoryItem
        fromUnit: category === 'currency' ? currencyFrom : fromUnit,
        toUnit: category === 'currency' ? currencyTo : toUnit,
        value: inputValue,
        result: result
      };

      setHistory(prev => {
        // Prevent duplicates at the top
        if (prev.length > 0 &&
          prev[0].value === newItem.value &&
          prev[0].fromUnit === newItem.fromUnit &&
          prev[0].toUnit === newItem.toUnit &&
          prev[0].category === newItem.category) {
          return prev;
        }
        return [newItem, ...prev].slice(0, 20); // Keep last 20
      });
    }, 2000); // 2 second debounce for history

    return () => clearTimeout(timer);
  }, [result, category, fromUnit, toUnit, inputValue, currencyFrom, currencyTo]);

  // Update units when category changes
  useEffect(() => {
    if (category === 'calculator') return;

    if (category === 'currency') {
      setCurrencyFrom('USD');
      setCurrencyTo('EUR');
    } else {
      const units = getUnitsForCategory(category);
      if (units.length >= 2) {
        setFromUnit(units[0].id);
        setToUnit(units[1].id);
      }
    }
    setInputValue('0');
    setResult('0');
  }, [category]);

  // Calculate result when input or units change
  useEffect(() => {
    if (category === 'calculator') return;

    const numValue = parseFloat(inputValue) || 0;
    let converted: number;

    if (category === 'currency') {
      if (Object.keys(exchangeRates).length === 0) {
        converted = numValue;
      } else {
        // Currency conversion: USD as base
        const fromRate = exchangeRates[currencyFrom] || 1;
        const toRate = exchangeRates[currencyTo] || 1;
        converted = (numValue / fromRate) * toRate;
      }
    } else {
      converted = convert(numValue, fromUnit, toUnit, category as UnitCategory);
    }

    // Format result
    if (category === 'currency') {
      setResult(formatCurrency(converted, currencyTo));
    } else {
      // Use precision state
      setResult(converted.toLocaleString(undefined, {
        maximumFractionDigits: precision,
        minimumFractionDigits: 0
      }));
    }
  }, [inputValue, fromUnit, toUnit, category, currencyFrom, currencyTo, exchangeRates, precision]);

  const loadExchangeRates = async () => {
    setIsLoadingRates(true);

    try {
      // First, try to get cached rates
      const cached = await getExchangeRates();

      if (cached && cached.rates) {
        setExchangeRates(cached.rates);

        // Check if data is stale (older than 24 hours)
        const stale = await isRatesDataStale(24);

        if (stale && isOnline()) {
          // Fetch fresh data
          try {
            const freshRates = await fetchExchangeRates();
            setExchangeRates(freshRates.rates);
            await saveExchangeRates(freshRates);
          } catch (error) {
            console.warn('Failed to fetch fresh rates, using cached:', error);
          }
        }
      } else if (isOnline()) {
        // No cached data, fetch from API
        const freshRates = await fetchExchangeRates();
        setExchangeRates(freshRates.rates);
        await saveExchangeRates(freshRates);
      } else {
        // Offline with no cached data
        setIsOffline(true);
      }
    } catch (error) {
      console.error('Error loading exchange rates:', error);
      if (!isOnline()) {
        setIsOffline(true);
      }
    } finally {
      setIsLoadingRates(false);
    }
  };

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result);
      setToast({ message: 'Copied ✓', visible: true });
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [result]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      // Parse the pasted value
      const numValue = parseFloat(text.replace(/[^0-9.-]/g, ''));
      if (!isNaN(numValue)) {
        setInputValue(numValue.toString());
      }
    } catch (error) {
      console.error('Failed to paste:', error);
    }
  }, []);

  const currentUnits = category === 'currency' || category === 'calculator'
    ? currencies
    : getUnitsForCategory(category as UnitCategory);

  const getUnitSymbol = (unitId: string): string => {
    if (category === 'currency') {
      const currency = currencies.find(c => c.code === unitId);
      return currency?.symbol || unitId;
    }
    const unit = getUnitsForCategory(category as UnitCategory).find(u => u.id === unitId);
    return unit?.symbol || unitId;
  };

  const getCategoryLabel = (cat: AppCategory): string => {
    const labels: Record<AppCategory, string> = {
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
      currency: 'Currency',
      calculator: 'Calculator',
    };
    return labels[cat];
  };

  const handleSwap = () => {
    if (category === 'currency') {
      const temp = currencyFrom;
      setCurrencyFrom(currencyTo);
      setCurrencyTo(temp);
    } else {
      const temp = fromUnit;
      setFromUnit(toUnit);
      setToUnit(temp);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    if (item.category === 'calculator') return;
    setCategory(item.category as AppCategory);
    setInputValue(item.value);
    if (item.category === 'currency') {
      setCurrencyFrom(item.fromUnit);
      setCurrencyTo(item.toUnit);
    } else {
      setFromUnit(item.fromUnit);
      setToUnit(item.toUnit);
    }
    setResult(item.result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] flex flex-col">
      {/* Header - Brand Identity */}
      <header className="bg-[#0d0d0d]/90 backdrop-blur-sm px-6 py-3 border-b border-[#2a2a2a] z-50">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#4a9eff] to-[#7b61ff] flex items-center justify-center shadow-lg shadow-[#4a9eff]/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-[#4a9eff] to-[#7b61ff] bg-clip-text text-transparent tracking-tight">
                FlashConvert
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                  Premium Experience
                </p>
                {isOffline && (
                  <span className="text-[9px] text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded font-bold border border-yellow-500/20 uppercase">
                    Offline
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <PrecisionSelector
              precision={precision}
              onChange={setPrecision}
            />
            {isLoadingRates && (
              <div className="flex items-center gap-2 text-xs text-yellow-500/80">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                Updating Rates
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1800px] mx-auto w-full">
        {/* Sidebar - Category Navigation */}
        <nav className="w-full lg:w-64 bg-[#121212]/50 border-r border-[#2a2a2a] overflow-y-auto p-3 lg:p-4 scrollbar-hide">
          <div className="mb-4 hidden lg:block">
            <h2 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mb-2 px-2">
              Categories
            </h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-1 gap-1.5">
            {appCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`
                  flex flex-col lg:flex-row items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-[1rem] transition-all duration-300
                  ${category === cat
                    ? 'bg-gradient-to-br from-[#4a9eff]/10 to-[#7b61ff]/10 border border-[#4a9eff]/30 text-[#4a9eff] shadow-lg shadow-[#4a9eff]/5'
                    : 'text-gray-500 hover:text-white hover:bg-[#1f1f1f] border border-transparent'}
                `}
              >
                <span className="text-lg lg:text-base opacity-80 group-hover:opacity-100 transition-opacity">
                  {categoryIcons[cat]}
                </span>
                <span className="text-[10px] lg:text-xs font-bold tracking-tight">
                  {getCategoryLabel(cat)}
                </span>
              </button>
            ))}
          </div>
        </nav>

        {/* Workspace */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 lg:p-8 gap-6 lg:gap-8">

          {category === 'calculator' ? (
            <div className="flex-1 max-w-2xl mx-auto w-full h-full flex flex-col">
              <Calculator />
            </div>
          ) : (
            <>
              {/* Main Controls - Left/Center side */}
              <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin">

                {/* Conversion Result Area */}
                <div className="bg-gradient-to-br from-[#252525] to-[#1a1a1a] rounded-[2.5rem] p-8 lg:p-12 border border-[#3a3a3a]/50 shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#4a9eff] bg-[#4a9eff]/10 px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-[#4a9eff]/20">
                          {getCategoryLabel(category)}
                        </span>
                      </div>
                      <button
                        onClick={handleCopy}
                        className="bg-[#333] hover:bg-[#444] text-[#4a9eff] p-2 rounded-xl transition-all hover:scale-110 active:scale-95 border border-[#4a9eff]/10"
                        title="Copy result"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>

                    <div className="text-5xl lg:text-7xl font-black text-white break-all leading-[1.1] mb-8 text-center tracking-tighter">
                      {result}
                    </div>

                    <div className="flex items-center justify-center gap-4 py-4 bg-black/20 rounded-3xl border border-white/5 backdrop-blur-md">
                      <div className="flex flex-col items-center px-4">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">From</span>
                        <span className="text-lg font-bold text-white">{getUnitSymbol(category === 'currency' ? currencyFrom : fromUnit)}</span>
                      </div>
                      <div className="w-8 h-[2px] bg-gradient-to-r from-transparent via-[#4a9eff] to-transparent" />
                      <div className="flex flex-col items-center px-4">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">To</span>
                        <span className="text-lg font-bold text-[#4a9eff]">{getUnitSymbol(category === 'currency' ? currencyTo : toUnit)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Background Accent */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#4a9eff]/5 to-[#7b61ff]/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                </div>

                {/* Selectors and Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#1f1f1f]/80 rounded-3xl p-6 border border-[#2a2a2a] relative">
                    <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-4">Input Unit</h3>
                    {category === 'currency' ? (
                      <select
                        value={currencyFrom}
                        onChange={(e) => setCurrencyFrom(e.target.value)}
                        className="select-field"
                      >
                        {currencies.map(c => (
                          <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                        ))}
                      </select>
                    ) : (
                      <UnitSelector
                        units={currentUnits}
                        selectedUnit={fromUnit}
                        onChange={setFromUnit}
                        label=""
                      />
                    )}

                    <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-10 hidden md:block">
                      <UnitSwap onSwap={handleSwap} />
                    </div>
                  </div>

                  <div className="bg-[#1f1f1f]/80 rounded-3xl p-6 border border-[#2a2a2a]">
                    <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-4">Output Unit</h3>
                    {category === 'currency' ? (
                      <select
                        value={currencyTo}
                        onChange={(e) => setCurrencyTo(e.target.value)}
                        className="select-field"
                      >
                        {currencies.map(c => (
                          <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                        ))}
                      </select>
                    ) : (
                      <UnitSelector
                        units={currentUnits}
                        selectedUnit={toUnit}
                        onChange={setToUnit}
                        label=""
                      />
                    )}
                  </div>
                </div>

                {/* Multi Unit Quick View */}
                {category !== 'currency' && (
                  <div className="bg-[#161616] rounded-3xl p-6 border border-[#2a2a2a]/50">
                    <MultiUnitList
                      value={inputValue}
                      fromUnit={fromUnit}
                      category={category as UnitCategory}
                      units={currentUnits as any}
                      precision={precision}
                    />
                  </div>
                )}
              </div>

              {/* Controls Column - Right side */}
              <div className="lg:w-96 flex flex-col gap-6">
                <div className="bg-[#1f1f1f] rounded-[2rem] p-6 border border-[#2a2a2a] shadow-xl">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Value</span>
                    <button
                      onClick={handlePaste}
                      className="text-[#4a9eff] hover:bg-[#4a9eff]/10 px-3 py-1 rounded-lg transition-all text-[10px] uppercase font-bold tracking-wider border border-[#4a9eff]/20"
                    >
                      Paste
                    </button>
                  </div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || val === '-' || /^-?\d*\.?\d*$/.test(val)) {
                        setInputValue(val === '' ? '0' : val);
                      }
                    }}
                    className="w-full bg-black/40 text-white text-4xl font-mono text-center p-6 rounded-2xl border border-[#3a3a3a] focus:outline-none focus:border-[#4a9eff] transition-all tracking-tighter"
                    placeholder="0"
                  />
                </div>

                {/* Keypad */}
                <div className="flex-1 bg-black/40 rounded-[2rem] border border-[#2a2a2a] overflow-hidden shadow-inner">
                  <NumericKeypad
                    value={inputValue}
                    onChange={setInputValue}
                  />
                </div>

                {/* History Section - only visible on tablet/desktop or scroll */}
                <div className="h-[250px] lg:h-auto lg:flex-1">
                  <ConversionHistory
                    history={history}
                    onSelect={handleHistorySelect}
                    onClear={() => setHistory([])}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}

export default App;
