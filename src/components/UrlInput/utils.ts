
import { supabase } from '@/integrations/supabase/client';
import type { SaveToDbData } from './types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

export const checkExistingContent = async (url: string, retryCount = 0) => {
  try {
    console.log(`🔍 [UrlInput] Checking for existing content (attempt ${retryCount + 1}):`, url);
    
    const { data: existingContent, error } = await supabase
      .from('extracted_content')
      .select('id, url, title, description, image_url')  // Ottimizzazione: seleziona solo i campi necessari
      .eq('url', url)
      .maybeSingle();

    if (error) {
      throw error;
    }

    console.log('✅ [UrlInput] Existing content check result:', existingContent);
    return existingContent;
  } catch (error) {
    console.error(`❌ [UrlInput] Error in checkExistingContent (attempt ${retryCount + 1}):`, error);
    
    if (retryCount < MAX_RETRIES - 1) {
      await delay(RETRY_DELAY * (retryCount + 1));
      return checkExistingContent(url, retryCount + 1);
    }
    
    throw error;
  }
};

export const saveToDatabase = async (data: SaveToDbData, retryCount = 0) => {
  try {
    console.log(`💾 [UrlInput] Attempting to save data (attempt ${retryCount + 1}):`, data);
    
    if (!data.url) {
      throw new Error('URL is required');
    }

    // Cache prevention
    const timestamp = new Date().getTime();
    const existingContent = await checkExistingContent(data.url);

    if (existingContent) {
      console.log('🔄 [UrlInput] Found existing content');
      return { saved: false, duplicate: true, existingContent };
    }

    const { error } = await supabase
      .from('extracted_content')
      .insert([{
        url: data.url,
        title: data.title || '',
        description: data.description || '',
        extracted_content: data.extractedContent || '',
        credits: data.credits || '',
        image_url: data.image_url || null,
        extraction_date: data.extraction_date || new Date().toISOString(),
        created_at: new Date().toISOString()
      }])
      .select('id')  // Ottimizzazione: ritorna solo l'ID del nuovo record
      .single();

    if (error) {
      throw error;
    }

    console.log('✅ [UrlInput] Content saved to database successfully');
    return { saved: true, duplicate: false };
  } catch (error) {
    console.error(`❌ [UrlInput] Error in saveToDatabase (attempt ${retryCount + 1}):`, error);
    
    if (retryCount < MAX_RETRIES - 1) {
      await delay(RETRY_DELAY * (retryCount + 1));
      return saveToDatabase(data, retryCount + 1);
    }
    
    return { saved: false, duplicate: false, error };
  }
};

export const createSimulateProgress = (
  setProgress: React.Dispatch<React.SetStateAction<number>>
): () => () => void => {
  return () => {
    let interval: number;
    
    setProgress(0);
    interval = window.setInterval(() => {
      setProgress((prev: number) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      setProgress(0);
    };
  };
};
