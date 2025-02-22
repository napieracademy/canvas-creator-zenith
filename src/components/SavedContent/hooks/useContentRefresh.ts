
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

export const useContentRefresh = (onFetchContents: () => Promise<void>) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('extracted_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      toast({
        title: "Lista aggiornata",
        description: "I contenuti sono stati aggiornati con successo",
      });

      onFetchContents();
    } catch (error) {
      console.error('Errore durante l\'aggiornamento della lista:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare la lista dei contenuti",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return { handleRefresh, isRefreshing };
};
