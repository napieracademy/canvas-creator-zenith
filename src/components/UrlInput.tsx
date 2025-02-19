
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { MetaService } from '@/utils/MetaService';

interface UrlInputProps {
  onTitleExtracted: (title: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ onTitleExtracted }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await MetaService.extractMetadata(url);
      
      if (result.success && result.title) {
        onTitleExtracted(result.title);
        toast({
          title: "Success",
          description: "Title extracted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Could not extract title from URL",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Article URL</Label>
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
          {isLoading ? "Loading..." : "Extract Title"}
        </Button>
      </div>
    </form>
  );
};

export default UrlInput;
