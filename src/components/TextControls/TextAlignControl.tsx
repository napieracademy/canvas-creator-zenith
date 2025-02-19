
import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface TextAlignControlProps {
  textAlign: 'left' | 'center' | 'right';
  onTextAlignChange: (value: 'left' | 'center' | 'right') => void;
  disabled?: boolean;
}

const TextAlignControl: React.FC<TextAlignControlProps> = ({ 
  textAlign, 
  onTextAlignChange, 
  disabled 
}) => {
  const AlignIcon = {
    left: AlignLeft,
    center: AlignCenter,
    right: AlignRight
  }[textAlign];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={disabled}>
                <AlignIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onTextAlignChange('left')}>
                <AlignLeft className="h-4 w-4 mr-2" />
                Allinea a sinistra
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTextAlignChange('center')}>
                <AlignCenter className="h-4 w-4 mr-2" />
                Centra
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTextAlignChange('right')}>
                <AlignRight className="h-4 w-4 mr-2" />
                Allinea a destra
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent>
          <p>Allineamento del testo</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TextAlignControl;
