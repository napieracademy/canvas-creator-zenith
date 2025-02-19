
import React from 'react';
import { Input } from './ui/input';
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
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
          disabled={disabled}
        />
        <TextAlignControl value={textAlign} onChange={onTextAlignChange} disabled={disabled} />
        <FontSizeControl value={fontSize} onChange={onFontSizeChange} disabled={disabled} />
      </div>
    </div>
  );
};

export default TextInput;
