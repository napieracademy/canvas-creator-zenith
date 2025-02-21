
import React from 'react';
import { Link } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import UrlInput from '../UrlInput';

interface UrlFetchControlProps {
  onTitleExtracted: (title: string) => void;
  onDescriptionExtracted: (description: string) => void;
  onTabChange: (value: string) => void;
  onLoadingChange: (loading: boolean) => void;
  disabled?: boolean;
}

const UrlFetchControl: React.FC<UrlFetchControlProps> = ({
  onTitleExtracted,
  onDescriptionExtracted,
  onTabChange,
  onLoadingChange,
  disabled
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

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
              >
                <Link className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <UrlInput 
                onTitleExtracted={onTitleExtracted}
                onDescriptionExtracted={onDescriptionExtracted}
                onTabChange={onTabChange}
                onLoadingChange={onLoadingChange}
              />
            </PopoverContent>
          </Popover>
        </TooltipTrigger>
        <TooltipContent>
          <p>Importa contenuti da URL</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UrlFetchControl;
