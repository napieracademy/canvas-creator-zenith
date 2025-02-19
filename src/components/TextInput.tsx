
import React from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  textAlign: 'left' | 'center' | 'right';
  onTextAlignChange: (value: 'left' | 'center' | 'right') => void;
  fontSize: number;
  onFontSizeChange: (value: number) => void;
  label: string;
  disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ 
  value, 
  onChange, 
  textAlign, 
  onTextAlignChange,
  fontSize,
  onFontSizeChange,
  label,
  disabled
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <div className="flex gap-2">
          <div className="flex rounded-md border border-input bg-transparent overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={`px-2.5 ${textAlign === 'left' ? 'bg-accent' : ''}`}
              onClick={() => onTextAlignChange('left')}
              disabled={disabled}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-2.5 ${textAlign === 'center' ? 'bg-accent' : ''}`}
              onClick={() => onTextAlignChange('center')}
              disabled={disabled}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-2.5 ${textAlign === 'right' ? 'bg-accent' : ''}`}
              onClick={() => onTextAlignChange('right')}
              disabled={disabled}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2" disabled={disabled}>
                <Type className="h-4 w-4" />
                {fontSize}px
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Dimensione testo</Label>
                  <span className="text-sm text-muted-foreground">{fontSize}px</span>
                </div>
                <Slider
                  value={[fontSize]}
                  onValueChange={(values) => onFontSizeChange(values[0])}
                  min={32}
                  max={120}
                  step={1}
                  disabled={disabled}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <Textarea
        placeholder={`Scrivi il tuo ${label.toLowerCase()} qui...`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="resize-none h-32 bg-white/50 backdrop-blur-sm focus:bg-white transition-colors duration-200"
        style={{ textAlign }}
        disabled={disabled}
      />
    </div>
  );
};

export default TextInput;
