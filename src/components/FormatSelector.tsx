
import React from 'react';
import { Button } from '@/components/ui/button';
import { Square, RectangleHorizontal } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface FormatSelectorProps {
  format: 'post' | 'story';
  onFormatChange: (format: 'post' | 'story') => void;
  disabled?: boolean;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ format, onFormatChange, disabled }) => {
  return (
    <div className="flex gap-2 p-1 rounded-lg bg-muted w-fit">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={format === 'post' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onFormatChange('post')}
              className="gap-2"
              disabled={disabled}
              aria-label="Formato Post Instagram quadrato"
            >
              <Square className="h-4.5 w-4.5" />
              Post
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
              className="gap-2"
              disabled={disabled}
              aria-label="Formato Story Instagram verticale"
            >
              <RectangleHorizontal className="h-4.5 w-4.5 rotate-90" />
              Story
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

export default FormatSelector;
