
import React from 'react';
import { Button } from './ui/button';

export interface ColorPresetsProps {
  onSelectColors: (background: string, text: string) => void;
  currentBackground: string;
  currentText: string;
  disabled?: boolean;
}

const ColorPresets: React.FC<ColorPresetsProps> = ({ 
  onSelectColors, 
  currentBackground, 
  currentText,
  disabled 
}) => {
  const presets = [
    { bg: '#8B5CF6', text: '#FFFFFF' },
    { bg: '#EC4899', text: '#FFFFFF' },
    { bg: '#F59E0B', text: '#000000' },
    { bg: '#10B981', text: '#FFFFFF' },
    { bg: '#000000', text: '#FFFFFF' },
    { bg: '#FFFFFF', text: '#000000' },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Colori predefiniti</label>
      <div className="grid grid-cols-6 gap-2">
        {presets.map(({ bg, text }, index) => (
          <Button
            key={index}
            className="w-full h-8 rounded-md border transition-transform hover:scale-110"
            style={{ 
              backgroundColor: bg,
              borderColor: currentBackground === bg ? 'white' : 'transparent',
              boxShadow: currentBackground === bg ? '0 0 0 2px rgba(0,0,0,0.1)' : 'none'
            }}
            onClick={() => onSelectColors(bg, text)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPresets;
