
import React from 'react';
import { Label } from './ui/label';
import { Slider } from './ui/slider';

interface FontSizeControlProps {
  value: number;
  effectiveSize: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const FontSizeControl: React.FC<FontSizeControlProps> = ({ value, effectiveSize, onChange, disabled }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium text-gray-700">Dimensione Testo</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Target: {value}px</span>
          {effectiveSize !== value && (
            <span className="text-sm text-orange-500">
              (Adattato: {effectiveSize}px)
            </span>
          )}
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={32}
        max={120}
        step={1}
        className="w-full"
        disabled={disabled}
      />
      <p className="text-xs text-gray-500 mt-1">
        La dimensione effettiva del testo potrebbe essere adattata automaticamente per rimanere all'interno dei margini
      </p>
    </div>
  );
};

export default FontSizeControl;
