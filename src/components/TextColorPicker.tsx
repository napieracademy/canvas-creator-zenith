
import React from 'react';
import { Label } from './ui/label';
import { SketchPicker } from 'react-color';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface TextColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const TextColorPicker: React.FC<TextColorPickerProps> = ({ color, onChange }) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Text Color</Label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="w-full h-12 rounded-lg border border-white/50 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group flex items-center justify-center gap-2"
            style={{ backgroundColor: color }}
          >
            <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/10 text-white text-sm font-medium">
              Change Text Color
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 border-none rounded-xl shadow-xl">
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

export default TextColorPicker;
