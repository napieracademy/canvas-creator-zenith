
export interface ColorPresetPair {
  name: string;
  background: string;
  text: string;
  category: 'classic' | 'cosmic';
}

export interface ColorPresetsProps {
  onSelectColors: (background: string, text: string) => void;
  currentBackground: string;
  currentText: string;
}
