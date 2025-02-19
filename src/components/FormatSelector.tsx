
import React from 'react';
import { Button } from '@/components/ui/button';
import { Square, RectangleHorizontal } from 'lucide-react';

interface FormatSelectorProps {
  format: 'post' | 'story';
  onFormatChange: (format: 'post' | 'story') => void;
  disabled?: boolean;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ format, onFormatChange, disabled }) => {
  return (
    <div className="flex gap-2 p-1 rounded-lg bg-muted w-fit">
      <Button
        variant={format === 'post' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onFormatChange('post')}
        className="gap-2"
        disabled={disabled}
      >
        <Square className="h-4.5 w-4.5" />
        Post
      </Button>
      <Button
        variant={format === 'story' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onFormatChange('story')}
        className="gap-2"
        disabled={disabled}
      >
        <RectangleHorizontal className="h-4.5 w-4.5 rotate-90" />
        Story
      </Button>
    </div>
  );
};

export default FormatSelector;
