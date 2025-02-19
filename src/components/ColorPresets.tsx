
import React from 'react';
import { Button } from './ui/button';

interface ColorPresetPair {
  name: string;
  background: string;
  text: string;
}

interface ColorPresetsProps {
  onSelectColors: (background: string, text: string) => void;
  currentBackground: string;
  currentText: string;
}

const ColorPresets: React.FC<ColorPresetsProps> = ({ 
  onSelectColors, 
  currentBackground,
  currentText 
}) => {
  const colorPairs: ColorPresetPair[] = [
    {
      name: "Vivid Purple",
      background: "#8B5CF6",
      text: "#FFFFFF"
    },
    {
      name: "Ocean Blue",
      background: "#0EA5E9",
      text: "#F2FCE2"
    },
    {
      name: "Magenta Impact",
      background: "#D946EF",
      text: "#FFFFFF"
    },
    {
      name: "Dark Mode",
      background: "#1A1F2C",
      text: "#F2FCE2"
    },
    {
      name: "Orange Energy",
      background: "#F97316",
      text: "#FFFFFF"
    },
    {
      name: "Classic Red",
      background: "#ea384c",
      text: "#FFFFFF"
    },
    {
      name: "Royal Purple",
      background: "#7E69AB",
      text: "#FEF7CD"
    },
    {
      name: "Electric Blue",
      background: "#1EAEDB",
      text: "#FFFFFF"
    },
    {
      name: "Modern Dark",
      background: "#403E43",
      text: "#9b87f5"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Color Themes</h3>
      <div className="grid grid-cols-3 gap-3">
        {colorPairs.map((pair) => (
          <Button
            key={pair.name}
            variant="outline"
            className={`h-20 w-full p-2 overflow-hidden flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
              currentBackground === pair.background && currentText === pair.text
                ? 'ring-2 ring-primary'
                : ''
            }`}
            onClick={() => onSelectColors(pair.background, pair.text)}
            style={{ backgroundColor: pair.background }}
          >
            <span className="text-xs font-medium" style={{ color: pair.text }}>
              {pair.name}
            </span>
            <div className="flex gap-1">
              <div
                className="w-3 h-3 rounded-full border border-white/30"
                style={{ backgroundColor: pair.background }}
              />
              <div
                className="w-3 h-3 rounded-full border border-white/30"
                style={{ backgroundColor: pair.text }}
              />
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ColorPresets;
