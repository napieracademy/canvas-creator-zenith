
import { toast } from '@/components/ui/use-toast';
import { calculateOptimalSizes } from '@/utils/fontSizeCalculator';

const DEFAULT_TEXT = 'Social Image Creator';
const DEFAULT_DESCRIPTION = 'Crea bellissime immagini per i social media in pochi secondi. Personalizza colori, font e layout per ottenere il massimo impatto visivo.';

export const useIndexHandlers = (state: any) => {
  const {
    setText,
    setDescription,
    setFontSize,
    setDescriptionFontSize,
    setSpacing,
    setTextAlign,
    setDescriptionAlign,
    setBackgroundColor,
    setTextColor,
    text,
    description
  } = state;

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

  const handleLogoChange = (newLogo: string) => {
    state.setLogo(newLogo);
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

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    tempCanvas.width = 1080;
    tempCanvas.height = state.format === 'post' ? 1350 : 1920;

    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, tempCanvas.width, tempCanvas.height);

    const link = document.createElement('a');
    link.download = `social-image-${state.format}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();

    toast({
      title: "Immagine scaricata",
      description: `L'immagine è stata salvata nel formato ${state.format === 'post' ? 'post (1080x1350)' : 'story (1080x1920)'}`,
    });
  };

  const handleViewModeChange = (mode: 'full' | 'fast') => {
    state.setViewMode(mode);
    toast({
      title: mode === 'full' ? 'Modalità completa' : 'Modalità semplificata',
      description: mode === 'full' 
        ? 'Tutte le funzionalità sono ora disponibili' 
        : 'Visualizzazione semplificata attivata'
    });
  };

  return {
    handleClean,
    handleColorSelect,
    handleMagicOptimization,
    handleLogoChange,
    handleImageExtracted,
    handleDescriptionExtracted,
    handleDownload,
    handleViewModeChange
  };
};
