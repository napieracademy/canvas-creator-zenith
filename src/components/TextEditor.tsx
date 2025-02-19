
import React from 'react';
import TextInput from '@/components/TextInput';
import SpacingControl from '@/components/SpacingControl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UrlInput from '@/components/UrlInput';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

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
  onImageUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  onImageUpload,
  onTabChange,
  onLoadingChange,
  disabled
}) => {
  return (
    <Tabs defaultValue="manual" onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="manual" disabled={disabled}>Scrivi Testo</TabsTrigger>
        <TabsTrigger value="fetch" disabled={disabled}>Fetch da URL</TabsTrigger>
        <TabsTrigger value="featured" disabled={disabled}>Carica Immagine</TabsTrigger>
      </TabsList>
      
      <TabsContent value="manual" className="space-y-4">
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
      </TabsContent>

      <TabsContent value="fetch">
        <UrlInput 
          onTitleExtracted={onTitleExtracted}
          onDescriptionExtracted={onDescriptionExtracted}
          onTabChange={onTabChange}
          onLoadingChange={onLoadingChange}
        />
      </TabsContent>

      <TabsContent value="featured" className="space-y-4">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Carica un'immagine di sfondo per creare un impatto visivo più forte. 
            L'immagine verrà automaticamente adattata e sovrapposta con un overlay scuro per garantire la leggibilità del testo.
          </p>
          <Button variant="outline" className="w-full" onClick={() => document.getElementById('imageUpload')?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Carica un'immagine di sfondo
          </Button>
          <input
            type="file"
            id="imageUpload"
            className="hidden"
            accept="image/*"
            onChange={onImageUpload}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default TextEditor;
