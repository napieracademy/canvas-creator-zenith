
import React, { useState } from 'react';
import UrlFetchControl from '../TextControls/UrlFetchControl';
import SuperButton from '../SuperButton';
import DownloadButton from '../DownloadButton';
import { toast } from "../ui/use-toast";
import { calculateOptimalSizes } from '@/utils/fontSizeCalculator';
import CanvasPreview from '../CanvasPreview';

interface FastAndCuriousProps {
  format: 'post' | 'story';
  onFormatChange: (format: 'post' | 'story') => void;
}

const FastAndCurious: React.FC<FastAndCuriousProps> = ({
  format,
  onFormatChange
}) => {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(111);
  const [descriptionFontSize, setDescriptionFontSize] = useState(56);
  const [spacing, setSpacing] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFont, setCurrentFont] = useState('');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [descriptionAlign, setDescriptionAlign] = useState<'left' | 'center' | 'right'>('left');
  const [credits, setCredits] = useState('');

  React.useEffect(() => {
    // Ascolta l'evento creditsExtracted
    const handleCreditsExtracted = (event: CustomEvent<{ credits: string }>) => {
      setCredits(event.detail.credits);
    };

    document.addEventListener('creditsExtracted', handleCreditsExtracted as EventListener);

    return () => {
      document.removeEventListener('creditsExtracted', handleCreditsExtracted as EventListener);
    };
  }, []);

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

    // Centra automaticamente i testi
    setTextAlign('center');
    setDescriptionAlign('center');

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

  const handleColorSelect = (background: string, text: string) => {
    setBackgroundColor(background);
    setTextColor(text);
  };

  return (
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
          showSafeZone={false}
          format={format}
          onSpacingChange={setSpacing}
          font={currentFont}
          credits={credits}
        />
        <div className="absolute top-3 right-3 flex items-center gap-2 p-2 rounded-lg bg-white/20 backdrop-blur-sm">
          <UrlFetchControl
            onTitleExtracted={setText}
            onDescriptionExtracted={setDescription}
            onTabChange={() => {}}
            onLoadingChange={setIsLoading}
            disabled={isLoading}
          />
          <SuperButton 
            text={text}
            description={description}
            onTextChange={setText}
            onDescriptionChange={setDescription}
            onMagicOptimization={handleMagicOptimization}
            disabled={isLoading}
            onColorSelect={handleColorSelect}
          />
          <DownloadButton onDownload={handleDownload} />
        </div>
      </div>
    </div>
  );
};

export default FastAndCurious;
