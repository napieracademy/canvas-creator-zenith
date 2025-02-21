
import React, { useState } from 'react';
import { Label } from '../ui/label';
import { MetaService } from '@/utils/MetaService';
import ApiKeyInput from '../ApiKeyInput';
import ImageUrlInput from './ImageUrlInput';
import ContentUrlInput from './ContentUrlInput';
import ProgressBar from './ProgressBar';

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
  const [progress, setProgress] = useState(0);
  const [hasApiKey, setHasApiKey] = useState(!!MetaService.getApiKey());
  const [isImageUrl, setIsImageUrl] = useState(false);

  const isValidImageUrl = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setIsImageUrl(isValidImageUrl(newUrl));
  };

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

  const handleContentExtracted = (data: { 
    title?: string; 
    description?: string; 
    image?: string; 
    content?: string 
  }) => {
    if (data.title) onTitleExtracted(data.title);
    if (data.description) onDescriptionExtracted(data.description);
    if (data.image && onImageExtracted) onImageExtracted(data.image);
    if (data.content && onContentExtracted) onContentExtracted(data.content);
    setProgress(100);
  };

  const handleImageLoaded = (imageUrl: string) => {
    if (onImageExtracted) {
      onImageExtracted(imageUrl);
      setProgress(100);
    }
  };

  const loading = progress > 0 && progress < 100;

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        {isImageUrl ? "URL dell'immagine" : "URL dell'articolo"}
      </Label>
      <div className="space-y-2">
        {isImageUrl ? (
          <ImageUrlInput
            url={url}
            onChange={handleUrlChange}
            onImageLoaded={handleImageLoaded}
            disabled={loading}
          />
        ) : (
          <ContentUrlInput
            url={url}
            onChange={handleUrlChange}
            onExtracted={handleContentExtracted}
            onTabChange={onTabChange}
            disabled={loading}
          />
        )}
        {progress > 0 && <ProgressBar value={progress} />}
      </div>
    </div>
  );
};

export default UrlInput;
