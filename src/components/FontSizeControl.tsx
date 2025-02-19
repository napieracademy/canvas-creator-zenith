
import React from 'react';
import { Label } from './ui/label';
import { Slider } from './ui/slider';

interface FontSizeControlProps {
  value: number;
  onChange: (value: number) => void;
}

const FontSizeControl: React.FC<FontSizeControlProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium text-gray-700">Font Size</Label>
        <span className="text-sm text-gray-500">{value}px</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={32}
        max={120}
        step={1}
        className="w-full"
      />
    </div>
  );
};

export default FontSizeControl;
