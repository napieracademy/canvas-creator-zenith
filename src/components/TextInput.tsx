
import React, { useState } from 'react';
import { Label } from './ui/label';
import FontSizeControl from './FontSizeControl';
import TextAlignControl from './TextAlignControl';

export interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  textAlign: 'left' | 'center' | 'right';
  onTextAlignChange: (value: 'left' | 'center' | 'right') => void;
  fontSize: number;
  onFontSizeChange: (value: number) => void;
  label: string;
  disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  textAlign,
  onTextAlignChange,
  fontSize,
  onFontSizeChange,
  label,
  disabled
}) => {
  const [effectiveSize, setEffectiveSize] = useState(fontSize);

  return (
    <div className="space-y-6 bg-white/50 rounded-lg p-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[100px] resize-y rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          style={{
            textAlign,
            lineHeight: 1.2,
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word'
          }}
          disabled={disabled}
        />
      </div>
      
      <div className="space-y-4">
        <TextAlignControl 
          value={textAlign} 
          onChange={onTextAlignChange} 
          disabled={disabled} 
        />
        <FontSizeControl 
          value={fontSize} 
          effectiveSize={effectiveSize} 
          onChange={onFontSizeChange} 
          disabled={disabled} 
        />
      </div>
    </div>
  );
};

export default TextInput;
