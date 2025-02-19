
import React from 'react';
import { Button } from './ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ColorPresetPair } from '@/types/colorPresets';

interface ColorPaletteCarouselProps {
  colors: ColorPresetPair[];
  currentBackground: string;
  currentText: string;
  onSelectColors: (background: string, text: string, overlay?: string) => void;
}

export const ColorPaletteCarousel: React.FC<ColorPaletteCarouselProps> = ({
  colors,
  currentBackground,
  currentText,
  onSelectColors
}) => (
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
              onClick={() => onSelectColors(pair.background, pair.text, pair.overlay)}
            >
              <div className="w-full h-full rounded-full overflow-hidden">
                <div 
                  className="absolute inset-0" 
                  style={{ 
                    backgroundImage: pair.background.startsWith('url') 
                      ? pair.background.replace('url(', '').replace(')', '')
                      : 'none',
                    backgroundColor: !pair.background.startsWith('url') 
                      ? pair.background 
                      : 'transparent',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '50%'
                  }}
                >
                  {pair.overlay && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: pair.overlay,
                        mixBlendMode: 'multiply'
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
