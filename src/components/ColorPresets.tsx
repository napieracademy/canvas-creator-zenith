
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
    },
    {
      name: "Neon Pulse",
      background: "linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)",
      text: "#F9FF21"
    },
    {
      name: "Toxic Glow",
      background: "linear-gradient(135deg, #D946EF 0%, #F97316 100%)",
      text: "#4ADE80"
    },
    {
      name: "Plasma Fire",
      background: "linear-gradient(135deg, #F97316 0%, #8B5CF6 100%)",
      text: "#22D3EE"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Color Themes</h3>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {colorPairs.map((pair) => (
            <CarouselItem key={pair.name} className="pl-2 md:pl-4 basis-1/4">
              <div className="relative w-12 h-12 mx-auto">
                <Button
                  variant="outline"
                  className={`absolute inset-0 rounded-full p-0 overflow-hidden border-0 hover:opacity-90 transition-all duration-300 ${
                    currentBackground === pair.background && currentText === pair.text
                      ? 'ring-2 ring-primary ring-offset-2' 
                      : ''
                  }`}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%'
                  }}
                  onClick={() => onSelectColors(pair.background, pair.text)}
                >
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-0" 
                      style={{ 
                        background: typeof pair.background === 'string' && pair.background.includes('gradient')
                          ? pair.background
                          : `linear-gradient(135deg, 
                              ${pair.background} 0%, 
                              ${pair.background} 50%, 
                              ${pair.text} 50%, 
                              ${pair.text} 100%
                            )`,
                        borderRadius: '50%'
                      }}
                    >
                      {/* Overlay per il testo nei temi con gradiente */}
                      {typeof pair.background === 'string' && pair.background.includes('gradient') && (
                        <div 
                          className="absolute right-0 bottom-0 w-1/2 h-1/2"
                          style={{
                            background: pair.text,
                            borderTopLeftRadius: '50%'
                          }}
                        />
                      )}
                    </div>
                  </div>
                </Button>
              </div>
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
