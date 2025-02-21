
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

type Operation = {
  id: string;
  task: () => Promise<any>;
  retries?: number;
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const useOperationQueue = () => {
  const [queue, setQueue] = useState<Operation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const addToQueue = useCallback((operation: Omit<Operation, 'id'>) => {
    const newOperation = {
      ...operation,
      id: Math.random().toString(36).substr(2, 9),
      retries: 0
    };
    
    setQueue(prev => [...prev, newOperation]);
    processQueue();
  }, []);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const processQueue = useCallback(async () => {
    if (isProcessing || queue.length === 0) return;

    setIsProcessing(true);
    const currentOperation = queue[0];

    try {
      console.log(`🔄 [OperationQueue] Processing operation ${currentOperation.id}`);
      await currentOperation.task();
      
      setQueue(prev => prev.slice(1));
      console.log(`✅ [OperationQueue] Operation ${currentOperation.id} completed`);
      
      toast({
        title: "Operazione completata",
        description: "L'operazione è stata eseguita con successo",
      });
    } catch (error) {
      console.error(`❌ [OperationQueue] Operation ${currentOperation.id} failed:`, error);
      
      if ((currentOperation.retries || 0) < MAX_RETRIES) {
        console.log(`🔄 [OperationQueue] Retrying operation ${currentOperation.id}`);
        
        setQueue(prev => [{
          ...currentOperation,
          retries: (currentOperation.retries || 0) + 1
        }, ...prev.slice(1)]);
        
        await delay(RETRY_DELAY * (currentOperation.retries || 0));
      } else {
        console.error(`❌ [OperationQueue] Operation ${currentOperation.id} failed after ${MAX_RETRIES} retries`);
        setQueue(prev => prev.slice(1));
        
        toast({
          title: "Errore",
          description: "Impossibile completare l'operazione dopo diversi tentativi",
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
      if (queue.length > 1) {
        processQueue();
      }
    }
  }, [queue, isProcessing, toast]);

  return { addToQueue, isProcessing, queueLength: queue.length };
};
