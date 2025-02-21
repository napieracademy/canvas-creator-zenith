
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { useToast } from './ui/use-toast';
import { MetaService } from '@/utils/MetaService';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isValidImageUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname.toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => path.endsWith(ext));
    } catch {
      return false;
    }
  };

  const handleImageUrl = async (imageUrl: string) => {
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "Errore",
        description: "Inserisci un URL valido",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    onLoadingChange?.(true);

    try {
      if (isValidImageUrl(url)) {
        const isValidImage = await handleImageUrl(url);
        if (isValidImage && onImageExtracted) {
          onImageExtracted(url);
          toast({
            title: "Successo",
            description: "Immagine caricata correttamente",
          });
        } else {
          throw new Error("Immagine non valida o inaccessibile");
        }
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
            const isValidImage = await handleImageUrl(result.image);
            if (isValidImage) {
              onImageExtracted(result.image);
              extracted = true;
            }
          }
          if (result.content && onContentExtracted) {
            onContentExtracted(result.content);
          }

          if (extracted) {
            toast({
              title: "Successo",
              description: "Contenuti estratti correttamente",
            });
            onTabChange?.('manual');
          } else {
            toast({
              title: "Attenzione",
              description: "Nessun contenuto trovato nell'URL specificato",
              variant: "destructive",
            });
          }
        } else {
          throw new Error(result.error || "Errore durante l'estrazione dei contenuti");
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Errore durante l'elaborazione dell'URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        URL del contenuto
      </Label>
      <div className="flex gap-2">
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1"
          disabled={isLoading}
          required
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
                <span className="ml-2">
                  {isLoading ? "Caricamento..." : "Estrai"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Estrai automaticamente contenuti dall'URL</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </form>
  );
};

export default UrlInput;
