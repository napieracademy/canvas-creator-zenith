
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorPresetsProps } from '@/types/colorPresets';
import { colorPairs } from '@/data/colorPairs';
import { ColorPaletteCarousel } from './ColorPaletteCarousel';

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
          <ColorPaletteCarousel 
            colors={colorPairs.filter(pair => pair.category === 'classic')}
            currentBackground={currentBackground}
            currentText={currentText}
            onSelectColors={handleColorSelect}
          />
        </TabsContent>
        <TabsContent value="cosmic" className="mt-4">
          <ColorPaletteCarousel 
            colors={colorPairs.filter(pair => pair.category === 'cosmic')}
            currentBackground={currentBackground}
            currentText={currentText}
            onSelectColors={handleColorSelect}
          />
        </TabsContent>
        <TabsContent value="retro" className="mt-4">
          <ColorPaletteCarousel 
            colors={colorPairs.filter(pair => pair.category === 'retro')}
            currentBackground={currentBackground}
            currentText={currentText}
            onSelectColors={handleColorSelect}
          />
        </TabsContent>
        <TabsContent value="featured" className="mt-4">
          {featuredImage && (
            <ColorPaletteCarousel 
              colors={featuredTheme}
              currentBackground={currentBackground}
              currentText={currentText}
              onSelectColors={handleColorSelect}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColorPresets;
