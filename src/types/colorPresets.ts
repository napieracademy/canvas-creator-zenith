
export interface ColorPresetPair {
  name: string;
  background: string;
  text: string;
  category: 'classic' | 'cosmic' | 'featured';
  overlay?: string;
}

export interface ColorPresetsProps {
  onSelectColors: (background: string, text: string, overlay?: string) => void;
  currentBackground: string;
  currentText: string;
  featuredImage?: string;
}
