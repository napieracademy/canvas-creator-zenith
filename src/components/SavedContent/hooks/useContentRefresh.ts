
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

export const useContentRefresh = (onFetchContents: () => Promise<void>) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log('🔄 [ContentRefresh] Starting refresh');
      
      const { data, error } = await supabase
        .from('extracted_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [ContentRefresh] Error fetching data:', error);
        throw error;
      }

      console.log('✅ [ContentRefresh] Data fetched successfully:', data?.length || 0, 'items');

      toast({
        title: "Lista aggiornata",
        description: `${data?.length || 0} contenuti caricati con successo`,
      });

      await onFetchContents();
    } catch (error) {
      console.error('❌ [ContentRefresh] Error during refresh:', error);
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
