import React, { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import ColorPresets from '@/components/ColorPresets';
import DownloadButton from '@/components/DownloadButton';
import FormatSelector from '@/components/FormatSelector';
import SafeZoneToggle from '@/components/SafeZoneToggle';
import TextEditor from '@/components/TextEditor';
import CanvasPreview from '@/components/CanvasPreview';
import { colorPairs } from '@/data/colorPairs';

const Index = () => {
  const getRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * colorPairs.length);
    return colorPairs[randomIndex];
  };

  const randomTheme = getRandomTheme();

  const [text, setText] = useState('Social Image Creator');
  const [description, setDescription] = useState('Crea bellissime immagini per i social media in pochi secondi. Personalizza colori, font e layout per ottenere il massimo impatto visivo.');
  const [backgroundColor, setBackgroundColor] = useState(randomTheme.background);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [descriptionAlign, setDescriptionAlign] = useState<'left' | 'center' | 'right'>('left');
  const [fontSize, setFontSize] = useState(111);
  const [descriptionFontSize, setDescriptionFontSize] = useState(56);
  const [spacing, setSpacing] = useState(100);
  const [effectiveFontSize, setEffectiveFontSize] = useState(111);
  const [textColor, setTextColor] = useState(randomTheme.text);
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [format, setFormat] = useState<'post' | 'story'>('post');
  const [activeTab, setActiveTab] = useState('manual');
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    toast({
      title: "Tema selezionato",
      description: `Tema: ${randomTheme.name}`,
    });
  }, []);

  const handleColorSelect = (background: string, text: string) => {
    setBackgroundColor(background);
    setTextColor(text);
  };

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verifica il tipo di file
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Errore",
        description: "Per favore, carica solo file immagine",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      if (imageUrl) {
        // Applica l'overlay grigio sull'immagine
        const overlay = 'rgba(0, 0, 0, 0.5)';
        setBackgroundColor(`linear-gradient(${overlay}, ${overlay}), url(${imageUrl})`);
        setTextColor('#FFFFFF'); // Imposta il testo in bianco per maggiore leggibilità
        setActiveTab('manual'); // Torna alla tab manual dopo il caricamento
        toast({
          title: "Immagine caricata",
          description: "L'immagine è stata impostata come sfondo. Ora puoi personalizzare il testo!",
        });
      }
    };
    reader.readAsDataURL(file);
  }, []);

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
    <div className="min-h-screen w-full relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-gray-700">Estrazione contenuti in corso...</p>
          </div>
        </div>
      )}
      
      <div className="controls-panel">
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold text-gray-900">Social Image Creator</h1>
          <p className="text-sm text-gray-500">Create beautiful social media images in seconds</p>
        </div>

        <FormatSelector 
          format={format}
          onFormatChange={setFormat}
          disabled={isLoading}
        />

        <TextEditor 
          text={text}
          description={description}
          textAlign={textAlign}
          descriptionAlign={descriptionAlign}
          fontSize={fontSize}
          descriptionFontSize={descriptionFontSize}
          spacing={spacing}
          onTextChange={setText}
          onDescriptionChange={setDescription}
          onTextAlignChange={setTextAlign}
          onDescriptionAlignChange={setDescriptionAlign}
          onFontSizeChange={setFontSize}
          onDescriptionFontSizeChange={setDescriptionFontSize}
          onSpacingChange={setSpacing}
          onTitleExtracted={handleTitleExtracted}
          onDescriptionExtracted={handleDescriptionExtracted}
          onImageUpload={handleImageUpload}
          onTabChange={setActiveTab}
          onLoadingChange={setIsLoading}
          disabled={isLoading}
        />

        <ColorPresets 
          onSelectColors={handleColorSelect}
          currentBackground={backgroundColor}
          currentText={textColor}
        />
        
        <SafeZoneToggle 
          showSafeZone={showSafeZone}
          onShowSafeZoneChange={setShowSafeZone}
          disabled={isLoading}
        />
        
        <DownloadButton onDownload={handleDownload} />
      </div>
      
      <CanvasPreview 
        text={text}
        description={description}
        backgroundColor={backgroundColor}
        textAlign={textAlign}
        descriptionAlign={descriptionAlign}
        textColor={textColor}
        fontSize={fontSize}
        descriptionFontSize={descriptionFontSize}
        spacing={spacing}
        onEffectiveFontSizeChange={setEffectiveFontSize}
        showSafeZone={showSafeZone}
        format={format}
      />
    </div>
  );
};

export default Index;
