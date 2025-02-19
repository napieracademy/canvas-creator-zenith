
import React from 'react';
import { Label } from './ui/label';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from './ui/button';

interface TextAlignControlProps {
  value: 'left' | 'center' | 'right';
  onChange: (value: 'left' | 'center' | 'right') => void;
}

const TextAlignControl: React.FC<TextAlignControlProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Text Alignment</Label>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className={`flex-1 ${value === 'left' ? 'bg-violet-50 border-violet-200' : ''}`}
          onClick={() => onChange('left')}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          className={`flex-1 ${value === 'center' ? 'bg-violet-50 border-violet-200' : ''}`}
          onClick={() => onChange('center')}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          className={`flex-1 ${value === 'right' ? 'bg-violet-50 border-violet-200' : ''}`}
          onClick={() => onChange('right')}
        >
          <AlignRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TextAlignControl;
