
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import ColorPresets from '@/components/ColorPresets';
import DownloadButton from '@/components/DownloadButton';
import FormatSelector from '@/components/FormatSelector';
import SafeZoneToggle from '@/components/SafeZoneToggle';
import TextEditor from '@/components/TextEditor';
import CanvasPreview from '@/components/CanvasPreview';
import MagicButton from '@/components/MagicButton';
import TemplateSelector from '@/components/TemplateSelector';
import { colorPairs } from '@/data/colorPairs';
import { calculateOptimalSizes } from '@/utils/fontSizeCalculator';
import { getTemplate } from '@/data/templates';

const Index = () => {
  const [template, setTemplate] = useState<'klaus' | 'lucky'>('klaus');
  const getRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * colorPairs.length);
    return colorPairs[randomIndex];
  };

  const randomTheme = getRandomTheme();
  const currentTemplate = getTemplate(template);

  const [text, setText] = useState('Social Image Creator');
  const [description, setDescription] = useState('Crea bellissime immagini per i social media in pochi secondi. Personalizza colori, font e layout per ottenere il massimo impatto visivo.');
  const [backgroundColor, setBackgroundColor] = useState(currentTemplate.backgroundColor);
  const [textAlign, setTextAlign] = useState(currentTemplate.textAlign);
  const [descriptionAlign, setDescriptionAlign] = useState(currentTemplate.descriptionAlign);
  const [fontSize, setFontSize] = useState(currentTemplate.fontSize);
  const [descriptionFontSize, setDescriptionFontSize] = useState(currentTemplate.descriptionFontSize);
  const [spacing, setSpacing] = useState(currentTemplate.spacing);
  const [effectiveFontSize, setEffectiveFontSize] = useState(currentTemplate.fontSize);
  const [textColor, setTextColor] = useState(currentTemplate.textColor);
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [format, setFormat] = useState<'post' | 'story'>('post');
  const [activeTab, setActiveTab] = useState('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleTemplateChange = (newTemplate: 'klaus' | 'lucky') => {
    const template = getTemplate(newTemplate);
    setTemplate(newTemplate);
    setBackgroundColor(template.backgroundColor);
    setTextAlign(template.textAlign);
    setDescriptionAlign(template.descriptionAlign);
    setFontSize(template.fontSize);
    setDescriptionFontSize(template.descriptionFontSize);
    setSpacing(template.spacing);
    setTextColor(template.textColor);

    toast({
      title: "Template cambiato",
      description: `Template: ${template.name}`,
    });
  };

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

  const handleImageExtracted = (imageUrl: string) => {
    setImageUrl(imageUrl);
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    try {
      // Se c'è un'immagine caricata, mostriamo un messaggio di avviso
      if (imageUrl) {
        toast({
          title: "Immagine con contenuto esterno",
          description: "L'immagine contiene contenuti da altri domini. Per motivi di sicurezza, puoi utilizzare uno screenshot per salvare l'immagine.",
          variant: "destructive"
        });
        return;
      }

      // Altrimenti procediamo normalmente
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `social-image-${format}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Immagine scaricata",
        description: `L'immagine è stata salvata nel formato ${format === 'post' ? 'post (1080x1350)' : 'story (1080x1920)'}`,
      });
    } catch (error) {
      console.error('Errore durante il download:', error);
      toast({
        title: "Errore nel download",
        description: "Non è possibile scaricare l'immagine a causa di restrizioni di sicurezza. Puoi utilizzare uno screenshot per salvare l'immagine.",
        variant: "destructive"
      });
    }
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
    <div className="min-h-screen w-full grid grid-cols-[400px_1fr] bg-gray-50/50">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-gray-700">Estrazione contenuti in corso...</p>
          </div>
        </div>
      )}
      
      <div className="h-screen p-6 border-r bg-white overflow-y-auto">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-xl font-semibold text-gray-900">Social Image Creator</h1>
            <p className="text-sm text-gray-500">Create beautiful social media images in seconds</p>
          </div>

          <FormatSelector 
            format={format}
            onFormatChange={setFormat}
            disabled={isLoading}
          />

          <TemplateSelector
            currentTemplate={template}
            onTemplateChange={handleTemplateChange}
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
            onImageExtracted={handleImageExtracted}
            onTabChange={setActiveTab}
            onLoadingChange={setIsLoading}
            disabled={isLoading}
          />

          <ColorPresets 
            onSelectColors={handleColorSelect}
            currentBackground={backgroundColor}
            currentText={textColor}
          />
        </div>
      </div>
      
      <div className="h-screen p-6">
        <div className="relative">
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
            onSpacingChange={setSpacing}
            imageUrl={imageUrl}
            template={template}
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <MagicButton onMagicOptimization={handleMagicOptimization} disabled={isLoading} />
            <SafeZoneToggle 
              showSafeZone={showSafeZone}
              onShowSafeZoneChange={setShowSafeZone}
              disabled={isLoading}
            />
            <DownloadButton onDownload={handleDownload} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
