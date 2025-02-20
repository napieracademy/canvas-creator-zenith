
import React from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Globe } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TextTranslateControlProps {
  texts: { title: string; description: string };
  onTranslate: (newTexts: { title: string; description: string }) => void;
  disabled?: boolean;
}

type LanguageType = 'it' | 'en' | 'fr' | 'de' | 'pt' | 'zh';

const TextTranslateControl: React.FC<TextTranslateControlProps> = ({ 
  texts,
  onTranslate,
  disabled 
}) => {
  const [isTranslating, setIsTranslating] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState<LanguageType>('en');
  const [isOpen, setIsOpen] = React.useState(false);

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

  const handleTranslate = async () => {
    if (!texts.title.trim() && !texts.description.trim()) {
      toast({
        title: "Testo mancante",
        description: "Inserisci del testo prima di utilizzare la traduzione",
        variant: "destructive"
      });
      return;
    }

    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-text', {
        body: {
          texts,
          targetLanguage: selectedLanguage
        }
      });

      if (error) throw error;

      const { title, description } = data;
      onTranslate({ title, description });

      toast({
        title: "Testo tradotto",
        description: `Tradotto in ${getLanguageLabel(selectedLanguage).toLowerCase()}`
      });
    } catch (error) {
      console.error('Errore nella traduzione:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la traduzione",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="w-9 p-0"
          disabled={disabled || isTranslating}
          aria-label="Traduci il testo"
        >
          <Globe className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Lingua di destinazione</Label>
            <Select 
              value={selectedLanguage} 
              onValueChange={(value: LanguageType) => setSelectedLanguage(value)}
              disabled={disabled || isTranslating}
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

          <Button 
            className="w-full" 
            onClick={handleTranslate}
            disabled={disabled || isTranslating}
          >
            {isTranslating ? "Traduzione in corso..." : "Traduci il testo"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TextTranslateControl;
