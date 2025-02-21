
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { MetaService } from '@/utils/MetaService';

interface ApiKeyInputProps {
  onKeySet: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci una API key valida",
        variant: "destructive"
      });
      return;
    }

    MetaService.saveApiKey(apiKey);
    toast({
      title: "API key salvata",
      description: "La tua API key di ScraperAPI è stata salvata correttamente"
    });
    onKeySet();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>API Key ScraperAPI</Label>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Inserisci la tua API key di ScraperAPI"
        />
      </div>
      <Button type="submit">Salva API Key</Button>
    </form>
  );
};

export default ApiKeyInput;
