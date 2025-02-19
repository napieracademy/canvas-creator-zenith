
import React from 'react';
import { Button } from './ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
      name: "Cyber Purple",
      background: "#7209B7",
      text: "#4CC9F0"
    },
    {
      name: "Neon Dreams",
      background: "#03071E",
      text: "#48BFE3"
    },
    {
      name: "Electric Coral",
      background: "#F72585",
      text: "#CAF0F8"
    },
    {
      name: "Sunset Vibes",
      background: "#FF6B6B",
      text: "#FFE66D"
    },
    {
      name: "Deep Ocean",
      background: "#14213D",
      text: "#00F5D4"
    },
    {
      name: "Future Pink",
      background: "#231942",
      text: "#FF6B6B"
    },
    {
      name: "Retro Wave",
      background: "#240046",
      text: "#F72585"
    },
    {
      name: "Digital Green",
      background: "#2B2D42",
      text: "#7BF1A8"
    },
    {
      name: "Cosmic Night",
      background: "#10002B",
      text: "#E0AAFF"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Color Themes</h3>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {colorPairs.map((pair) => (
            <CarouselItem key={pair.name} className="pl-2 md:pl-4 basis-1/4">
              <Button
                variant="outline"
                className={`w-full aspect-square p-0 overflow-hidden border-0 hover:opacity-90 transition-all duration-300 ${
                  currentBackground === pair.background && currentText === pair.text
                    ? 'ring-2 ring-primary' 
                    : ''
                }`}
                onClick={() => onSelectColors(pair.background, pair.text)}
              >
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <div 
                    className="absolute inset-0" 
                    style={{ 
                      background: `linear-gradient(135deg, 
                        ${pair.background} 0%, 
                        ${pair.background} 50%, 
                        ${pair.text} 50%, 
                        ${pair.text} 100%
                      )`
                    }}
                  />
                </div>
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12" />
        <CarouselNext className="hidden md:flex -right-12" />
      </Carousel>
    </div>
  );
};

export default ColorPresets;
