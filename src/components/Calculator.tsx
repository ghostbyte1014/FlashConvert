import { useState, useEffect, useCallback } from 'react';

type CalcMode = 'standard' | 'scientific';

export function Calculator() {
  const [mode, setMode] = useState<CalcMode>('standard');
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [isError, setIsError] = useState(false);

  // Evaluate the current expression
  const evaluateExpression = useCallback((expr: string) => {
    if (!expr) {
      setResult('0');
      return;
    }
    
    try {
      setIsError(false);
      // Replace symbols for eval
      let cleanExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**');

      // Add missing closing parentheses
      const openParens = (cleanExpr.match(/\(/g) || []).length;
      const closeParens = (cleanExpr.match(/\)/g) || []).length;
      if (openParens > closeParens) {
        cleanExpr += ')'.repeat(openParens - closeParens);
      }

      // Safe eval equivalent using Function for basic math operations
      const func = new Function(`'use strict'; return (${cleanExpr})`);
      const res = func();
      
      if (isNaN(res) || !isFinite(res)) {
        setResult('Error');
        setIsError(true);
      } else {
        // Format to avoid long decimals
        const formatted = Number(res.toFixed(10)).toString();
        setResult(formatted);
      }
    } catch (e) {
      // Don't set error on every partial expression
    }
  }, []);

  // Live evaluation
  useEffect(() => {
    // Only evaluate if last char is a number or closing paren, or predefined constant
    if (expression.match(/[\d\)\pi e]$/)) {
      evaluateExpression(expression);
    } else if (expression === '') {
      setResult('0');
    }
  }, [expression, evaluateExpression]);

  const handleInput = (val: string) => {
    // If there was an error, reset on next input (unless it's an operator)
    if (isError) {
      setIsError(false);
      if (!['+', '-', '×', '÷', '^'].includes(val)) {
        setExpression(val);
        return;
      }
    }
    setExpression(prev => prev === '0' && !['+', '-', '×', '÷', '^', '.'].includes(val) ? val : prev + val);
  };

  const handleClear = () => {
    setExpression('');
    setResult('0');
    setIsError(false);
  };

  const handleDelete = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  const handleEqual = () => {
    evaluateExpression(expression);
  };

  const numBtnClass = "bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white p-4 rounded-2xl text-xl font-semibold transition-colors active:scale-95";
  const opBtnClass = "bg-[#4a9eff]/20 hover:bg-[#4a9eff]/30 text-[#4a9eff] p-4 rounded-2xl text-xl font-bold transition-colors active:scale-95";
  const funcBtnClass = "bg-[#1f1f1f] hover:bg-[#2f2f2f] text-gray-300 p-3 rounded-xl text-sm font-medium transition-colors active:scale-95 border border-[#ffffff0a]";

  return (
    <div className="flex flex-col h-full bg-[#161616] rounded-3xl border border-[#2a2a2a] overflow-hidden shadow-2xl relative">
      {/* Mode Toggle */}
      <div className="absolute top-4 left-4 right-4 flex justify-center z-10">
        <div className="bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10 flex">
          <button 
            onClick={() => setMode('standard')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === 'standard' ? 'bg-[#4a9eff] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Standard
          </button>
          <button 
            onClick={() => setMode('scientific')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === 'scientific' ? 'bg-[#7b61ff] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Scientific
          </button>
        </div>
      </div>

      {/* Display Area */}
      <div className="flex-1 min-h-[200px] flex flex-col justify-end p-8 pb-6 bg-gradient-to-b from-[#1a1a1a] to-[#161616]">
        <div className="text-gray-400 text-right text-lg min-h-[1.75rem] mb-2 font-mono overflow-x-auto whitespace-nowrap scrollbar-hide">
          {expression}
        </div>
        <div className={`text-right text-6xl font-black tracking-tighter break-all leading-none ${isError ? 'text-red-500' : 'text-white'}`}>
          {result}
        </div>
      </div>

      {/* Keypad Area */}
      <div className="p-4 sm:p-6 bg-black/20 flex flex-col gap-4">
        
        {/* Scientific Functions */}
        {mode === 'scientific' && (
          <div className="grid grid-cols-5 gap-2 mb-2">
            <button className={funcBtnClass} onClick={() => handleInput('sin(')}>sin</button>
            <button className={funcBtnClass} onClick={() => handleInput('cos(')}>cos</button>
            <button className={funcBtnClass} onClick={() => handleInput('tan(')}>tan</button>
            <button className={funcBtnClass} onClick={() => handleInput('log(')}>log</button>
            <button className={funcBtnClass} onClick={() => handleInput('ln(')}>ln</button>
            
            <button className={funcBtnClass} onClick={() => handleInput('(')}>(</button>
            <button className={funcBtnClass} onClick={() => handleInput(')')}>)</button>
            <button className={funcBtnClass} onClick={() => handleInput('^')}>x^y</button>
            <button className={funcBtnClass} onClick={() => handleInput('√(')}>√</button>
            <button className={funcBtnClass} onClick={() => handleInput('π')}>π</button>
          </div>
        )}

        {/* Standard Keypad */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-4 rounded-2xl text-xl font-bold transition-colors col-span-2" onClick={handleClear}>AC</button>
          <button className="bg-[#1f1f1f] hover:bg-[#2f2f2f] text-gray-300 p-4 rounded-2xl text-xl font-bold transition-colors" onClick={handleDelete}>⌫</button>
          <button className={opBtnClass} onClick={() => handleInput('÷')}>÷</button>
          
          <button className={numBtnClass} onClick={() => handleInput('7')}>7</button>
          <button className={numBtnClass} onClick={() => handleInput('8')}>8</button>
          <button className={numBtnClass} onClick={() => handleInput('9')}>9</button>
          <button className={opBtnClass} onClick={() => handleInput('×')}>×</button>
          
          <button className={numBtnClass} onClick={() => handleInput('4')}>4</button>
          <button className={numBtnClass} onClick={() => handleInput('5')}>5</button>
          <button className={numBtnClass} onClick={() => handleInput('6')}>6</button>
          <button className={opBtnClass} onClick={() => handleInput('-')}>-</button>
          
          <button className={numBtnClass} onClick={() => handleInput('1')}>1</button>
          <button className={numBtnClass} onClick={() => handleInput('2')}>2</button>
          <button className={numBtnClass} onClick={() => handleInput('3')}>3</button>
          <button className={opBtnClass} onClick={() => handleInput('+')}>+</button>
          
          <button className={`${numBtnClass} col-span-2`} onClick={() => handleInput('0')}>0</button>
          <button className={numBtnClass} onClick={() => handleInput('.')}>.</button>
          <button className="bg-gradient-to-r from-[#4a9eff] to-[#7b61ff] hover:opacity-90 text-white p-4 rounded-2xl text-2xl font-black transition-all shadow-lg" onClick={handleEqual}>=</button>
        </div>
      </div>
    </div>
  );
}
