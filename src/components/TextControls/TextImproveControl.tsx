
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

type ToneType = 'professionale' | 'casual' | 'energico' | 'empatico' | 'autorevole';

interface TextImproveControlProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}

const TextImproveControl: React.FC<TextImproveControlProps> = ({ 
  value, 
  onChange, 
  label, 
  disabled 
}) => {
  const [isImproving, setIsImproving] = React.useState(false);
  const [selectedTone, setSelectedTone] = React.useState<ToneType>('professionale');
  const [isOpen, setIsOpen] = React.useState(false);

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
      console.log('Chiamata a improve-text con:', {
        text: value,
        type: label.toLowerCase() === 'titolo' ? 'title' : 'description',
        tone: selectedTone
      });

      const { data, error } = await supabase.functions.invoke('improve-text', {
        body: {
          text: value,
          type: label.toLowerCase() === 'titolo' ? 'title' : 'description',
          tone: selectedTone
        }
      });

      console.log('Risposta della funzione:', { data, error });

      if (error) throw error;
      if (!data?.improvedText) throw new Error('Nessun testo migliorato ricevuto');

      onChange(data.improvedText);
      toast({
        title: "Testo migliorato",
        description: `Il testo è stato ottimizzato con tono ${selectedTone}`
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
            <PopoverContent className="w-56">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Tono del testo</Label>
                </div>
                <div className="grid gap-1">
                  {(['professionale', 'casual', 'energico', 'empatico', 'autorevole'] as ToneType[]).map((tone) => (
                    <Button
                      key={tone}
                      variant={selectedTone === tone ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedTone(tone);
                        handleImproveText();
                      }}
                      disabled={disabled || isImproving}
                    >
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </TooltipTrigger>
        <TooltipContent>
          <p className="whitespace-nowrap">Migliora il testo: puoi allungarlo, accorciarlo o cambiarlo completamente</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TextImproveControl;
