
import React from 'react';
import { Button } from './ui/button';
import { Wand2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface MagicButtonProps {
  onMagicOptimization: () => void;
  disabled?: boolean;
}

const MagicButton: React.FC<MagicButtonProps> = ({ onMagicOptimization, disabled }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={onMagicOptimization}
            size="icon"
            variant="ghost"
            className="bg-white/80 hover:bg-white/90 backdrop-blur-sm transition-all duration-200"
            disabled={disabled}
            aria-label="Ottimizza automaticamente il layout del testo"
          >
            <Wand2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ottimizza automaticamente il layout del testo</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MagicButton;
