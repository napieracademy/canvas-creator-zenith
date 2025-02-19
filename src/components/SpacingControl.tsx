
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AlignVerticalSpaceBetween } from 'lucide-react';

interface SpacingControlProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const SpacingControl: React.FC<SpacingControlProps> = ({ value, onChange, disabled }) => {
  const handleChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  return (
    <div className="space-y-2 bg-white/50 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <AlignVerticalSpaceBetween className="h-4 w-4 opacity-80" />
        <Label className="text-sm font-medium text-gray-700">Spazio tra titolo e descrizione</Label>
      </div>
      <div className="mt-4">
        <Slider
          value={[value]}
          onValueChange={handleChange}
          min={20}
          max={200}
          step={1}
          disabled={disabled}
        />
        <div className="mt-1 text-xs text-gray-500 text-right">
          {value}px
        </div>
      </div>
    </div>
  );
};

export default SpacingControl;
