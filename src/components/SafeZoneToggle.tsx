
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid } from 'lucide-react';

interface SafeZoneToggleProps {
  showSafeZone: boolean;
  onShowSafeZoneChange: (value: boolean) => void;
  disabled?: boolean;
}

const SafeZoneToggle: React.FC<SafeZoneToggleProps> = ({ 
  showSafeZone, 
  onShowSafeZoneChange,
  disabled
}) => {
  return (
    <Button
      size="icon"
      variant="ghost"
      className="bg-white/80 hover:bg-white/90 backdrop-blur-sm transition-all duration-200"
      onClick={() => onShowSafeZoneChange(!showSafeZone)}
      disabled={disabled}
      aria-label="Mostra margini di sicurezza"
    >
      <LayoutGrid className="h-4 w-4" />
    </Button>
  );
};

export default SafeZoneToggle;
