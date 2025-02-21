
import React from 'react';
import { Button } from "@/components/ui/button";
import { Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ViewControlsProps {
  viewMode: 'full' | 'fast';
  onViewModeChange: (mode: 'full' | 'fast') => void;
  isLoading: boolean;
}

const ViewControls: React.FC<ViewControlsProps> = ({ viewMode, onViewModeChange, isLoading }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={viewMode === 'fast' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange(viewMode === 'full' ? 'fast' : 'full')}
            disabled={isLoading}
          >
            <Zap className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{viewMode === 'full' ? 'Passa alla modalità semplificata' : 'Torna alla modalità completa'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ViewControls;
