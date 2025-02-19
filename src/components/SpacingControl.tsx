
import React from 'react';
import { Label } from '@/components/ui/label';
import { ArrowLeftToLine, ArrowLeftRight, ArrowRightToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SpacingControlProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const SpacingControl: React.FC<SpacingControlProps> = ({ value, onChange, disabled }) => {
  const spacingPresets = [
    { name: 'Stretto', value: 40, icon: ArrowLeftToLine },
    { name: 'Medio', value: 100, icon: ArrowLeftRight },
    { name: 'Largo', value: 160, icon: ArrowRightToLine }
  ];

  return (
    <div className="space-y-2 bg-white/50 rounded-lg p-4">
      <Label className="text-sm font-medium text-gray-700">Spazio tra titolo e descrizione</Label>
      <div className="flex gap-2 mt-2">
        {spacingPresets.map((preset) => {
          const Icon = preset.icon;
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
                    <Icon className="h-4 w-4 mr-2" />
                    {preset.name}
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
