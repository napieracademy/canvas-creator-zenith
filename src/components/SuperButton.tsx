
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Rocket } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { colorPairs } from '@/data/colorPairs';

interface SuperButtonProps {
  text: string;
  description: string;
  onTextChange: (text: string) => void;
  onDescriptionChange: (description: string) => void;
  onMagicOptimization: () => void;
  disabled?: boolean;
  onColorSelect?: (background: string, text: string) => void;
}

const SuperButton: React.FC<SuperButtonProps> = ({
  text,
  description,
  onTextChange,
  onDescriptionChange,
  onMagicOptimization,
  disabled,
  onColorSelect
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
    if (!text.trim()) return 'it'; // Se il testo è vuoto, assumiamo sia italiano

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
    // Se entrambi i testi sono vuoti, non c'è niente da tradurre
    if (!title.trim() && !desc.trim()) {
      return { title, description: desc };
    }

    // Controllo della lingua solo per i testi non vuoti
    const titleLang = title.trim() ? await detectLanguage(title) : 'it';
    const descLang = desc.trim() ? await detectLanguage(desc) : 'it';

    console.log('Lingua rilevata - Titolo:', titleLang, 'Descrizione:', descLang);

    // Se entrambi i testi sono in italiano o vuoti, non tradurre
    if ((titleLang === 'it' || !title.trim()) && (descLang === 'it' || !desc.trim())) {
      toast({
        title: "Informazione",
        description: "I testi sono già in italiano, nessuna traduzione necessaria"
      });
      return { title, description: desc };
    }

    // Altrimenti procedi con la traduzione solo dei testi necessari
    const { data, error } = await supabase.functions.invoke('translate-text', {
      body: {
        texts: { 
          title: titleLang !== 'it' ? title : '',
          description: descLang !== 'it' ? desc : ''
        },
        targetLanguage: 'it'
      }
    });

    if (error) throw error;

    // Ritorna il testo tradotto solo per le parti che necessitavano traduzione
    return { 
      title: titleLang !== 'it' ? data.title : title,
      description: descLang !== 'it' ? data.description : desc
    };
  };

  const suggestTheme = async (title: string, description: string) => {
    const { data, error } = await supabase.functions.invoke('suggest-theme', {
      body: { title, description }
    });

    if (error) throw error;

    const suggestedCategory = data.theme;
    const themesInCategory = colorPairs.filter(pair => pair.category === suggestedCategory);
    
    if (themesInCategory.length > 0) {
      const randomTheme = themesInCategory[Math.floor(Math.random() * themesInCategory.length)];
      return randomTheme;
    }

    return null;
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
      toast({ title: "Step 1/4", description: "Ottimizzazione layout in corso..." });
      onMagicOptimization();
      
      // Step 2: Miglioramento testi
      toast({ title: "Step 2/4", description: "Miglioramento testi in corso..." });
      const improvedTitle = text ? await improveText(text, true) : text;
      const improvedDesc = description ? await improveText(description, false) : description;
      
      if (improvedTitle) onTextChange(improvedTitle);
      if (improvedDesc) onDescriptionChange(improvedDesc);

      // Step 3: Traduzione
      toast({ title: "Step 3/4", description: "Traduzione in corso..." });
      const { title: translatedTitle, description: translatedDesc } = await translateTexts(
        improvedTitle || text,
        improvedDesc || description
      );
      
      onTextChange(translatedTitle);
      onDescriptionChange(translatedDesc);

      // Step 4: Suggerimento tema
      if (onColorSelect) {
        toast({ title: "Step 4/4", description: "Selezione tema in corso..." });
        const suggestedTheme = await suggestTheme(translatedTitle, translatedDesc);
        if (suggestedTheme) {
          onColorSelect(suggestedTheme.background, suggestedTheme.text);
          toast({
            title: "Tema selezionato",
            description: `È stato applicato il tema "${suggestedTheme.name}" per il tuo contenuto`
          });
        }
      }

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
          <p>Super ottimizzazione: layout, miglioramento testi, traduzione e tema</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SuperButton;
