
import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Image as ImageIcon } from 'lucide-react';
import { toast } from '../ui/use-toast';

interface ImageUrlInputProps {
  url: string;
  onChange: (url: string) => void;
  onImageLoaded: (url: string) => void;
  disabled?: boolean;
}

const ImageUrlInput: React.FC<ImageUrlInputProps> = ({
  url,
  onChange,
  onImageLoaded,
  disabled
}) => {
  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const img = new Image();
    img.onload = () => {
      onImageLoaded(url);
      toast({
        title: "Immagine caricata",
        description: "L'immagine è stata aggiunta correttamente",
      });
    };
    img.onerror = () => {
      toast({
        title: "Errore",
        description: "L'URL dell'immagine non è valido o l'immagine non è accessibile",
        variant: "destructive",
      });
    };
    img.src = url;
  };

  return (
    <form onSubmit={handleImageSubmit} className="flex gap-2">
      <Input
        type="url"
        value={url}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com/image.jpg"
        className="flex-1"
        required
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled}>
        <ImageIcon className="mr-2 h-4 w-4" />
        Carica immagine
      </Button>
    </form>
  );
};

export default ImageUrlInput;
