
import React from 'react';
import { Label } from './ui/label';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from './ui/button';

interface TextAlignControlProps {
  value: 'left' | 'center' | 'right';
  onChange: (value: 'left' | 'center' | 'right') => void;
  disabled?: boolean;
}

const TextAlignControl: React.FC<TextAlignControlProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Allineamento Testo</Label>
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          className={value === 'left' ? 'bg-violet-50 border-violet-200' : ''}
          onClick={() => onChange('left')}
          disabled={disabled}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          className={value === 'center' ? 'bg-violet-50 border-violet-200' : ''}
          onClick={() => onChange('center')}
          disabled={disabled}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          className={value === 'right' ? 'bg-violet-50 border-violet-200' : ''}
          onClick={() => onChange('right')}
          disabled={disabled}
        >
          <AlignRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TextAlignControl;
