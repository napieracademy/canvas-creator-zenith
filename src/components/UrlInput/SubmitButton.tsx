
import React from 'react';
import { Button } from '../ui/button';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface SubmitButtonProps {
  isImageUrl: boolean;
  isLoading: boolean;
}

export const SubmitButton = ({ isImageUrl, isLoading }: SubmitButtonProps) => (
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
