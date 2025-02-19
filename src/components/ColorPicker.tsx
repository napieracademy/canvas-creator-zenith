
import React from 'react';
import { SketchPicker } from 'react-color';
import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  return (
    <div className="space-y-2">
      <Label>Background Color</Label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="w-full h-10 rounded-md border border-input"
            style={{ backgroundColor: color }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-none">
          <SketchPicker
            color={color}
            onChange={(color) => onChange(color.hex)}
            disableAlpha
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
