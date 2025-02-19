
import React, { useState } from 'react';
import TextInput from '@/components/TextInput';
import Canvas from '@/components/Canvas';
import DownloadButton from '@/components/DownloadButton';
import ColorPresets from '@/components/ColorPresets';
import UrlInput from '@/components/UrlInput';
import { useIsMobile } from '@/hooks/use-mobile';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Square, RectangleHorizontal } from 'lucide-react';

const Index = () => {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#8B5CF6');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [fontSize, setFontSize] = useState(64);
  const [descriptionFontSize, setDescriptionFontSize] = useState(32);
  const [effectiveFontSize, setEffectiveFontSize] = useState(64);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [format, setFormat] = useState<'post' | 'story'>('post');
  const isMobile = useIsMobile();

  const handleColorSelect = (background: string, text: string) => {
    setBackgroundColor(background);
    setTextColor(text);
  };

  const handleTitleExtracted = (extractedTitle: string) => {
    setText(extractedTitle);
    toast({
      title: "Titolo estratto",
      description: "Il testo è stato aggiornato con il titolo della pagina",
    });
  };

  const handleDescriptionExtracted = (extractedDescription: string) => {
    setDescription(extractedDescription);
    toast({
      title: "Descrizione estratta",
      description: "Il testo secondario è stato aggiornato con la descrizione della pagina",
    });
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    tempCanvas.width = 1080;
    tempCanvas.height = format === 'post' ? 1350 : 1920;

    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, tempCanvas.width, tempCanvas.height);

    const link = document.createElement('a');
    link.download = `social-image-${format}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();

    toast({
      title: "Immagine scaricata",
      description: `L'immagine è stata salvata nel formato ${format === 'post' ? 'post (1080x1350)' : 'story (1080x1920)'}`,
    });
  };

  if (isMobile) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="glass-panel p-8 rounded-2xl max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Versione Desktop Raccomandata</h1>
          <p className="text-gray-600">
            Questa app è ottimizzata per l'utilizzo su desktop. Per la migliore esperienza, ti preghiamo di accedere da un computer.
          </p>
          <div className="text-sm text-gray-500">
            💻 Torna a visitarci dal tuo computer!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="controls-panel">
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold text-gray-900">Social Image Creator</h1>
          <p className="text-sm text-gray-500">Create beautiful social media images in seconds</p>
        </div>

        <div className="flex gap-2 p-1 rounded-lg bg-muted w-fit">
          <Button
            variant={format === 'post' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFormat('post')}
            className="gap-2"
          >
            <Square className="h-4.5 w-4.5" />
            Post
          </Button>
          <Button
            variant={format === 'story' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFormat('story')}
            className="gap-2"
          >
            <RectangleHorizontal className="h-4.5 w-4.5 rotate-90" />
            Story
          </Button>
        </div>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Scrivi Testo</TabsTrigger>
            <TabsTrigger value="fetch">Fetch da URL</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <div className="space-y-4">
              <TextInput 
                value={text} 
                onChange={setText} 
                textAlign={textAlign}
                onTextAlignChange={setTextAlign}
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                label="Titolo"
              />
              <TextInput 
                value={description} 
                onChange={setDescription} 
                textAlign={textAlign}
                onTextAlignChange={setTextAlign}
                fontSize={descriptionFontSize}
                onFontSizeChange={setDescriptionFontSize}
                label="Descrizione"
              />
            </div>
          </TabsContent>
          <TabsContent value="fetch">
            <UrlInput 
              onTitleExtracted={handleTitleExtracted}
              onDescriptionExtracted={handleDescriptionExtracted}
            />
          </TabsContent>
        </Tabs>

        <ColorPresets 
          onSelectColors={handleColorSelect}
          currentBackground={backgroundColor}
          currentText={textColor}
        />
        
        <div className="flex items-center space-x-2">
          <Switch
            id="safe-zone"
            checked={showSafeZone}
            onCheckedChange={setShowSafeZone}
          />
          <Label htmlFor="safe-zone">Mostra margini di sicurezza</Label>
        </div>
        
        <DownloadButton onDownload={handleDownload} />
      </div>
      
      <div className="preview-container">
        <div className="canvas-wrapper" style={{ aspectRatio: format === 'post' ? '1080/1350' : '1080/1920' }}>
          <Canvas 
            text={text}
            description={description}
            backgroundColor={backgroundColor} 
            textAlign={textAlign}
            fontSize={fontSize}
            descriptionFontSize={descriptionFontSize}
            textColor={textColor}
            onEffectiveFontSizeChange={setEffectiveFontSize}
            showSafeZone={showSafeZone}
            format={format}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
