import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';
import { colorPairs } from '@/data/colorPairs';
import { calculateOptimalSizes } from '@/utils/fontSizeCalculator';
import MobileWarning from '@/components/Layout/MobileWarning';
import LoadingOverlay from '@/components/Layout/LoadingOverlay';
import Sidebar from '@/components/Layout/Sidebar';
import MainContent from '@/components/Layout/MainContent';
import NavigationMenu from '@/components/Layout/NavigationMenu';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TextInput from '@/components/TextInput';

const DEFAULT_TEXT = 'Social Image Creator';
const DEFAULT_DESCRIPTION = 'Crea bellissime immagini per i social media in pochi secondi. Personalizza colori, font e layout per ottenere il massimo impatto visivo.';

const IndexPage = () => {
  const location = useLocation();
  const getRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * colorPairs.length);
    return colorPairs[randomIndex];
  };

  const randomTheme = getRandomTheme();
  const isMobile = useIsMobile();

  const loadFromCache = () => {
    if (location.state?.text || location.state?.description) {
      const cached = localStorage.getItem('socialImageCache');
      const cachedData = cached ? JSON.parse(cached) : {};
      
      return {
        text: location.state.text || DEFAULT_TEXT,
        description: location.state.description || DEFAULT_DESCRIPTION,
        backgroundColor: cachedData.backgroundColor || randomTheme.background,
        textColor: cachedData.textColor || randomTheme.text,
        fontSize: cachedData.fontSize || 111,
        descriptionFontSize: cachedData.descriptionFontSize || 56,
        spacing: cachedData.spacing || 100,
        textAlign: cachedData.textAlign || 'left',
        descriptionAlign: cachedData.descriptionAlign || 'left',
        format: cachedData.format || 'post'
      };
    }

    const cached = localStorage.getItem('socialImageCache');
    if (cached) {
      return JSON.parse(cached);
    }

    return {
      text: DEFAULT_TEXT,
      description: DEFAULT_DESCRIPTION,
      backgroundColor: randomTheme.background,
      textColor: randomTheme.text,
      fontSize: 111,
      descriptionFontSize: 56,
      spacing: 100,
      textAlign: 'left',
      descriptionAlign: 'left',
      format: 'post'
    };
  };

  const initialState = loadFromCache();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [text, setText] = useState(initialState.text);
  const [description, setDescription] = useState(initialState.description);
  const [backgroundColor, setBackgroundColor] = useState(initialState.backgroundColor);
  const [textAlign, setTextAlign] = useState(initialState.textAlign);
  const [descriptionAlign, setDescriptionAlign] = useState(initialState.descriptionAlign);
  const [fontSize, setFontSize] = useState(initialState.fontSize);
  const [descriptionFontSize, setDescriptionFontSize] = useState(initialState.descriptionFontSize);
  const [spacing, setSpacing] = useState(initialState.spacing);
  const [effectiveFontSize, setEffectiveFontSize] = useState(initialState.fontSize);
  const [textColor, setTextColor] = useState(initialState.textColor);
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [format, setFormat] = useState(initialState.format);
  const [activeTab, setActiveTab] = useState('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [currentFont, setCurrentFont] = useState('');
  const [credits, setCredits] = useState('');
  const [viewMode, setViewMode] = useState<'full' | 'fast'>('full');
  const [extractedContent, setExtractedContent] = useState('');
  const [logo, setLogo] = useState('/placeholder.svg');
  const [newTextContent, setNewTextContent] = useState('');
  const [newTextAlign, setNewTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [newFontSize, setNewFontSize] = useState(32);

  useEffect(() => {
    const dataToCache = {
      text,
      description,
      backgroundColor,
      textColor,
      fontSize,
      descriptionFontSize,
      spacing,
      textAlign,
      descriptionAlign,
      format
    };
    localStorage.setItem('socialImageCache', JSON.stringify(dataToCache));
  }, [text, description, backgroundColor, textColor, fontSize, descriptionFontSize, spacing, textAlign, descriptionAlign, format]);

  useEffect(() => {
    if (location.state?.text || location.state?.description) {
      toast({
        title: "Contenuto importato",
        description: "Il contenuto è stato importato con successo",
      });
    } else {
      toast({
        title: "Tema selezionato",
        description: `Tema: ${randomTheme.name}`,
      });
    }
  }, []);

  const handleClean = () => {
    setText(DEFAULT_TEXT);
    setDescription(DEFAULT_DESCRIPTION);
    setFontSize(111);
    setDescriptionFontSize(56);
    setSpacing(100);
    setTextAlign('left');
    setDescriptionAlign('left');
    toast({
      title: "Contenuto ripristinato",
      description: "I testi sono stati riportati ai valori predefiniti",
    });
  };

  const handleColorSelect = (background: string, text: string) => {
    setBackgroundColor(background);
    setTextColor(text);
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

  const handleViewModeChange = (mode: 'full' | 'fast') => {
    setViewMode(mode);
    toast({
      title: mode === 'full' ? 'Modalità completa' : 'Modalità semplificata',
      description: mode === 'full' 
        ? 'Tutte le funzionalità sono ora disponibili' 
        : 'Visualizzazione semplificata attivata'
    });
  };

  const handleLogoChange = (newLogo: string) => {
    setLogo(newLogo);
  };

  const handleImageExtracted = (imageUrl: string) => {
    console.log('🖼️ [Index] Immagine estratta:', imageUrl);
    setBackgroundColor(imageUrl);
    toast({
      title: "Immagine estratta",
      description: "L'immagine di anteprima è stata impostata correttamente",
    });
  };

  const handleDescriptionExtracted = (newDescription: string) => {
    console.log('📝 [Index] Nuova descrizione ricevuta:', newDescription);
    setDescription(newDescription);
    toast({
      title: "Descrizione aggiornata",
      description: "La descrizione è stata estratta con successo"
    });
  };

  if (isMobile) {
    return <MobileWarning />;
  }

  return (
    <div className="relative">
      <NavigationMenu />
      <div className="flex items-center gap-2 absolute top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClean}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Ripristina
        </Button>
      </div>
      <div className="flex">
        {viewMode === 'full' && (
          <div className={`relative transition-all duration-300 ${sidebarOpen ? 'w-[400px]' : 'w-0'}`}>
            {sidebarOpen && (
              <>
                <Sidebar
                  text={text}
                  description={description}
                  textAlign={textAlign}
                  descriptionAlign={descriptionAlign}
                  backgroundColor={backgroundColor}
                  textColor={textColor}
                  fontSize={fontSize}
                  descriptionFontSize={descriptionFontSize}
                  spacing={spacing}
                  format={format}
                  currentFont={currentFont}
                  onFormatChange={setFormat}
                  onTextChange={setText}
                  onDescriptionChange={setDescription}
                  onTextAlignChange={setTextAlign}
                  onDescriptionAlignChange={setDescriptionAlign}
                  onFontSizeChange={setFontSize}
                  onDescriptionFontSizeChange={setDescriptionFontSize}
                  onSpacingChange={setSpacing}
                  disabled={isLoading}
                  onTitleExtracted={setText}
                  onDescriptionExtracted={handleDescriptionExtracted}
                  onImageExtracted={handleImageExtracted}
                  onTabChange={setActiveTab}
                  onLoadingChange={setIsLoading}
                  onColorSelect={handleColorSelect}
                  extractedContent={extractedContent}
                  onContentExtracted={setExtractedContent}
                  onLogoChange={handleLogoChange}
                />
                <TextInput
                  value={newTextContent}
                  onChange={setNewTextContent}
                  textAlign={newTextAlign}
                  onTextAlignChange={setNewTextAlign}
                  fontSize={newFontSize}
                  onFontSizeChange={setNewFontSize}
                  label="Nuovo Contenuto"
                />
              </>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white border rounded-r-lg p-1 hover:bg-gray-50"
            >
              {sidebarOpen ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
            </button>
          </div>
        )}
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
          credits={credits}
          viewMode={viewMode}
          logo={logo}
          onEffectiveFontSizeChange={setEffectiveFontSize}
          onShowSafeZoneChange={setShowSafeZone}
          onSpacingChange={setSpacing}
          onMagicOptimization={handleMagicOptimization}
          onDownload={handleDownload}
          onTextChange={setText}
          onDescriptionChange={setDescription}
          onTitleExtracted={setText}
          onDescriptionExtracted={handleDescriptionExtracted}
          onImageExtracted={handleImageExtracted}
          onTabChange={setActiveTab}
          onLoadingChange={setIsLoading}
          onFormatChange={setFormat}
          onViewModeChange={handleViewModeChange}
        />
      </div>
      {isLoading && <LoadingOverlay isLoading={isLoading} />}
    </div>
  );
};

export default IndexPage;
