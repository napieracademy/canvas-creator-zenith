
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { MetaService } from '@/utils/MetaService';
import { Loader2, Image as ImageIcon, Globe } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UrlInputProps {
  onTitleExtracted: (title: string) => void;
  onDescriptionExtracted: (description: string) => void;
  onImageExtracted?: (image: string) => void;
  onTabChange?: (value: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

type LanguageType = 'original' | 'it' | 'en' | 'fr' | 'de' | 'es';

const UrlInput: React.FC<UrlInputProps> = ({ 
  onTitleExtracted, 
  onDescriptionExtracted,
  onImageExtracted,
  onTabChange,
  onLoadingChange 
}) => {
  const [url, setUrl] = useState('');
  const [isImageUrl, setIsImageUrl] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>('it');
  const { toast } = useToast();

  const languages = {
    original: 'Originale',
    it: 'Italiano',
    en: 'English',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onLoadingChange?.(true);

    try {
      if (isImageUrl) {
        // Test if the image URL is valid
        const img = new Image();
        img.onload = () => {
          if (onImageExtracted) {
            onImageExtracted(url);
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
        const result = await MetaService.extractMetadata(url, selectedLanguage);
        
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

          if (extracted) {
            toast({
              title: "Contenuto estratto",
              description: `Il contenuto è stato estratto con successo in ${languages[selectedLanguage]}`,
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
        description: error.message || "Errore durante il recupero dell'URL",
        variant: "destructive",
      });
    } finally {
      onLoadingChange?.(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          {isImageUrl ? "URL dell'immagine" : "URL dell'articolo"}
        </Label>
        <Input
          type="url"
          value={url}
          onChange={handleUrlChange}
          placeholder={isImageUrl ? "https://example.com/image.jpg" : "https://example.com/article"}
          className="flex-1"
          required
        />
      </div>

      {!isImageUrl && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Lingua desiderata</Label>
          <Select value={selectedLanguage} onValueChange={(value: LanguageType) => setSelectedLanguage(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleziona lingua">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{languages[selectedLanguage]}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="original">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">AB</span>
                  <span>Originale</span>
                </div>
              </SelectItem>
              <SelectItem value="it">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">IT</span>
                  <span>Italiano</span>
                </div>
              </SelectItem>
              <SelectItem value="en">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">EN</span>
                  <span>English</span>
                </div>
              </SelectItem>
              <SelectItem value="fr">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">FR</span>
                  <span>Français</span>
                </div>
              </SelectItem>
              <SelectItem value="de">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">DE</span>
                  <span>Deutsch</span>
                </div>
              </SelectItem>
              <SelectItem value="es">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">ES</span>
                  <span>Español</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="submit" className="w-full">
              {isImageUrl ? (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Carica immagine
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  Estrai contenuti
                </>
              )}
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
    </form>
  );
};

export default UrlInput;
