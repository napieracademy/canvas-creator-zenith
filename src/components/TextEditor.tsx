
import React from 'react';
import TextInput from '@/components/TextInput';
import SpacingControl from '@/components/SpacingControl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UrlInput from '@/components/UrlInput';
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface TextEditorProps {
  text: string;
  description: string;
  textAlign: 'left' | 'center' | 'right';
  descriptionAlign: 'left' | 'center' | 'right';
  fontSize: number;
  descriptionFontSize: number;
  spacing: number;
  onTextChange: (text: string) => void;
  onDescriptionChange: (description: string) => void;
  onTextAlignChange: (align: 'left' | 'center' | 'right') => void;
  onDescriptionAlignChange: (align: 'left' | 'center' | 'right') => void;
  onFontSizeChange: (size: number) => void;
  onDescriptionFontSizeChange: (size: number) => void;
  onSpacingChange: (spacing: number) => void;
  onTitleExtracted: (title: string) => void;
  onDescriptionExtracted: (description: string) => void;
  onImageExtracted?: (image: string) => void;
  onTabChange: (value: string) => void;
  onLoadingChange: (loading: boolean) => void;
  disabled?: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({
  text,
  description,
  textAlign,
  descriptionAlign,
  fontSize,
  descriptionFontSize,
  spacing,
  onTextChange,
  onDescriptionChange,
  onTextAlignChange,
  onDescriptionAlignChange,
  onFontSizeChange,
  onDescriptionFontSizeChange,
  onSpacingChange,
  onTitleExtracted,
  onDescriptionExtracted,
  onImageExtracted,
  onTabChange,
  onLoadingChange,
  disabled
}) => {
  const renderTextControls = () => (
    <div className="space-y-4">
      <TextInput 
        value={text} 
        onChange={onTextChange} 
        textAlign={textAlign}
        onTextAlignChange={onTextAlignChange}
        fontSize={fontSize}
        onFontSizeChange={onFontSizeChange}
        label="Titolo"
        disabled={disabled}
      />

      <div className="space-y-2">
        <Label htmlFor="featured-image">Immagine Featured</Label>
        <Input
          id="featured-image"
          type="url"
          placeholder="https://example.com/image.jpg"
          onChange={(e) => onImageExtracted?.(e.target.value)}
          disabled={disabled}
        />
      </div>
      
      {description && (
        <SpacingControl
          value={spacing}
          onChange={onSpacingChange}
          disabled={disabled}
        />
      )}

      <TextInput 
        value={description} 
        onChange={onDescriptionChange} 
        textAlign={descriptionAlign}
        onTextAlignChange={onDescriptionAlignChange}
        fontSize={descriptionFontSize}
        onFontSizeChange={onDescriptionFontSizeChange}
        label="Descrizione"
        disabled={disabled}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <Tabs defaultValue="manual" onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger 
                  value="manual" 
                  disabled={disabled}
                  aria-label="Inserisci manualmente il testo"
                >
                  Scrivi Testo
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Inserisci manualmente il testo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger 
                  value="fetch" 
                  disabled={disabled}
                  aria-label="Estrai testo da un URL"
                >
                  Fetch da URL
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Estrai automaticamente i contenuti da un URL</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TabsList>
        <TabsContent value="manual">
          {renderTextControls()}
        </TabsContent>
        <TabsContent value="fetch">
          <div className="space-y-4">
            <UrlInput
              onTitleExtracted={onTitleExtracted}
              onDescriptionExtracted={onDescriptionExtracted}
              onImageExtracted={onImageExtracted}
              onTabChange={onTabChange}
              onLoadingChange={onLoadingChange}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TextEditor;
