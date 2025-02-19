
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

type ToneType = 'professionale' | 'casual' | 'energico' | 'empatico' | 'autorevole';
type LengthType = 'shorter' | 'similar' | 'longer';

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
  const [selectedLength, setSelectedLength] = React.useState<LengthType>('similar');
  const [isOpen, setIsOpen] = React.useState(false);

  const getLengthLabel = (length: LengthType) => {
    switch (length) {
      case 'shorter': return 'Più corto';
      case 'similar': return 'Lunghezza simile';
      case 'longer': return 'Più lungo';
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
      console.log('Chiamata a improve-text con:', {
        text: value,
        type: label.toLowerCase() === 'titolo' ? 'title' : 'description',
        tone: selectedTone,
        length: selectedLength
      });

      const { data, error } = await supabase.functions.invoke('improve-text', {
        body: {
          text: value,
          type: label.toLowerCase() === 'titolo' ? 'title' : 'description',
          tone: selectedTone,
          length: selectedLength
        }
      });

      console.log('Risposta della funzione:', { data, error });

      if (error) throw error;
      if (!data?.improvedText) throw new Error('Nessun testo migliorato ricevuto');

      onChange(data.improvedText);
      toast({
        title: "Testo migliorato",
        description: `Il testo è stato ottimizzato con tono ${selectedTone} e lunghezza ${getLengthLabel(selectedLength).toLowerCase()}`
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
                  <Label className="mb-2 block">Tono del testo</Label>
                  <div className="grid gap-1">
                    {(['professionale', 'casual', 'energico', 'empatico', 'autorevole'] as ToneType[]).map((tone) => (
                      <Button
                        key={tone}
                        variant={selectedTone === tone ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedTone(tone)}
                        disabled={disabled || isImproving}
                      >
                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      </Button>
                    ))}
                  </div>
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
          <p className="whitespace-nowrap">Migliora il testo: puoi allungarlo, accorciarlo o cambiarlo completamente</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TextImproveControl;
