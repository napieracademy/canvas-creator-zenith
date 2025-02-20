
export interface ColorPresetPair {
  name: string;
  background: string;
  text: string;
  category: 'classic' | 'cosmic' | 'featured' | 'retro' | 'avengers';
  overlay?: string;
  font?: string;
  pattern?: {
    type: 'stripes' | 'dots' | 'grid' | 'checkerboard';
    color1: string;
    color2: string;
    size?: number;
  };
}

export interface ColorPresetsProps {
  onSelectColors: (background: string, text: string, overlay?: string, font?: string) => void;
  currentBackground: string;
  currentText: string;
  featuredImage?: string;
}
