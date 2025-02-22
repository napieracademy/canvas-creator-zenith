
import { supabase } from '@/integrations/supabase/client';
import type { SaveToDbData } from './types';

export const isValidImageUrl = (url: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

export const saveToDatabase = async (data: SaveToDbData): Promise<boolean> => {
  try {
    console.log('💾 [UrlInput] Tentativo di salvataggio con dati:', data);
    const { error } = await supabase
      .from('extracted_content')
      .insert([{
        ...data,
        image_url: data.image_url || null // Assicuriamoci che l'immagine sia null se non presente
      }]);

    if (error) throw error;

    console.log('✅ [UrlInput] Contenuto salvato nel database con successo');
    return true;
  } catch (error) {
    console.error('❌ [UrlInput] Errore nel salvataggio:', error);
    return false;
  }
};

export const createSimulateProgress = (
  setProgress: React.Dispatch<React.SetStateAction<number>>
): () => () => void => {
  return () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev: number) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  };
};
