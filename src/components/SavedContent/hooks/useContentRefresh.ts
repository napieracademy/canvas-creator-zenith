
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useMutation } from '@tanstack/react-query';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const DEBOUNCE_DELAY = 500;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useContentRefresh = (onFetchContents: () => Promise<void>) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);

  const fetchContentsWithRetry = async (retryCount = 0): Promise<any> => {
    try {
      console.log(`🔄 [ContentRefresh] Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      
      const { data, error } = await supabase
        .from('extracted_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        throw error;
      }

      console.log('✅ [ContentRefresh] Data fetched successfully:', data?.length || 0, 'items');
      return { data, error: null };
    } catch (error) {
      console.error(`❌ [ContentRefresh] Error on attempt ${retryCount + 1}:`, error);
      
      if (retryCount < MAX_RETRIES - 1) {
        console.log(`⏳ [ContentRefresh] Waiting ${RETRY_DELAY * (retryCount + 1)}ms before retry`);
        await delay(RETRY_DELAY * (retryCount + 1)); // Exponential backoff
        return fetchContentsWithRetry(retryCount + 1);
      }
      
      throw error;
    }
  };

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const now = Date.now();
      if (now - lastRefreshTime < DEBOUNCE_DELAY) {
        console.log('🔄 [ContentRefresh] Skipping refresh due to debounce');
        return;
      }

      console.log('🔄 [ContentRefresh] Starting refresh');
      const { data, error } = await fetchContentsWithRetry();
      
      if (error) {
        throw error;
      }

      setLastRefreshTime(now);
      return data;
    },
    onMutate: () => {
      setIsRefreshing(true);
      console.log('🔄 [ContentRefresh] Setting refresh state to true');
    },
    onSuccess: async (data) => {
      toast({
        title: "Lista aggiornata",
        description: `${data?.length || 0} contenuti caricati con successo`,
      });
      await onFetchContents();
    },
    onError: (error) => {
      console.error('❌ [ContentRefresh] Error during refresh:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare la lista dei contenuti. Riprova più tardi.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsRefreshing(false);
      console.log('🔄 [ContentRefresh] Setting refresh state to false');
    }
  });

  const handleRefresh = () => {
    if (isRefreshing) {
      console.log('🔄 [ContentRefresh] Already refreshing, skipping...');
      return;
    }

    refreshMutation.mutate();
  };

  return { handleRefresh, isRefreshing };
};
