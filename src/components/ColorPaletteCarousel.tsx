
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
      {colors.map((pair) => {
        const isUrl = pair.background.startsWith('url(');
        const isGradient = pair.background.includes('gradient');
        const imageUrl = isUrl ? pair.background.match(/url\((.*?)\)/)?.[1] : null;
        
        return (
          <CarouselItem key={pair.name} className="pl-2 md:pl-4 basis-1/4">
            <div className="relative w-12 h-12 mx-auto">
              <Button
                variant="outline"
                className={`absolute inset-0 rounded-full p-0 overflow-hidden border-0 hover:opacity-90 transition-all duration-300 ${
                  currentBackground.includes(pair.background) && currentText === pair.text
                    ? 'ring-2 ring-primary ring-offset-2' 
                    : ''
                }`}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%'
                }}
                onClick={() => {
                  if (isUrl && pair.overlay) {
                    const overlayStyle = `linear-gradient(${pair.overlay}, ${pair.overlay})`;
                    onSelectColors(`url(${imageUrl}), ${overlayStyle}`, pair.text);
                  } else {
                    onSelectColors(pair.background, pair.text);
                  }
                }}
              >
                <div className="w-full h-full rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-0" 
                    style={{ 
                      backgroundImage: isUrl ? `url(${imageUrl})` : 'none',
                      background: !isUrl ? (isGradient ? pair.background : 'none') : 'none',
                      backgroundColor: (!isUrl && !isGradient) ? pair.background : 'transparent',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '50%'
                    }}
                  >
                    {!isUrl && !isGradient && (
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
                    )}
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
        );
      })}
    </CarouselContent>
    <CarouselPrevious className="hidden md:flex -left-12" />
    <CarouselNext className="hidden md:flex -right-12" />
  </Carousel>
);
