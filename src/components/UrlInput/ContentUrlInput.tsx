
import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { MetaService } from '@/utils/MetaService';
import { toast } from '../ui/use-toast';

interface ContentUrlInputProps {
  url: string;
  onChange: (url: string) => void;
  onExtracted: (data: { title?: string; description?: string; image?: string; content?: string }) => void;
  onTabChange?: (value: string) => void;
  disabled?: boolean;
}

const ContentUrlInput: React.FC<ContentUrlInputProps> = ({
  url,
  onChange,
  onExtracted,
  onTabChange,
  disabled
}) => {
  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await MetaService.extractMetadata(url);
      
      if (result.success) {
        const { title, description, image, content } = result;
        onExtracted({ title, description, image, content });
        
        if (title || description || image || content) {
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

        if (result.credits) {
          const creditsEvent = new CustomEvent('creditsExtracted', {
            detail: { credits: result.credits }
          });
          document.dispatchEvent(creditsEvent);
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
    }
  };

  return (
    <form onSubmit={handleContentSubmit} className="flex gap-2">
      <Input
        type="url"
        value={url}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com/article"
        className="flex-1"
        required
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled}>
        {disabled && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Estrai contenuti
      </Button>
    </form>
  );
};

export default ContentUrlInput;
