
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorPresetsProps } from '@/types/colorPresets';
import { colorPairs } from '@/data/colorPairs';
import { Button } from './ui/button';

const ColorPresets: React.FC<ColorPresetsProps> = ({ 
  onSelectColors, 
  currentBackground,
  currentText,
  featuredImage 
}) => {
  const featuredTheme = featuredImage ? [{
    name: "Featured Image",
    background: `url(${featuredImage})`,
    text: "#FFFFFF",
    category: 'featured' as const,
    overlay: "rgba(0, 0, 0, 0.5)"
  }] : [];

  const handleColorSelect = (background: string, text: string, overlay?: string, font?: string) => {
    onSelectColors(background, text, overlay, font);
  };

  const ColorGrid = ({ colors }: { colors: typeof colorPairs }) => (
    <div className="grid grid-cols-4 md:grid-cols-6 gap-4 p-2">
      {colors.map((pair) => {
        const isUrl = pair.background.startsWith('url(');
        const isGradient = pair.background.includes('gradient');
        const imageUrl = isUrl ? pair.background.match(/url\((.*?)\)/)?.[1] : null;
        
        return (
          <div key={pair.name} className="flex flex-col items-center gap-2">
            <Button
              variant="outline"
              className={`relative w-12 h-12 rounded-full p-0 overflow-hidden border-0 hover:opacity-90 transition-all duration-300 ${
                currentBackground.includes(pair.background) && currentText === pair.text
                  ? 'ring-2 ring-primary ring-offset-2' 
                  : ''
              }`}
              onClick={() => {
                if (isUrl && pair.overlay) {
                  onSelectColors(`url(${imageUrl})`, pair.text, pair.overlay, pair.font);
                } else {
                  onSelectColors(pair.background, pair.text, undefined, pair.font);
                }
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden">
                <div 
                  className="absolute inset-0" 
                  style={{ 
                    backgroundImage: isUrl ? `url(${imageUrl})` : undefined,
                    background: !isUrl ? (isGradient ? pair.background : undefined) : undefined,
                    backgroundColor: (!isUrl && !isGradient) ? pair.background : undefined,
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
                        backgroundColor: pair.overlay,
                        mixBlendMode: 'multiply'
                      }}
                    />
                  )}
                </div>
              </div>
            </Button>
            <span className="text-xs text-gray-500 text-center">{pair.name}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4">
      <Tabs defaultValue="classic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="classic" className="text-xs px-1">
            Classici
          </TabsTrigger>
          <TabsTrigger value="cosmic" className="text-xs px-1">
            Cosmici
          </TabsTrigger>
          <TabsTrigger value="retro" className="text-xs px-1">
            C64
          </TabsTrigger>
          <TabsTrigger value="featured" className="text-xs px-1" disabled={!featuredImage}>
            Featured
          </TabsTrigger>
        </TabsList>
        <TabsContent value="classic" className="mt-4">
          <ColorGrid colors={colorPairs.filter(pair => pair.category === 'classic')} />
        </TabsContent>
        <TabsContent value="cosmic" className="mt-4">
          <ColorGrid colors={colorPairs.filter(pair => pair.category === 'cosmic')} />
        </TabsContent>
        <TabsContent value="retro" className="mt-4">
          <ColorGrid colors={colorPairs.filter(pair => pair.category === 'retro')} />
        </TabsContent>
        <TabsContent value="featured" className="mt-4">
          {featuredImage && <ColorGrid colors={featuredTheme} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColorPresets;
