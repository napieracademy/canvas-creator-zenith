
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useContentRefresh = (onFetchContents: () => Promise<void>) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchContentsWithRetry = async (retryCount = 0): Promise<any> => {
    try {
      console.log(`🔄 [ContentRefresh] Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      
      const { data, error } = await supabase
        .from('extracted_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100); // Ottimizzazione: limita il numero di record per migliorare le performance

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error(`❌ [ContentRefresh] Error on attempt ${retryCount + 1}:`, error);
      
      if (retryCount < MAX_RETRIES - 1) {
        await delay(RETRY_DELAY * (retryCount + 1)); // Exponential backoff
        return fetchContentsWithRetry(retryCount + 1);
      }
      
      throw error;
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) {
      console.log('🔄 [ContentRefresh] Already refreshing, skipping...');
      return;
    }

    setIsRefreshing(true);
    try {
      console.log('🔄 [ContentRefresh] Starting refresh');
      
      const { data, error } = await fetchContentsWithRetry();

      if (error) {
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
        description: "Impossibile aggiornare la lista dei contenuti. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return { handleRefresh, isRefreshing };
};
