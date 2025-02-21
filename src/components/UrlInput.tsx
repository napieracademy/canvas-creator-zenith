
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { useToast } from './ui/use-toast';
import { MetaService } from '@/utils/MetaService';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import ApiKeyInput from './ApiKeyInput';

interface UrlInputProps {
  onTitleExtracted: (title: string) => void;
  onDescriptionExtracted: (description: string) => void;
  onImageExtracted?: (image: string) => void;
  onContentExtracted?: (content: string) => void;
  onTabChange?: (value: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ 
  onTitleExtracted, 
  onDescriptionExtracted,
  onImageExtracted,
  onContentExtracted,
  onTabChange,
  onLoadingChange 
}) => {
  const [url, setUrl] = useState('');
  const [isImageUrl, setIsImageUrl] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasApiKey, setHasApiKey] = useState(!!MetaService.getApiKey());
  const { toast } = useToast();

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  };

  const isValidImageUrl = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setIsImageUrl(isValidImageUrl(newUrl));
  };

  if (!hasApiKey) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Per estrarre contenuti da URL, inserisci la tua API key di Firecrawl
        </p>
        <ApiKeyInput onKeySet={() => setHasApiKey(true)} />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onLoadingChange?.(true);
    const stopProgress = simulateProgress();

    try {
      if (isImageUrl) {
        const img = new Image();
        img.onload = () => {
          if (onImageExtracted) {
            onImageExtracted(url);
            setProgress(100);
            toast({
              title: "Immagine caricata",
              description: "L'immagine è stata aggiunta correttamente",
            });
          }
        };
        img.onerror = () => {
          toast({
            title: "Errore",
            description: "L'URL dell'immagine non è valido o l'immagine non è accessibile",
            variant: "destructive",
          });
        };
        img.src = url;
      } else {
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
              description: "L'immagine è stata estratta dall'articolo",
            });
            extracted = true;
          }
          if (result.content && onContentExtracted) {
            onContentExtracted(result.content);
          }
          if (result.credits) {
            const creditsEvent = new CustomEvent('creditsExtracted', {
              detail: { credits: result.credits }
            });
            document.dispatchEvent(creditsEvent);
          }

          setProgress(100);

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
      }
    } catch (error) {
      console.error('Error in URL submission:', error);
      toast({
        title: "Errore",
        description: "Errore durante il recupero dell'URL",
        variant: "destructive",
      });
    } finally {
      onLoadingChange?.(false);
      stopProgress();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        {isImageUrl ? "URL dell'immagine" : "URL dell'articolo"}
      </Label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder={isImageUrl ? "https://example.com/image.jpg" : "https://example.com/article"}
            className="flex-1"
            required
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" disabled={progress > 0 && progress < 100}>
                  {progress > 0 && progress < 100 ? (
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
        </div>
        {progress > 0 && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-500 text-right">{progress}%</p>
          </div>
        )}
      </div>
    </form>
  );
};

export default UrlInput;
