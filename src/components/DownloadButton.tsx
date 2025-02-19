
import React from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface DownloadButtonProps {
  onDownload: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onDownload }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={onDownload}
            size="icon"
            variant="ghost"
            className="bg-white/80 hover:bg-white/90 backdrop-blur-sm transition-all duration-200"
            aria-label="Scarica l'immagine generata"
          >
            <Download className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Scarica l'immagine generata</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DownloadButton;
