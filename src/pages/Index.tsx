
import React, { useState } from 'react';
import TextInput from '@/components/TextInput';
import Canvas from '@/components/Canvas';
import DownloadButton from '@/components/DownloadButton';
import TextAlignControl from '@/components/TextAlignControl';
import FontSizeControl from '@/components/FontSizeControl';
import ColorPresets from '@/components/ColorPresets';
import UrlInput from '@/components/UrlInput';
import { useIsMobile } from '@/hooks/use-mobile';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const [text, setText] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#8B5CF6');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [fontSize, setFontSize] = useState(64);
  const [effectiveFontSize, setEffectiveFontSize] = useState(64);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [showSafeZone, setShowSafeZone] = useState(false);
  const isMobile = useIsMobile();

  const handleColorSelect = (background: string, text: string) => {
    setBackgroundColor(background);
    setTextColor(text);
    toast({
      title: "Tema applicato",
      description: "I nuovi colori sono stati applicati con successo",
    });
  };

  const handleTitleExtracted = (extractedTitle: string) => {
    setText(extractedTitle);
    toast({
      title: "Titolo estratto",
      description: "Il testo è stato aggiornato con il titolo della pagina",
    });
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'social-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    toast({
      title: "Immagine scaricata",
      description: "L'immagine è stata salvata correttamente",
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
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="controls-panel">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            <h1 className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">
              Social Image Creator
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Crea immagini accattivanti per i social media in pochi secondi
          </p>
        </div>
        
        <div className="space-y-6 mt-6">
          <div className="p-4 bg-white/50 rounded-xl border border-white/60 shadow-sm">
            <UrlInput onTitleExtracted={handleTitleExtracted} />
          </div>
          
          <div className="p-4 bg-white/50 rounded-xl border border-white/60 shadow-sm">
            <TextInput value={text} onChange={setText} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/50 rounded-xl border border-white/60 shadow-sm">
              <TextAlignControl value={textAlign} onChange={setTextAlign} />
            </div>
            <div className="p-4 bg-white/50 rounded-xl border border-white/60 shadow-sm">
              <FontSizeControl 
                value={fontSize} 
                onChange={setFontSize} 
                effectiveSize={effectiveFontSize}
              />
            </div>
          </div>
          
          <div className="p-4 bg-white/50 rounded-xl border border-white/60 shadow-sm">
            <ColorPresets 
              onSelectColors={handleColorSelect}
              currentBackground={backgroundColor}
              currentText={textColor}
            />
          </div>
          
          <div className="flex items-center space-x-2 p-4 bg-white/50 rounded-xl border border-white/60 shadow-sm">
            <Switch
              id="safe-zone"
              checked={showSafeZone}
              onCheckedChange={setShowSafeZone}
            />
            <Label htmlFor="safe-zone">Mostra margini di sicurezza</Label>
          </div>
          
          <DownloadButton onDownload={handleDownload} />
        </div>
      </div>
      
      <div className="preview-container">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-indigo-500/10 rounded-3xl transform rotate-3 scale-105 blur-2xl" />
          <div className="canvas-wrapper">
            <Canvas 
              text={text} 
              backgroundColor={backgroundColor} 
              textAlign={textAlign}
              fontSize={fontSize}
              textColor={textColor}
              onEffectiveFontSizeChange={setEffectiveFontSize}
              showSafeZone={showSafeZone}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
