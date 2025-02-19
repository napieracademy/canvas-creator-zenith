
import React from 'react';
import TextInput from '@/components/TextInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UrlInput from '@/components/UrlInput';

interface TextEditorProps {
  text: string;
  description: string;
  textAlign: 'left' | 'center' | 'right';
  fontSize: number;
  descriptionFontSize: number;
  onTextChange: (text: string) => void;
  onDescriptionChange: (description: string) => void;
  onTextAlignChange: (align: 'left' | 'center' | 'right') => void;
  onFontSizeChange: (size: number) => void;
  onDescriptionFontSizeChange: (size: number) => void;
  onTitleExtracted: (title: string) => void;
  onDescriptionExtracted: (description: string) => void;
  onTabChange: (value: string) => void;
  onLoadingChange: (loading: boolean) => void;
  disabled?: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({
  text,
  description,
  textAlign,
  fontSize,
  descriptionFontSize,
  onTextChange,
  onDescriptionChange,
  onTextAlignChange,
  onFontSizeChange,
  onDescriptionFontSizeChange,
  onTitleExtracted,
  onDescriptionExtracted,
  onTabChange,
  onLoadingChange,
  disabled
}) => {
  return (
    <Tabs defaultValue="manual" onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="manual" disabled={disabled}>Scrivi Testo</TabsTrigger>
        <TabsTrigger value="fetch" disabled={disabled}>Fetch da URL</TabsTrigger>
      </TabsList>
      <TabsContent value="manual">
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
          <TextInput 
            value={description} 
            onChange={onDescriptionChange} 
            textAlign={textAlign}
            onTextAlignChange={onTextAlignChange}
            fontSize={descriptionFontSize}
            onFontSizeChange={onDescriptionFontSizeChange}
            label="Descrizione"
            disabled={disabled}
          />
        </div>
      </TabsContent>
      <TabsContent value="fetch">
        <UrlInput 
          onTitleExtracted={onTitleExtracted}
          onDescriptionExtracted={onDescriptionExtracted}
          onTabChange={onTabChange}
          onLoadingChange={onLoadingChange}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TextEditor;
