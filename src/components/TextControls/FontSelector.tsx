
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FontSelectorProps {
  currentFont: string;
  onFontChange: (font: string) => void;
  disabled?: boolean;
}

const FontSelector: React.FC<FontSelectorProps> = ({ currentFont, onFontChange, disabled }) => {
  return (
    <div className="space-y-2">
      <Label>Font</Label>
      <Select 
        value={currentFont} 
        onValueChange={onFontChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleziona un font" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Default</SelectItem>
          <SelectItem value="font-c64-system">Press Start 2P</SelectItem>
          <SelectItem value="font-c64-mono">Share Tech Mono</SelectItem>
          <SelectItem value="font-c64-bold">VT323</SelectItem>
          <SelectItem value="font-c64-wide">Silkscreen</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FontSelector;
