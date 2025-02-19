
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
          {colorPairs.map((pair, index) => (
            <CarouselItem key={pair.name} className="pl-2 md:pl-4 basis-1/3">
              <Button
                variant="outline"
                className={`h-24 w-full p-2 overflow-hidden flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105 ${
                  currentBackground === pair.background && currentText === pair.text
                    ? 'ring-2 ring-primary shadow-lg'
                    : ''
                }`}
                onClick={() => onSelectColors(pair.background, pair.text)}
                style={{ 
                  backgroundColor: pair.background,
                  border: `1px solid ${pair.text}40`
                }}
              >
                <span 
                  className="text-sm font-medium tracking-wide" 
                  style={{ 
                    color: pair.text,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {pair.name}
                </span>
                <div className="flex gap-2">
                  <div
                    className="w-4 h-4 rounded-full shadow-inner"
                    style={{ 
                      backgroundColor: pair.background,
                      border: `2px solid ${pair.text}80`
                    }}
                  />
                  <div
                    className="w-4 h-4 rounded-full shadow-inner"
                    style={{ 
                      backgroundColor: pair.text,
                      border: `2px solid ${pair.text}80`
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
