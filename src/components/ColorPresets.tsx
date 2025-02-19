
import React from 'react';
import { Button } from './ui/button';

interface ColorPresetsProps {
  onColorSelect: (color: string) => void;
  type: 'background' | 'text';
}

const ColorPresets: React.FC<ColorPresetsProps> = ({ onColorSelect, type }) => {
  const fluorescent = [
    { name: 'Magenta Pink', hex: '#D946EF' },
    { name: 'Bright Orange', hex: '#F97316' },
    { name: 'Bright Blue', hex: '#1EAEDB' },
    { name: 'Vivid Purple', hex: '#8B5CF6' },
  ];

  const effective = [
    { name: 'Primary Purple', hex: '#9b87f5' },
    { name: 'Secondary Purple', hex: '#7E69AB' },
    { name: 'Dark Purple', hex: '#1A1F2C' },
    { name: 'Ocean Blue', hex: '#0EA5E9' },
    { name: 'Red', hex: '#ea384c' },
  ];

  const neutral = [
    { name: 'Neutral Gray', hex: '#8E9196' },
    { name: 'Soft Green', hex: '#F2FCE2' },
    { name: 'Soft Yellow', hex: '#FEF7CD' },
    { name: 'Soft Orange', hex: '#FEC6A1' },
    { name: 'Soft Purple', hex: '#E5DEFF' },
  ];

  return (
    <div className="space-y-4">
      {type === 'background' && (
        <>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Fluorescent</h3>
            <div className="grid grid-cols-4 gap-2">
              {fluorescent.map((color) => (
                <Button
                  key={color.hex}
                  variant="outline"
                  className="h-8 w-full p-0 overflow-hidden"
                  onClick={() => onColorSelect(color.hex)}
                >
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Effective</h3>
            <div className="grid grid-cols-5 gap-2">
              {effective.map((color) => (
                <Button
                  key={color.hex}
                  variant="outline"
                  className="h-8 w-full p-0 overflow-hidden"
                  onClick={() => onColorSelect(color.hex)}
                >
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                </Button>
              ))}
            </div>
          </div>
        </>
      )}

      {type === 'text' && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Text Colors</h3>
          <div className="grid grid-cols-5 gap-2">
            {neutral.map((color) => (
              <Button
                key={color.hex}
                variant="outline"
                className="h-8 w-full p-0 overflow-hidden"
                onClick={() => onColorSelect(color.hex)}
              >
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPresets;
