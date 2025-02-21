
import React from 'react';
import { Button } from '../ui/button';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

interface SubmitButtonProps {
  isImageUrl: boolean;
  isLoading: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isImageUrl, isLoading }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isImageUrl ? (
            <ImageIcon className="mr-2 h-4 w-4" />
          ) : null}
          {isImageUrl ? "Carica immagine" : "Estrai contenuti"}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {isImageUrl 
            ? "Carica un'immagine da URL" 
            : "Estrai automaticamente titolo e descrizione dall'URL"}
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
