
export interface ColorPresetPair {
  name: string;
  background: string;
  text: string;
  category: 'classic' | 'cosmic' | 'featured' | 'retro';
  overlay?: string;
  font?: string;
}

export interface ColorPresetsProps {
  onSelectColors: (background: string, text: string, overlay?: string, font?: string) => void;
  currentBackground: string;
  currentText: string;
  featuredImage?: string;
}
