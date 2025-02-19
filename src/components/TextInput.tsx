
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
      <Label className="text-sm font-medium text-gray-700">Your Text</Label>
      <Textarea
        placeholder="Type your message here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="resize-none h-32 bg-white/50 backdrop-blur-sm focus:bg-white transition-colors duration-200"
      />
    </div>
  );
};

export default TextInput;
