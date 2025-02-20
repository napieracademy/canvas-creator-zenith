import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorPresetsProps, ColorPresetPair } from '@/types/colorPresets';
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
  const generatePatternStyle = (pattern?: ColorPresetPair['pattern']) => {
    if (!pattern) return undefined;
    switch (pattern.type) {
      case 'stripes':
        return `repeating-linear-gradient(
          45deg,
          ${pattern.color1},
          ${pattern.color1} ${pattern.size || 10}px,
          ${pattern.color2} ${pattern.size || 10}px,
          ${pattern.color2} ${(pattern.size || 10) * 2}px
        )`;
      case 'dots':
        return `radial-gradient(
          circle at ${pattern.size || 4}px ${pattern.size || 4}px,
          ${pattern.color2} ${(pattern.size || 4) / 2}px,
          ${pattern.color1} ${(pattern.size || 4) / 2}px
        )`;
      case 'grid':
        return `linear-gradient(
          to right,
          ${pattern.color2} 1px,
          transparent 1px
        ),
        linear-gradient(
          to bottom,
          ${pattern.color2} 1px,
          transparent 1px
        )`;
      case 'checkerboard':
        return `repeating-conic-gradient(
          ${pattern.color1} 0% 25%,
          ${pattern.color2} 0% 50%
        )`;
      default:
        return undefined;
    }
  };
  const ColorGrid = ({
    colors
  }: {
    colors: ColorPresetPair[];
  }) => <div className="grid grid-cols-4 md:grid-cols-6 gap-4 p-2">
      {colors.map(pair => {
      const isUrl = pair.background.startsWith('url(');
      const isGradient = pair.background.includes('gradient');
      const hasPattern = pair.pattern !== undefined;
      const imageUrl = isUrl ? pair.background.match(/url\((.*?)\)/)?.[1] : null;
      const patternStyle = generatePatternStyle(pair.pattern);
      return <div key={pair.name} className="flex flex-col items-center gap-2">
            <Button variant="outline" className={`relative w-12 h-12 rounded-full p-0 overflow-hidden border-0 hover:opacity-90 transition-all duration-300 ${currentBackground.includes(pair.background) && currentText === pair.text ? 'ring-2 ring-primary ring-offset-2' : ''}`} onClick={() => {
          if (isUrl && pair.overlay) {
            handleColorSelect(`url(${imageUrl})`, pair.text, pair.overlay, pair.font);
          } else if (hasPattern && patternStyle) {
            handleColorSelect(patternStyle, pair.text, undefined, pair.font);
          } else {
            handleColorSelect(pair.background, pair.text, undefined, pair.font);
          }
        }}>
              <div className="w-full h-full rounded-full overflow-hidden">
                <div className="absolute inset-0" style={{
              backgroundImage: isUrl ? `url(${imageUrl})` : hasPattern ? patternStyle : undefined,
              background: !isUrl && !hasPattern ? isGradient ? pair.background : undefined : undefined,
              backgroundColor: !isUrl && !isGradient && !hasPattern ? pair.background : undefined,
              backgroundSize: hasPattern ? pair.pattern?.size ? `${pair.pattern.size * 2}px ${pair.pattern.size * 2}px` : '20px 20px' : 'cover',
              backgroundPosition: 'center',
              borderRadius: '50%'
            }}>
                  {!isUrl && !isGradient && !hasPattern && <div className="absolute inset-0" style={{
                background: `linear-gradient(135deg, 
                          ${pair.background} 0%, 
                          ${pair.background} 50%, 
                          ${pair.text} 50%, 
                          ${pair.text} 100%
                        )`
              }} />}
                  {pair.overlay && <div className="absolute inset-0" style={{
                backgroundColor: pair.overlay,
                mixBlendMode: 'multiply'
              }} />}
                </div>
              </div>
            </Button>
            <span className="text-xs text-gray-500 text-center">{pair.name}</span>
          </div>;
    })}
    </div>;
  return <div className="space-y-4">
      <Tabs defaultValue="classic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="classic" className="text-xs px-1">
            Classici
          </TabsTrigger>
          <TabsTrigger value="cosmic" className="text-xs px-1">
            Cosmici
          </TabsTrigger>
          <TabsTrigger value="retro" className="text-xs px-1">
            C64
          </TabsTrigger>
          <TabsTrigger value="avengers" className="text-xs px-1">
            Avengers
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
        <TabsContent value="avengers" className="mt-4">
          <ColorGrid colors={colorPairs.filter(pair => pair.category === 'avengers')} />
        </TabsContent>
        <TabsContent value="featured" className="mt-4">
          {featuredImage && <ColorGrid colors={featuredTheme} />}
        </TabsContent>
      </Tabs>
    </div>;
  function handleColorSelect(background: string, text: string, overlay: string | undefined, font: string | undefined) {
    onSelectColors(background, text, overlay, font);
  }
};
export default ColorPresets;