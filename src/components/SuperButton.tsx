
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Rocket } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SuperButtonProps {
  text: string;
  description: string;
  onTextChange: (text: string) => void;
  onDescriptionChange: (description: string) => void;
  onMagicOptimization: () => void;
  disabled?: boolean;
}

const SuperButton: React.FC<SuperButtonProps> = ({
  text,
  description,
  onTextChange,
  onDescriptionChange,
  onMagicOptimization,
  disabled
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const improveText = async (content: string, isTitle: boolean) => {
    const requestBody = {
      title: isTitle ? content : '',
      description: isTitle ? '' : content,
      length: 'similar',
      tone: 'professional'
    };

    const { data, error } = await supabase.functions.invoke('improve-text', {
      body: requestBody
    });

    if (error) throw error;

    return isTitle ? data?.title?.improvedText : data?.description?.improvedText;
  };

  const detectLanguage = async (text: string) => {
    const { data, error } = await supabase.functions.invoke('translate-text', {
      body: {
        texts: { title: text, description: '' },
        mode: 'detect'
      }
    });

    if (error) throw error;
    return data.detectedLanguage;
  };

  const translateTexts = async (title: string, desc: string) => {
    // Controllo della lingua per il titolo
    const titleLang = await detectLanguage(title);
    const descLang = await detectLanguage(desc);

    // Se entrambi i testi sono già in italiano, ritorna i testi originali
    if (titleLang === 'it' && descLang === 'it') {
      toast({
        title: "Informazione",
        description: "I testi sono già in italiano, nessuna traduzione necessaria"
      });
      return { title, description: desc };
    }

    // Altrimenti procedi con la traduzione
    const { data, error } = await supabase.functions.invoke('translate-text', {
      body: {
        texts: { title, description: desc },
        targetLanguage: 'it'
      }
    });

    if (error) throw error;
    return { title: data.title, description: data.description };
  };

  const handleSuperAction = async () => {
    if (!text.trim() && !description.trim()) {
      toast({
        title: "Contenuto mancante",
        description: "Inserisci del testo prima di utilizzare l'ottimizzazione automatica",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Step 1: Ottimizzazione layout
      toast({ title: "Step 1/3", description: "Ottimizzazione layout in corso..." });
      onMagicOptimization();
      
      // Step 2: Miglioramento testi
      toast({ title: "Step 2/3", description: "Miglioramento testi in corso..." });
      const improvedTitle = text ? await improveText(text, true) : text;
      const improvedDesc = description ? await improveText(description, false) : description;
      
      if (improvedTitle) onTextChange(improvedTitle);
      if (improvedDesc) onDescriptionChange(improvedDesc);

      // Step 3: Traduzione
      toast({ title: "Step 3/3", description: "Traduzione in corso..." });
      const { title: translatedTitle, description: translatedDesc } = await translateTexts(
        improvedTitle || text,
        improvedDesc || description
      );
      
      onTextChange(translatedTitle);
      onDescriptionChange(translatedDesc);

      toast({
        title: "Operazione completata",
        description: "Tutte le ottimizzazioni sono state applicate con successo!"
      });
    } catch (error) {
      console.error('Errore durante l\'elaborazione:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'elaborazione",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleSuperAction}
            disabled={disabled || isProcessing}
            size="sm"
            variant="outline"
            className="w-9 p-0"
          >
            <Rocket className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Super ottimizzazione: layout, miglioramento testi e traduzione</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SuperButton;
