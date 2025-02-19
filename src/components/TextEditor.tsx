
import React from 'react';
import TextInput from '@/components/TextInput';
import SpacingControl from '@/components/SpacingControl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UrlInput from '@/components/UrlInput';
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { calculateOptimalSizes } from '@/utils/fontSizeCalculator';
import { toast } from "@/components/ui/use-toast";

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
  onTabChange,
  onLoadingChange,
  disabled
}) => {
  const handleMagicOptimization = () => {
    if (!text && !description) {
      toast({
        title: "Contenuto mancante",
        description: "Inserisci del testo prima di utilizzare l'ottimizzazione automatica",
        variant: "destructive"
      });
      return;
    }

    const { titleFontSize, descriptionFontSize: newDescFontSize, spacing: newSpacing } = calculateOptimalSizes(text, description);
    
    onFontSizeChange(titleFontSize);
    onDescriptionFontSizeChange(newDescFontSize);
    onSpacingChange(newSpacing);

    toast({
      title: "Layout ottimizzato",
      description: "Le dimensioni sono state ottimizzate in base al contenuto"
    });
  };

  return (
    <Tabs defaultValue="manual" onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="manual" disabled={disabled}>Scrivi Testo</TabsTrigger>
        <TabsTrigger value="fetch" disabled={disabled}>Fetch da URL</TabsTrigger>
      </TabsList>
      <TabsContent value="manual" className="space-y-4">
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleMagicOptimization}
            disabled={disabled}
          >
            <Wand2 className="h-4 w-4" />
            Magic
          </Button>
        </div>

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
    </Tabs>
  );
};

export default TextEditor;
