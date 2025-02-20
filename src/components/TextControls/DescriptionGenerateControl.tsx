
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface DescriptionGenerateControlProps {
  title: string;
  onDescriptionGenerated: (description: string) => void;
  disabled?: boolean;
}

const DescriptionGenerateControl: React.FC<DescriptionGenerateControlProps> = ({
  title,
  onDescriptionGenerated,
  disabled
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDescription = async () => {
    if (!title.trim()) {
      toast({
        title: "Titolo mancante",
        description: "Inserisci un titolo prima di generare la descrizione",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-description', {
        body: { title }
      });

      if (error) throw error;

      const description = data.description;
      onDescriptionGenerated(description);

      toast({
        title: "Descrizione generata",
        description: "Una nuova descrizione è stata generata in base al titolo"
      });
    } catch (error) {
      console.error('Errore nella generazione della descrizione:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la generazione della descrizione",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-9 p-0"
            onClick={handleGenerateDescription}
            disabled={disabled || isGenerating}
          >
            <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Genera automaticamente una descrizione dal titolo</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DescriptionGenerateControl;
