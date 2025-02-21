import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { MetaService } from '@/utils/MetaService';
import { ProgressBar } from './ProgressBar';
import { SubmitButton } from './SubmitButton';
import { DuplicateDialog } from './DuplicateDialog';
import { isValidImageUrl, saveToDatabase } from './utils';
import { useOperationQueue } from '@/hooks/useOperationQueue';
import type { UrlInputProps } from './types';

const UrlInput: React.FC<UrlInputProps> = ({ 
  onTitleExtracted, 
  onDescriptionExtracted,
  onImageExtracted,
  onExtractedContentUpdated,
  onTabChange,
  onLoadingChange 
}) => {
  const [url, setUrl] = useState('');
  const [isImageUrl, setIsImageUrl] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [tempContent, setTempContent] = useState<any>(null);
  const { toast } = useToast();
  const { addToQueue, isProcessing } = useOperationQueue();

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setIsImageUrl(isValidImageUrl(newUrl));
  };

  const updateEditor = (result: any) => {
    if (result.title) onTitleExtracted(result.title);
    if (result.description) onDescriptionExtracted(result.description);
    if (result.extractedContent && onExtractedContentUpdated) {
      onExtractedContentUpdated(result.extractedContent);
    }
    if (result.image && onImageExtracted) {
      console.log('🖼️ [UrlInput] Estratta immagine:', result.image);
      onImageExtracted(result.image);
    }
    
    if (result.credits) {
      const creditsEvent = new CustomEvent('creditsExtracted', {
        detail: { credits: result.credits }
      });
      document.dispatchEvent(creditsEvent);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onLoadingChange?.(true);
    setProgress(0);

    const processUrl = async () => {
      try {
        if (isImageUrl) {
          if (onImageExtracted) {
            onImageExtracted(url);
            setProgress(100);
            toast({
              title: "Immagine caricata",
              description: "L'immagine è stata aggiunta correttamente",
            });
          }
        } else {
          const result = await MetaService.extractMetadata(url);
          
          if (result.success) {
            const saveOperation = async () => {
              const { saved, duplicate, existingContent } = await saveToDatabase({
                url: url,
                title: result.title,
                description: result.description,
                extractedContent: result.extractedContent,
                credits: result.credits,
                image_url: result.image,
                extraction_date: result.extractionDate
              });

              if (saved) {
                updateEditor(result);
                setProgress(100);
                toast({
                  title: "Contenuto estratto",
                  description: "Il contenuto è stato estratto e salvato con successo",
                });
                setUrl('');
              } else if (duplicate && existingContent) {
                setTempContent(existingContent);
                setShowDuplicateDialog(true);
              }
            };

            addToQueue({ 
              task: saveOperation,
              priority: 'high',
              description: `Salvataggio contenuto da ${url}`
            });
          } else {
            throw new Error(result.error || "Impossibile estrarre i contenuti dall'URL");
          }
        }
      } catch (error) {
        console.error('Error in URL submission:', error);
        toast({
          title: "Errore",
          description: "Errore durante il recupero dell'URL",
          variant: "destructive",
        });
        throw error;
      }
    };

    addToQueue({ 
      task: processUrl,
      priority: 'high',
      description: `Elaborazione URL: ${url}`
    });
  };

  const handleUseDuplicate = () => {
    if (tempContent) {
      const result = {
        title: tempContent.title,
        description: tempContent.description,
        extractedContent: tempContent.extractedContent,
        image: tempContent.image_url,
        credits: tempContent.credits
      };
      updateEditor(result);
      setProgress(100);
      toast({
        title: "Contenuto utilizzato",
        description: "Il contenuto è stato importato nell'editor",
      });
      setUrl('');
    }
    setShowDuplicateDialog(false);
    setTempContent(null);
    onLoadingChange?.(false);
    setProgress(100);
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
            disabled={isProcessing}
          />
          <SubmitButton 
            isImageUrl={isImageUrl} 
            isLoading={isProcessing || (progress > 0 && progress < 100)} 
          />
        </div>
        {progress > 0 && <ProgressBar progress={progress} />}
      </div>

      <DuplicateDialog
        open={showDuplicateDialog}
        onOpenChange={setShowDuplicateDialog}
        onUseDuplicate={handleUseDuplicate}
      />
    </form>
  );
};

export default UrlInput;
