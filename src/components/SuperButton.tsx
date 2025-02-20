
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

  const removeQuotes = (text: string) => {
    return text.replace(/["""'']/g, '').trim();
  };

  const improveText = async (content: string, isTitle: boolean) => {
    const requestBody = {
      title: isTitle ? content : '',
      description: isTitle ? '' : content,
      length: isTitle ? 'similar' : 'shorter', // Similar per il titolo, shorter per la descrizione
      tone: 'professional'
    };

    const { data, error } = await supabase.functions.invoke('improve-text', {
      body: requestBody
    });

    if (error) throw error;

    const improvedText = isTitle ? data?.title?.improvedText : data?.description?.improvedText;
    return improvedText ? removeQuotes(improvedText) : improvedText;
  };

  const translateTexts = async (title: string, desc: string) => {
    if (!title.trim() && !desc.trim()) {
      return { title, description: desc };
    }

    const { data: detectionData, error: detectionError } = await supabase.functions.invoke('translate-text', {
      body: {
        texts: { title, description: desc },
        mode: 'detect'
      }
    });

    if (detectionError) throw detectionError;

    if (detectionData.detectedLanguage === 'it') {
      toast({
        title: "Informazione",
        description: "I testi sono già in italiano, nessuna traduzione necessaria"
      });
      return { title, description: desc };
    }

    const { data, error } = await supabase.functions.invoke('translate-text', {
      body: {
        texts: { title, description: desc },
        targetLanguage: 'it',
        length: 'shorter' // Manteniamo shorter per la traduzione della descrizione
      }
    });

    if (error) throw error;

    return { 
      title: removeQuotes(data.title),
      description: removeQuotes(data.description)
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
      toast({ title: "Step 1/4", description: "Ottimizzazione layout in corso..." });
      onMagicOptimization();
      
      toast({ title: "Step 2/4", description: "Miglioramento testi in corso..." });
      const improvedTitle = text ? await improveText(text, true) : text;
      const improvedDesc = description ? await improveText(description, false) : description;
      
      if (improvedTitle) onTextChange(improvedTitle);
      if (improvedDesc) onDescriptionChange(improvedDesc);

      toast({ title: "Step 3/4", description: "Traduzione in corso..." });
      const { title: translatedTitle, description: translatedDesc } = await translateTexts(
        improvedTitle || text,
        improvedDesc || description
      );
      
      onTextChange(translatedTitle);
      onDescriptionChange(translatedDesc);

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
