
import React from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface CreditsInputProps {
  value: string;
  onChange: (credits: string) => void;
  disabled?: boolean;
}

const CreditsInput: React.FC<CreditsInputProps> = ({ value, onChange, disabled }) => {
  const formatCredits = (text: string): string => {
    return text
      .split(' · ')
      .map(part => 
        part
          .split(' ')
          .map(word => {
            if (word === word.toUpperCase() && word.length > 1) {
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          })
          .join(' ')
      )
      .join(' · ');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCredits = formatCredits(e.target.value);
    onChange(newCredits);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Credits</Label>
      <Input
        placeholder="Autore · Testata"
        value={value}
        onChange={handleChange}
        className="bg-white/50 backdrop-blur-sm focus:bg-white transition-colors duration-200"
        disabled={disabled}
      />
    </div>
  );
};

export default CreditsInput;
