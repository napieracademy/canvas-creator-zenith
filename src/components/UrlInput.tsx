
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { MetaService } from '@/utils/MetaService';
import { Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface UrlInputProps {
  onTitleExtracted: (title: string) => void;
  onDescriptionExtracted: (description: string) => void;
  onImageExtracted?: (image: string) => void;
  onTabChange?: (value: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ 
  onTitleExtracted, 
  onDescriptionExtracted,
  onImageExtracted,
  onTabChange,
  onLoadingChange 
}) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onLoadingChange?.(true);

    try {
      const result = await MetaService.extractMetadata(url);
      
      if (result.success) {
        let extracted = false;

        if (result.title) {
          onTitleExtracted(result.title);
          extracted = true;
        }
        if (result.description) {
          onDescriptionExtracted(result.description);
          extracted = true;
        }
        if (result.image && onImageExtracted) {
          onImageExtracted(result.image);
          toast({
            title: "Immagine estratta",
            description: "L'immagine di anteprima è stata estratta e aggiunta come tema",
          });
          extracted = true;
        }

        if (extracted) {
          toast({
            title: "Contenuto estratto",
            description: "Il contenuto è stato estratto con successo",
          });
          
          if (onTabChange) {
            onTabChange('manual');
          }
        } else {
          toast({
            title: "Nessun contenuto",
            description: "Nessun contenuto è stato trovato nell'URL specificato",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Errore",
          description: result.error || "Impossibile estrarre i contenuti dall'URL",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in URL submission:', error);
      toast({
        title: "Errore",
        description: "Errore durante il recupero dell'URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">URL dell'articolo</Label>
      <div className="flex gap-2">
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/article"
          className="flex-1"
          required
          disabled={isLoading}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Caricamento...
                  </>
                ) : (
                  "Estrai contenuti"
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Estrai automaticamente titolo e descrizione dall'URL</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </form>
  );
};

export default UrlInput;
