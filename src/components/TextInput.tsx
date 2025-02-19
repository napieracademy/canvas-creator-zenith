
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
        type: label.toLowerCase() === 'titolo' ? 'title' : 'description'
      });

      const { data, error } = await supabase.functions.invoke('improve-text', {
        body: {
          text: value,
          type: label.toLowerCase() === 'titolo' ? 'title' : 'description'
        }
      });

      console.log('Risposta della funzione:', { data, error });

      if (error) throw error;
      if (!data?.improvedText) throw new Error('Nessun testo migliorato ricevuto');

      onChange(data.improvedText);
      toast({
        title: "Testo migliorato",
        description: "Il testo è stato ottimizzato con successo"
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
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-9 p-0"
                  onClick={handleImproveText}
                  disabled={disabled || isImproving}
                  aria-label="Migliora automaticamente il testo"
                >
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Migliora automaticamente il testo</p>
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
