
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface SpacingControlProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const SpacingControl: React.FC<SpacingControlProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="space-y-2 bg-white/50 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium text-gray-700">Spazio tra titolo e descrizione</Label>
        <span className="text-sm text-gray-500">{value}px</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={0}
        max={200}
        step={10}
        disabled={disabled}
      />
    </div>
  );
};

export default SpacingControl;
