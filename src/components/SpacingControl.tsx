
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    <div className={`flex flex-col items-center ${getSpacing()} h-5`}>
      <div className="w-5 h-[3px] bg-current rounded-sm" />
      <div className="w-5 h-[3px] bg-current rounded-sm" />
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

  const currentPreset = spacingPresets.find(preset => preset.value === value) || spacingPresets[1];

  return (
    <div className="space-y-2 bg-white/50 rounded-lg p-4">
      <Label className="text-sm font-medium text-gray-700">Spazio tra titolo e descrizione</Label>
      <div className="mt-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              disabled={disabled}
            >
              <div className="flex items-center gap-2">
                <SpacingIcon spacing={currentPreset.iconSpacing} />
                <span>{currentPreset.name}</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {spacingPresets.map((preset) => (
              <DropdownMenuItem
                key={preset.name}
                onClick={() => onChange(preset.value)}
                className="flex items-center gap-2"
              >
                <SpacingIcon spacing={preset.iconSpacing} />
                <span>{preset.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SpacingControl;
