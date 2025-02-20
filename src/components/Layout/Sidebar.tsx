
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TextInput from "@/components/TextInput";
import UrlInput from "@/components/UrlInput";
import TextAlignControl from "@/components/TextControls/TextAlignControl";
import TextTranslateControl from "@/components/TextControls/TextTranslateControl";
import ColorPresets from "@/components/ColorPresets";
import FontSizeControl from "@/components/TextControls/FontSizeControl";
import TextImproveControl from "@/components/TextControls/TextImproveControl";
import DescriptionGenerateControl from "@/components/TextControls/DescriptionGenerateControl";
import FormatSelector from "@/components/FormatSelector";
import { Separator } from "@/components/ui/separator";
import { Image } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import TextEditor from '@/components/TextEditor';
import Header from '@/components/Layout/Header';

interface SidebarProps {
  text: string;
  description: string;
  textAlign: 'left' | 'center' | 'right';
  descriptionAlign: 'left' | 'center' | 'right';
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  descriptionFontSize: number;
  spacing: number;
  format: 'post' | 'story';
  currentFont: string;
  disabled?: boolean;
  extractedContent?: string;
  onFormatChange: (format: 'post' | 'story') => void;
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
  onColorSelect: (background: string, text: string) => void;
  onContentExtracted?: (content: string) => void;
  onLogoChange?: (logo: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  text,
  description,
  textAlign,
  descriptionAlign,
  backgroundColor,
  textColor,
  fontSize,
  descriptionFontSize,
  spacing,
  format,
  currentFont,
  disabled,
  extractedContent,
  onFormatChange,
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
  onColorSelect,
  onContentExtracted,
  onLogoChange,
}) => {
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast({
          title: "File troppo grande",
          description: "Il file non deve superare 1MB",
          variant: "destructive"
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Formato non supportato",
          description: "Carica un'immagine in formato PNG, JPG o SVG",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (onLogoChange) {
          onLogoChange(result);
          toast({
            title: "Logo aggiornato",
            description: "Il logo è stato caricato correttamente"
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={cn(
      "flex h-screen flex-col gap-4 border-r bg-background p-6",
      disabled && "pointer-events-none opacity-50"
    )}>
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-2 px-1">
            <Label className="text-sm">Logo</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="file"
                onChange={handleLogoChange}
                accept="image/*"
                className="flex-1 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-medium hover:file:bg-accent"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => onLogoChange?.('/placeholder.svg')}
                title="Rimuovi logo"
              >
                <Image className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="my-4" />
          
          <div className="space-y-6">
            <Header />
            
            <TextEditor 
              text={text}
              description={description}
              textAlign={textAlign}
              descriptionAlign={descriptionAlign}
              fontSize={fontSize}
              descriptionFontSize={descriptionFontSize}
              spacing={spacing}
              onTextChange={onTextChange}
              onDescriptionChange={onDescriptionChange}
              onTextAlignChange={onTextAlignChange}
              onDescriptionAlignChange={onDescriptionAlignChange}
              onFontSizeChange={onFontSizeChange}
              onDescriptionFontSizeChange={onDescriptionFontSizeChange}
              onSpacingChange={onSpacingChange}
              onTitleExtracted={onTitleExtracted}
              onDescriptionExtracted={onDescriptionExtracted}
              onTabChange={onTabChange}
              onLoadingChange={onLoadingChange}
              disabled={disabled}
              extractedContent={extractedContent}
              onContentExtracted={onContentExtracted}
            />

            <ColorPresets 
              onSelectColors={onColorSelect}
              currentBackground={backgroundColor}
              currentText={textColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
