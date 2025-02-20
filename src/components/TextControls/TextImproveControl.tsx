
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
type ToneType = 'formal' | 'casual' | 'professional' | 'friendly';

interface TextImproveControlProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
  otherText?: string;
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
  const [selectedTone, setSelectedTone] = React.useState<ToneType>('professional');
  const [isOpen, setIsOpen] = React.useState(false);

  const getLengthLabel = (length: LengthType) => {
    switch (length) {
      case 'shorter': return 'Più corto';
      case 'similar': return 'Lunghezza simile';
      case 'longer': return 'Più lungo';
    }
  };

  const getToneLabel = (tone: ToneType) => {
    switch (tone) {
      case 'formal': return 'Formale';
      case 'casual': return 'Informale';
      case 'professional': return 'Professionale';
      case 'friendly': return 'Amichevole';
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
        tone: selectedTone
      };

      console.log('Chiamata a improve-text con:', requestBody);

      const { data, error } = await supabase.functions.invoke('improve-text', {
        body: requestBody
      });

      console.log('Risposta della funzione:', { data, error });

      if (error) throw error;

      const improvedText = isTitle ? data?.title?.improvedText : data?.description?.improvedText;

      if (!improvedText) throw new Error('Nessun testo migliorato ricevuto');

      onChange(improvedText);
      toast({
        title: "Testo migliorato",
        description: `Testo migliorato in stile ${getToneLabel(selectedTone).toLowerCase()} con lunghezza ${getLengthLabel(selectedLength).toLowerCase()}`
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
                  <Label className="mb-2 block">Tono desiderato</Label>
                  <Select 
                    value={selectedTone} 
                    onValueChange={(value: ToneType) => setSelectedTone(value)}
                    disabled={disabled || isImproving}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Scegli il tono" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formale</SelectItem>
                      <SelectItem value="casual">Informale</SelectItem>
                      <SelectItem value="professional">Professionale</SelectItem>
                      <SelectItem value="friendly">Amichevole</SelectItem>
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
          <p className="whitespace-nowrap">Migliora il testo: puoi modificarne il tono e la lunghezza</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TextImproveControl;
