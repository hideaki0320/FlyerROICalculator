import React, { useState, useEffect } from 'react';

interface InputControlProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  highlight?: boolean;
}

export const InputControl: React.FC<InputControlProps> = ({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  unit = '',
  highlight = false
}) => {
  const [localValue, setLocalValue] = useState(value.toString());

  useEffect(() => {
    // Only update local state if the prop value is significantly different 
    // (to avoid resetting while user types "1.")
    if (Number(localValue) !== value) {
      setLocalValue(value.toString());
    }
  }, [value]);

  const toHalfWidth = (str: string) => {
    return str.replace(/[０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawVal = e.target.value;
    // Normalize full-width numbers immediately for display consistency if desired, 
    // or just process them for the numeric check. 
    // Here we keep raw input for typing feel, but calculate with normalized.
    setLocalValue(rawVal);
    
    if (rawVal === '') {
      onChange(0);
      return;
    }

    const normalized = toHalfWidth(rawVal);
    const num = Number(normalized);
    
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    const normalized = toHalfWidth(localValue);
    let num = Number(normalized);
    
    if (isNaN(num)) {
      setLocalValue(value.toString());
      return;
    }

    // Clamp
    let clamped = num;
    if (clamped < min) clamped = min;
    if (clamped > max) clamped = max;

    if (clamped !== value) {
      onChange(clamped);
    }
    setLocalValue(clamped.toString());
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className={`text-sm font-medium ${highlight ? 'text-emerald-400' : 'text-slate-300'}`}>
          {label}
        </label>
        <div className="flex items-center space-x-1">
          <input
            type="text"
            inputMode="decimal"
            className="w-24 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-right text-sm text-white focus:outline-none focus:border-blue-500"
            value={localValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          <span className="text-xs text-slate-400 w-4">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const val = Number(e.target.value);
          setLocalValue(val.toString());
          onChange(val);
        }}
        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
      />
    </div>
  );
};