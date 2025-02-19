
import React from 'react';
import { Type } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface FontSizeControlProps {
  fontSize: number;
  onFontSizeChange: (value: number) => void;
  disabled?: boolean;
}

const FontSizeControl: React.FC<FontSizeControlProps> = ({ 
  fontSize, 
  onFontSizeChange, 
  disabled 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" disabled={disabled}>
                <Type className="h-4 w-4" />
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
        </TooltipTrigger>
        <TooltipContent>
          <p>Dimensione del testo</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FontSizeControl;
