
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LengthType = 'shorter' | 'similar' | 'longer';
type LanguageType = 'it' | 'en' | 'fr' | 'de' | 'pt' | 'zh';

interface TextImproveControlProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
  otherText?: string; // Aggiungiamo questa prop per l'altro testo
}

const TextImproveControl: React.FC<TextImproveControlProps> = ({ 
  value, 
  onChange, 
  label, 
  disabled,
  otherText 
}) => {
  const [isImproving, setIsImproving] = React.useState(false);
  const [selectedLength, setSelectedLength] = React.useState<LengthType>('similar');
  const [selectedLanguage, setSelectedLanguage] = React.useState<LanguageType>('it');
  const [isOpen, setIsOpen] = React.useState(false);

  const getLengthLabel = (length: LengthType) => {
    switch (length) {
      case 'shorter': return 'Più corto';
      case 'similar': return 'Lunghezza simile';
      case 'longer': return 'Più lungo';
    }
  };

  const getLanguageLabel = (lang: LanguageType) => {
    switch (lang) {
      case 'it': return 'Italiano';
      case 'en': return 'Inglese';
      case 'fr': return 'Francese';
      case 'de': return 'Tedesco';
      case 'pt': return 'Portoghese';
      case 'zh': return 'Cinese';
    }
  };

  const handleImproveText = async () => {
    if (!value.trim()) {
      toast({
        title: "Testo mancante",
        description: "Inserisci del testo prima di utilizzare il miglioramento automatico",
        variant: "destructive"
      });
      return;
    }

    setIsImproving(true);
    try {
      const isTitle = label.toLowerCase() === 'titolo';
      const requestBody = {
        title: isTitle ? value : otherText || '',
        description: isTitle ? otherText || '' : value,
        length: selectedLength,
        targetLanguage: selectedLanguage
      };

      console.log('Chiamata a improve-text con:', requestBody);

      const { data, error } = await supabase.functions.invoke('improve-text', {
        body: requestBody
      });

      console.log('Risposta della funzione:', { data, error });

      if (error) throw error;

      // Estraiamo il testo migliorato appropriato dalla risposta
      const improvedText = isTitle ? data?.title?.improvedText : data?.description?.improvedText;
      const wasTranslated = isTitle ? data?.title?.wasTranslated : data?.description?.wasTranslated;

      if (!improvedText) throw new Error('Nessun testo migliorato ricevuto');

      onChange(improvedText);
      toast({
        title: wasTranslated ? "Testo tradotto e migliorato" : "Testo migliorato",
        description: `${wasTranslated ? 'Tradotto e migliorato' : 'Migliorato'} in ${getLanguageLabel(selectedLanguage).toLowerCase()} con lunghezza ${getLengthLabel(selectedLength).toLowerCase()}`
      });
    } catch (error) {
      console.error('Errore nel miglioramento del testo:', error);
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante il miglioramento del testo",
        variant: "destructive"
      });
    } finally {
      setIsImproving(false);
      setIsOpen(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="w-9 p-0"
                disabled={disabled || isImproving}
                aria-label="Migliora automaticamente il testo"
              >
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Lingua desiderata</Label>
                  <Select 
                    value={selectedLanguage} 
                    onValueChange={(value: LanguageType) => setSelectedLanguage(value)}
                    disabled={disabled || isImproving}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Scegli la lingua" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">Italiano</SelectItem>
                      <SelectItem value="en">Inglese</SelectItem>
                      <SelectItem value="fr">Francese</SelectItem>
                      <SelectItem value="de">Tedesco</SelectItem>
                      <SelectItem value="pt">Portoghese</SelectItem>
                      <SelectItem value="zh">Cinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">Lunghezza desiderata</Label>
                  <Select 
                    value={selectedLength} 
                    onValueChange={(value: LengthType) => setSelectedLength(value)}
                    disabled={disabled || isImproving}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Scegli la lunghezza" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shorter">Più corto</SelectItem>
                      <SelectItem value="similar">Lunghezza simile</SelectItem>
                      <SelectItem value="longer">Più lungo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleImproveText}
                  disabled={disabled || isImproving}
                >
                  {isImproving ? "Miglioramento in corso..." : "Migliora il testo"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </TooltipTrigger>
        <TooltipContent>
          <p className="whitespace-nowrap">Migliora il testo: puoi allungarlo, accorciarlo o tradurlo in un'altra lingua</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TextImproveControl;
