
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
    category: 'featured',
    overlay: "rgba(0, 0, 0, 0.5)"
  }] : [];

  return (
    <div className="space-y-4">
      <Tabs defaultValue="classic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="classic" className="text-sm">
            Temi Classici
          </TabsTrigger>
          <TabsTrigger value="cosmic" className="text-sm">
            Temi Cosmici
          </TabsTrigger>
          <TabsTrigger value="featured" className="text-sm" disabled={!featuredImage}>
            Featured Image
          </TabsTrigger>
        </TabsList>
        <TabsContent value="classic" className="mt-4">
          <ColorPaletteCarousel 
            colors={colorPairs.filter(pair => pair.category === 'classic')}
            currentBackground={currentBackground}
            currentText={currentText}
            onSelectColors={onSelectColors}
          />
        </TabsContent>
        <TabsContent value="cosmic" className="mt-4">
          <ColorPaletteCarousel 
            colors={colorPairs.filter(pair => pair.category === 'cosmic')}
            currentBackground={currentBackground}
            currentText={currentText}
            onSelectColors={onSelectColors}
          />
        </TabsContent>
        <TabsContent value="featured" className="mt-4">
          {featuredImage && (
            <ColorPaletteCarousel 
              colors={featuredTheme}
              currentBackground={currentBackground}
              currentText={currentText}
              onSelectColors={(bg, text, overlay) => onSelectColors(bg, text, overlay)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColorPresets;
