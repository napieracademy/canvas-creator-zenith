
import React from 'react';
import { Label } from '@/components/ui/label';
import { Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SpacingIconProps {
  spacing: 'small' | 'medium' | 'large';
}

const SpacingIcon: React.FC<SpacingIconProps> = ({ spacing }) => {
  const getSpacing = () => {
    switch (spacing) {
      case 'small': return 'gap-1';
      case 'medium': return 'gap-3';
      case 'large': return 'gap-5';
    }
  };

  return (
    <div className={`flex flex-col items-center ${getSpacing()} h-4`}>
      <div className="w-4 h-[2px] bg-current" />
      <div className="w-4 h-[2px] bg-current" />
    </div>
  );
};

interface SpacingControlProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const SpacingControl: React.FC<SpacingControlProps> = ({ value, onChange, disabled }) => {
  const spacingPresets = [
    { name: 'Stretto', value: 40, iconSpacing: 'small' as const },
    { name: 'Medio', value: 100, iconSpacing: 'medium' as const },
    { name: 'Largo', value: 160, iconSpacing: 'large' as const }
  ];

  return (
    <div className="space-y-2 bg-white/50 rounded-lg p-4">
      <Label className="text-sm font-medium text-gray-700">Spazio tra titolo e descrizione</Label>
      <div className="flex gap-2 mt-2">
        {spacingPresets.map((preset) => {
          const isActive = value === preset.value;
          
          return (
            <TooltipProvider key={preset.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => onChange(preset.value)}
                    disabled={disabled}
                  >
                    <SpacingIcon spacing={preset.iconSpacing} />
                    <span className="ml-2">{preset.name}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Imposta spaziatura {preset.name.toLowerCase()} ({preset.value}px)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
};

export default SpacingControl;
