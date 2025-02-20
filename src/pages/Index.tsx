
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';
import { colorPairs } from '@/data/colorPairs';
import { calculateOptimalSizes } from '@/utils/fontSizeCalculator';
import MobileWarning from '@/components/Layout/MobileWarning';
import LoadingOverlay from '@/components/Layout/LoadingOverlay';
import Sidebar from '@/components/Layout/Sidebar';
import MainContent from '@/components/Layout/MainContent';

const Index = () => {
  const getRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * colorPairs.length);
    return colorPairs[randomIndex];
  };

  const randomTheme = getRandomTheme();
  const isMobile = useIsMobile();

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
  const [currentFont, setCurrentFont] = useState('');

  useEffect(() => {
    toast({
      title: "Tema selezionato",
      description: `Tema: ${randomTheme.name}`,
    });
  }, []);

  const handleColorSelect = (background: string, text: string, overlay?: string, font?: string) => {
    setBackgroundColor(background);
    setTextColor(text);
    
    if (font) {
      console.log("Font selezionato:", font);
      const fontClass = document.documentElement.style;
      
      switch (font) {
        case 'font-c64-system':
          fontClass.setProperty('--font-family', '"Press Start 2P", cursive');
          setCurrentFont('"Press Start 2P"');
          break;
        case 'font-c64-mono':
          fontClass.setProperty('--font-family', '"Share Tech Mono", monospace');
          setCurrentFont('"Share Tech Mono"');
          break;
        case 'font-c64-bold':
          fontClass.setProperty('--font-family', 'VT323, monospace');
          setCurrentFont('VT323');
          break;
        case 'font-c64-wide':
          fontClass.setProperty('--font-family', 'Silkscreen, cursive');
          setCurrentFont('Silkscreen');
          break;
        default:
          fontClass.setProperty('--font-family', 'Inter, sans-serif');
          setCurrentFont('Inter');
      }
    }
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
    
    setFontSize(titleFontSize);
    setDescriptionFontSize(newDescFontSize);
    setSpacing(newSpacing);

    toast({
      title: "Layout ottimizzato",
      description: "Le dimensioni sono state ottimizzate in base al contenuto"
    });
  };

  if (isMobile) {
    return <MobileWarning />;
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-[400px_1fr] bg-gray-50/50">
      <LoadingOverlay isLoading={isLoading} />
      
      <Sidebar
        format={format}
        text={text}
        description={description}
        textAlign={textAlign}
        descriptionAlign={descriptionAlign}
        fontSize={fontSize}
        descriptionFontSize={descriptionFontSize}
        spacing={spacing}
        backgroundColor={backgroundColor}
        textColor={textColor}
        isLoading={isLoading}
        onFormatChange={setFormat}
        onTextChange={setText}
        onDescriptionChange={setDescription}
        onTextAlignChange={setTextAlign}
        onDescriptionAlignChange={setDescriptionAlign}
        onFontSizeChange={setFontSize}
        onDescriptionFontSizeChange={setDescriptionFontSize}
        onSpacingChange={setSpacing}
        onColorSelect={handleColorSelect}
        onTitleExtracted={(title) => {
          setText(title);
          toast({
            title: "Titolo estratto",
            description: "Il testo è stato aggiornato con il titolo della pagina",
          });
        }}
        onDescriptionExtracted={(desc) => {
          setDescription(desc);
          toast({
            title: "Descrizione estratta",
            description: "Il testo secondario è stato aggiornato con la descrizione della pagina",
          });
        }}
        onTabChange={setActiveTab}
        onLoadingChange={setIsLoading}
      />
      
      <MainContent
        text={text}
        description={description}
        backgroundColor={backgroundColor}
        textAlign={textAlign}
        descriptionAlign={descriptionAlign}
        textColor={textColor}
        fontSize={fontSize}
        descriptionFontSize={descriptionFontSize}
        spacing={spacing}
        showSafeZone={showSafeZone}
        format={format}
        currentFont={currentFont}
        isLoading={isLoading}
        onEffectiveFontSizeChange={setEffectiveFontSize}
        onShowSafeZoneChange={setShowSafeZone}
        onSpacingChange={setSpacing}
        onMagicOptimization={handleMagicOptimization}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default Index;
