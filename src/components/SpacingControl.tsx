
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlignVerticalDistribute } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SpacingControlProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const SpacingControl: React.FC<SpacingControlProps> = ({ value, onChange, disabled }) => {
  const spacingValues = [40, 100, 160];
  
  const handleClick = () => {
    const currentIndex = spacingValues.indexOf(value);
    const nextIndex = (currentIndex + 1) % spacingValues.length;
    onChange(spacingValues[nextIndex]);
  };

  const getSpacingLabel = (value: number) => {
    if (value <= 40) return 'Stretto';
    if (value <= 100) return 'Medio';
    return 'Largo';
  };

  const getSpacingIconStyle = (value: number) => {
    let gap;
    if (value <= 40) gap = "gap-0.5";
    else if (value <= 100) gap = "gap-2";
    else gap = "gap-4";

    return gap;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white/90 backdrop-blur-sm transition-all duration-200"
            disabled={disabled}
            onClick={handleClick}
            aria-label="Regola lo spazio tra titolo e descrizione"
          >
            <div className={`flex flex-col items-center justify-center ${getSpacingIconStyle(value)}`}>
              <div className="w-4 h-0.5 bg-foreground rounded-full"></div>
              <div className="w-4 h-0.5 bg-foreground rounded-full"></div>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Spazio tra titolo e descrizione: {getSpacingLabel(value)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SpacingControl;
