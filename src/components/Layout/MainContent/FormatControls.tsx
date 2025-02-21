
import React from 'react';
import { Button } from "@/components/ui/button";
import { Square, RectangleVertical } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FormatControlsProps {
  format: 'post' | 'story';
  onFormatChange: (format: 'post' | 'story') => void;
  isLoading: boolean;
}

const FormatControls: React.FC<FormatControlsProps> = ({ format, onFormatChange, isLoading }) => {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={format === 'post' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onFormatChange('post')}
              disabled={isLoading}
            >
              <Square className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Formato Post Instagram quadrato</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={format === 'story' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onFormatChange('story')}
              disabled={isLoading}
            >
              <RectangleVertical className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Formato Story Instagram verticale</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FormatControls;
