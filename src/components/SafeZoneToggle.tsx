
import React from 'react';
import { Button } from '@/components/ui/button';
import { BorderAll } from 'lucide-react';

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
      className="absolute top-3 right-14 bg-white/80 hover:bg-white/90 backdrop-blur-sm transition-all duration-200"
      onClick={() => onShowSafeZoneChange(!showSafeZone)}
      disabled={disabled}
    >
      <BorderAll className="h-4 w-4" />
    </Button>
  );
};

export default SafeZoneToggle;
