import React from 'react';
import { Button } from './ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ColorPresetPair {
  name: string;
  background: string;
  text: string;
  category: 'classic' | 'cosmic';
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
    // Temi Classici
    {
      name: "Pure Light",
      background: "#FFFFFF",
      text: "#000000",
      category: 'classic'
    },
    {
      name: "Pure Dark",
      background: "#000000",
      text: "#FFFFFF",
      category: 'classic'
    },
    {
      name: "Cyber Purple",
      background: "#7209B7",
      text: "#4CC9F0",
      category: 'classic'
    },
    {
      name: "Neon Dreams",
      background: "#03071E",
      text: "#48BFE3",
      category: 'classic'
    },
    {
      name: "Electric Coral",
      background: "#F72585",
      text: "#CAF0F8",
      category: 'classic'
    },
    {
      name: "Sunset Vibes",
      background: "#FF6B6B",
      text: "#FFE66D",
      category: 'classic'
    },
    {
      name: "Deep Ocean",
      background: "#14213D",
      text: "#00F5D4",
      category: 'classic'
    },
    {
      name: "Future Pink",
      background: "#231942",
      text: "#FF6B6B",
      category: 'classic'
    },
    {
      name: "Retro Wave",
      background: "#240046",
      text: "#F72585",
      category: 'classic'
    },
    {
      name: "Digital Green",
      background: "#2B2D42",
      text: "#7BF1A8",
      category: 'classic'
    },
    {
      name: "Cosmic Night",
      background: "#10002B",
      text: "#E0AAFF",
      category: 'classic'
    },
    // Temi Cosmici (con gradienti e maggior contrasto)
    {
      name: "Aurora Borealis",
      background: "linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)",
      text: "#F9FF21",
      category: 'cosmic'
    },
    {
      name: "Quantum Flux",
      background: "linear-gradient(135deg, #7209B7 0%, #3B82F6 100%)",
      text: "#4ADE80",
      category: 'cosmic'
    },
    {
      name: "Nebula Storm",
      background: "linear-gradient(135deg, #1E40AF 0%, #7E22CE 100%)",
      text: "#F0ABFC",
      category: 'cosmic'
    },
    {
      name: "Solar Flare",
      background: "linear-gradient(135deg, #FF0080 0%, #FF8C00 100%)",
      text: "#00FFFF",
      category: 'cosmic'
    },
    {
      name: "Plasma Wave",
      background: "linear-gradient(135deg, #6E0DD0 0%, #FF3864 100%)",
      text: "#7FFFD4",
      category: 'cosmic'
    },
    {
      name: "Galactic Core",
      background: "linear-gradient(135deg, #000428 0%, #004E92 100%)",
      text: "#FFD700",
      category: 'cosmic'
    },
    {
      name: "Cosmic Fusion",
      background: "linear-gradient(135deg, #330867 0%, #30CFD0 100%)",
      text: "#FF69B4",
      category: 'cosmic'
    },
    {
      name: "Quantum Realm",
      background: "linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)",
      text: "#FF1493",
      category: 'cosmic'
    }
  ];

  const ColorPaletteCarousel = ({ colors }: { colors: ColorPresetPair[] }) => (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2 md:-ml-4">
        {colors.map((pair) => (
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
  );

  return (
    <div className="space-y-4">
      <Tabs defaultValue="classic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="classic" className="text-sm">
            Temi Classici
          </TabsTrigger>
          <TabsTrigger value="cosmic" className="text-sm">
            Temi Cosmici
          </TabsTrigger>
        </TabsList>
        <TabsContent value="classic" className="mt-4">
          <ColorPaletteCarousel colors={colorPairs.filter(pair => pair.category === 'classic')} />
        </TabsContent>
        <TabsContent value="cosmic" className="mt-4">
          <ColorPaletteCarousel colors={colorPairs.filter(pair => pair.category === 'cosmic')} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColorPresets;
