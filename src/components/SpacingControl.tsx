
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlignVerticalSpaceBetween } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from './ui/label';

interface SpacingControlProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const SpacingControl: React.FC<SpacingControlProps> = ({ value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const getSpacingLabel = (value: number) => {
    if (value <= 40) return 'Stretto';
    if (value <= 100) return 'Medio';
    return 'Largo';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/80 hover:bg-white/90 backdrop-blur-sm transition-all duration-200"
                disabled={disabled}
                aria-label="Regola lo spazio tra titolo e descrizione"
              >
                <AlignVerticalSpaceBetween className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Spazio tra titolo e descrizione</Label>
                  <Select
                    value={String(value)}
                    onValueChange={(val) => onChange(Number(val))}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Scegli la spaziatura" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="40">Stretto</SelectItem>
                      <SelectItem value="100">Medio</SelectItem>
                      <SelectItem value="160">Largo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </TooltipTrigger>
        <TooltipContent>
          <p>Regola lo spazio tra titolo e descrizione</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SpacingControl;
