
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
    <div className="flex items-center space-x-2">
      <Switch
        id="safe-zone"
        checked={showSafeZone}
        onCheckedChange={onShowSafeZoneChange}
        disabled={disabled}
      />
      <Label htmlFor="safe-zone">Mostra margini di sicurezza</Label>
    </div>
  );
};

export default SafeZoneToggle;
