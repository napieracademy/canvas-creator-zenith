
import React from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { AlignLeft, AlignCenter, AlignRight, Type, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  textAlign: 'left' | 'center' | 'right';
  onTextAlignChange: (value: 'left' | 'center' | 'right') => void;
  fontSize: number;
  onFontSizeChange: (value: number) => void;
  label: string;
  disabled?: boolean;
}

type ToneType = 'professionale' | 'casual' | 'energico' | 'empatico' | 'autorevole';

const TextInput: React.FC<TextInputProps> = ({ 
  value, 
  onChange, 
  textAlign, 
  onTextAlignChange,
  fontSize,
  onFontSizeChange,
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
      setIsOpen(false); // Chiudiamo il popover dopo il completamento
    }
  };

  const AlignIcon = {
    left: AlignLeft,
    center: AlignCenter,
    right: AlignRight
  }[textAlign];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={disabled || isImproving}>
                      <AlignIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onTextAlignChange('left')}>
                      <AlignLeft className="h-4 w-4 mr-2" />
                      Allinea a sinistra
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onTextAlignChange('center')}>
                      <AlignCenter className="h-4 w-4 mr-2" />
                      Centra
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onTextAlignChange('right')}>
                      <AlignRight className="h-4 w-4 mr-2" />
                      Allinea a destra
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Allineamento del testo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" disabled={disabled || isImproving}>
                      <Type className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Dimensione testo</Label>
                        <span className="text-sm text-muted-foreground">{fontSize}px</span>
                      </div>
                      <Slider
                        value={[fontSize]}
                        onValueChange={(values) => onFontSizeChange(values[0])}
                        min={32}
                        max={120}
                        step={1}
                        disabled={disabled || isImproving}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
              <TooltipContent>
                <p>Dimensione del testo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
        </div>
      </div>
      
      <Textarea
        placeholder={`Scrivi il tuo ${label.toLowerCase()} qui...`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="resize-none h-32 bg-white/50 backdrop-blur-sm focus:bg-white transition-colors duration-200"
        style={{ textAlign }}
        disabled={disabled || isImproving}
      />
    </div>
  );
};

export default TextInput;
