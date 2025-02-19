
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SafeZoneToggleProps {
  showSafeZone: boolean;
  onShowSafeZoneChange: (value: boolean) => void;
  disabled?: boolean;
}

const SafeZoneToggle: React.FC<SafeZoneToggleProps> = ({ 
  showSafeZone, 
  onShowSafeZoneChange,
  disabled
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/80 hover:bg-white/90 backdrop-blur-sm transition-all duration-200"
            onClick={() => onShowSafeZoneChange(!showSafeZone)}
            disabled={disabled}
            aria-label="Mostra/nascondi i margini di sicurezza dell'immagine"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Mostra/nascondi i margini di sicurezza dell'immagine</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SafeZoneToggle;
