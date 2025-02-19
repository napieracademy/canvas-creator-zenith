
import React from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { AlignLeft, AlignCenter, AlignRight, Type, Wand2 } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
      console.log('Calling improve-text function with:', {
        text: value,
        type: label.toLowerCase() === 'titolo' ? 'title' : 'description'
      });

      const { data, error } = await supabase.functions.invoke('improve-text', {
        body: {
          text: value,
          type: label.toLowerCase() === 'titolo' ? 'title' : 'description'
        }
      });

      console.log('Function response:', { data, error });

      if (error) throw error;
      if (!data?.improvedText) throw new Error('Nessun testo migliorato ricevuto');

      onChange(data.improvedText);
      toast({
        title: "Testo migliorato",
        description: "Il testo è stato ottimizzato con successo"
      });
    } catch (error) {
      console.error('Error improving text:', error);
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante il miglioramento del testo",
        variant: "destructive"
      });
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2" disabled={disabled || isImproving}>
                <Type className="h-4 w-4" />
                {fontSize}px
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
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-md border border-input bg-transparent overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={`px-2.5 ${textAlign === 'left' ? 'bg-accent' : ''}`}
              onClick={() => onTextAlignChange('left')}
              disabled={disabled || isImproving}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-2.5 ${textAlign === 'center' ? 'bg-accent' : ''}`}
              onClick={() => onTextAlignChange('center')}
              disabled={disabled || isImproving}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-2.5 ${textAlign === 'right' ? 'bg-accent' : ''}`}
              onClick={() => onTextAlignChange('right')}
              disabled={disabled || isImproving}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2" 
            onClick={handleImproveText}
            disabled={disabled || isImproving}
          >
            <Wand2 className="h-4 w-4" />
            {isImproving ? 'Miglioramento...' : 'Migliora'}
          </Button>
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
