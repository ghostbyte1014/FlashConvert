interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
}

export function NumericKeypad({ value, onChange }: NumericKeypadProps) {
  const handleKeyPress = (key: string) => {
    switch (key) {
      case 'C':
        onChange('0');
        break;
      case '⌫':
        onChange(value.length > 1 ? value.slice(0, -1) : '0');
        break;
      case '±':
        if (value === '0') return;
        if (value.startsWith('-')) {
          onChange(value.slice(1));
        } else {
          onChange('-' + value);
        }
        break;
      case '.':
        if (!value.includes('.')) {
          onChange(value + '.');
        }
        break;
      default:
        // Handle digit input
        if (value === '0') {
          onChange(key);
        } else if (value === '-0') {
          onChange('-' + key);
        } else {
          // Limit to reasonable number of digits
          const newValue = value + key;
          if (newValue.replace(/[^0-9]/g, '').length <= 15) {
            onChange(newValue);
          }
        }
    }
  };

  const keys = [
    ['7', '8', '9', '⌫'],
    ['4', '5', '6', 'C'],
    ['1', '2', '3', '±'],
    ['0', '.', '', ''],
  ];

  const renderKey = (key: string, keyIndex: number) => {
    if (key === '') {
      return <div key={`empty-${keyIndex}`} className="btn-keypad invisible" />;
    }

    const isActionKey = key === '⌫' || key === 'C' || key === '±';
    const isZero = key === '0';
    
    return (
      <button
        key={key}
        type="button"
        onClick={() => handleKeyPress(key)}
        className={`
          ${isActionKey ? 'bg-[#2a2a2a] text-[#4a9eff]' : 'bg-[#1f1f1f] text-white'}
          ${isZero ? 'col-span-2' : ''}
          btn-keypad rounded-xl
          hover:brightness-110
          active:scale-95
          text-lg font-medium
        `}
        style={{ height: '64px' }}
      >
        {key}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-4 gap-2 p-4 bg-[#0a0a0a] max-w-lg mx-auto">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="contents">
          {row.map((key, keyIndex) => renderKey(key, keyIndex))}
        </div>
      ))}
    </div>
  );
}
