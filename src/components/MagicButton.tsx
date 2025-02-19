
import React from 'react';
import { Button } from './ui/button';
import { Wand2 } from 'lucide-react';

interface MagicButtonProps {
  onMagicOptimization: () => void;
  disabled?: boolean;
}

const MagicButton: React.FC<MagicButtonProps> = ({ onMagicOptimization, disabled }) => {
  return (
    <Button 
      onClick={onMagicOptimization}
      size="icon"
      variant="ghost"
      className="bg-white/80 hover:bg-white/90 backdrop-blur-sm transition-all duration-200"
      disabled={disabled}
      aria-label="Ottimizza layout automaticamente"
    >
      <Wand2 className="h-4 w-4" />
    </Button>
  );
};

export default MagicButton;
