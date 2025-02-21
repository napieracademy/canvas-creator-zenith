
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { MetaService } from '@/utils/MetaService';
import { isValidImageUrl, handleImageUrl } from '@/utils/urlUtils';

interface UrlExtractorProps {
  onTitleExtracted: (title: string) => void;
  onDescriptionExtracted: (description: string) => void;
  onImageExtracted?: (image: string) => void;
  onContentExtracted?: (content: string) => void;
  onTabChange?: (value: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export const useUrlExtractor = ({
  onTitleExtracted,
  onDescriptionExtracted,
  onImageExtracted,
  onContentExtracted,
  onTabChange,
  onLoadingChange,
}: UrlExtractorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUrlSubmit = async (url: string) => {
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

  return { isLoading, handleUrlSubmit };
};
