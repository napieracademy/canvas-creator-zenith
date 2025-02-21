
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

type OperationPriority = 'high' | 'medium' | 'low';

type Operation = {
  id: string;
  task: () => Promise<any>;
  retries?: number;
  priority: OperationPriority;
  timestamp: number;
  description?: string;
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const QUEUE_STORAGE_KEY = 'operation_queue';

const sortByPriority = (a: Operation, b: Operation) => {
  const priorityMap = { high: 3, medium: 2, low: 1 };
  if (priorityMap[a.priority] !== priorityMap[b.priority]) {
    return priorityMap[b.priority] - priorityMap[a.priority];
  }
  return a.timestamp - b.timestamp;
};

export const useOperationQueue = () => {
  const [queue, setQueue] = useState<Operation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Carica la coda dal localStorage all'avvio
  useEffect(() => {
    try {
      const savedQueue = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (savedQueue) {
        const parsedQueue = JSON.parse(savedQueue);
        setQueue(parsedQueue);
        console.log('📥 [OperationQueue] Loaded saved queue:', parsedQueue.length, 'operations');
      }
    } catch (error) {
      console.error('❌ [OperationQueue] Error loading saved queue:', error);
    }
  }, []);

  // Salva la coda nel localStorage quando cambia
  useEffect(() => {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
      console.log('💾 [OperationQueue] Queue saved:', queue.length, 'operations');
    } catch (error) {
      console.error('❌ [OperationQueue] Error saving queue:', error);
    }
  }, [queue]);

  const addToQueue = useCallback((operation: Omit<Operation, 'id' | 'timestamp'>) => {
    const newOperation = {
      ...operation,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      retries: 0,
      priority: operation.priority || 'medium'
    };
    
    setQueue(prev => {
      const newQueue = [...prev, newOperation].sort(sortByPriority);
      console.log('➕ [OperationQueue] Added operation:', newOperation.id, 'Priority:', newOperation.priority);
      return newQueue;
    });

    processQueue();
  }, []);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const processQueue = useCallback(async () => {
    if (isProcessing || queue.length === 0) return;

    setIsProcessing(true);
    const currentOperation = queue[0];

    try {
      console.log(`🔄 [OperationQueue] Processing operation ${currentOperation.id} (Priority: ${currentOperation.priority})`);
      await currentOperation.task();
      
      setQueue(prev => prev.slice(1).sort(sortByPriority));
      console.log(`✅ [OperationQueue] Operation ${currentOperation.id} completed`);
      
      toast({
        title: "Operazione completata",
        description: currentOperation.description || "L'operazione è stata eseguita con successo",
      });
    } catch (error) {
      console.error(`❌ [OperationQueue] Operation ${currentOperation.id} failed:`, error);
      
      if ((currentOperation.retries || 0) < MAX_RETRIES) {
        console.log(`🔄 [OperationQueue] Retrying operation ${currentOperation.id}`);
        
        setQueue(prev => [{
          ...currentOperation,
          retries: (currentOperation.retries || 0) + 1,
          timestamp: Date.now() // Aggiorna il timestamp per mantenere l'ordine corretto
        }, ...prev.slice(1)].sort(sortByPriority));
        
        await delay(RETRY_DELAY * (currentOperation.retries || 0));
      } else {
        console.error(`❌ [OperationQueue] Operation ${currentOperation.id} failed after ${MAX_RETRIES} retries`);
        setQueue(prev => prev.slice(1).sort(sortByPriority));
        
        toast({
          title: "Errore",
          description: `Impossibile completare l'operazione "${currentOperation.description || ''}" dopo diversi tentativi`,
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

  const clearQueue = useCallback(() => {
    setQueue([]);
    localStorage.removeItem(QUEUE_STORAGE_KEY);
    console.log('🗑️ [OperationQueue] Queue cleared');
    
    toast({
      title: "Coda svuotata",
      description: "Tutte le operazioni in coda sono state rimosse",
    });
  }, [toast]);

  const getQueueStatus = useCallback(() => {
    const priorityCounts = queue.reduce((acc, op) => {
      acc[op.priority] = (acc[op.priority] || 0) + 1;
      return acc;
    }, {} as Record<OperationPriority, number>);

    return {
      total: queue.length,
      priorities: priorityCounts,
      isProcessing,
    };
  }, [queue, isProcessing]);

  return { 
    addToQueue, 
    clearQueue, 
    getQueueStatus,
    isProcessing, 
    queueLength: queue.length 
  };
};
