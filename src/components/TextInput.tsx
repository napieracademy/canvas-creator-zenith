
import React from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label>Text</Label>
      <Textarea
        placeholder="Enter your text here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="resize-none h-32"
      />
    </div>
  );
};

export default TextInput;
