
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { MetaService } from '@/utils/MetaService';

interface UrlInputProps {
  onTitleExtracted: (title: string) => void;
  onDescriptionExtracted: (description: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ onTitleExtracted, onDescriptionExtracted }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await MetaService.extractMetadata(url);
      
      if (result.success) {
        if (result.title) {
          onTitleExtracted(result.title);
        }
        if (result.description) {
          onDescriptionExtracted(result.description);
        }
        toast({
          title: "Contenuto estratto",
          description: "Il titolo e la descrizione sono stati estratti con successo",
        });
      } else {
        toast({
          title: "Errore",
          description: result.error || "Impossibile estrarre i contenuti dall'URL",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante il recupero dell'URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Caricamento..." : "Estrai contenuti"}
        </Button>
      </div>
    </form>
  );
};

export default UrlInput;
