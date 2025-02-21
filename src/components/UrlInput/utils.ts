
import { supabase } from '@/integrations/supabase/client';
import type { SaveToDbData } from './types';

export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

export const checkExistingContent = async (url: string) => {
  try {
    console.log('🔍 [UrlInput] Checking for existing content:', url);
    const { data: existingContent, error } = await supabase
      .from('extracted_content')
      .select('*')
      .eq('url', url)
      .maybeSingle();

    if (error) {
      console.error('❌ [UrlInput] Error checking existing content:', error);
      throw error;
    }

    console.log('✅ [UrlInput] Existing content check result:', existingContent);
    return existingContent;
  } catch (error) {
    console.error('❌ [UrlInput] Error in checkExistingContent:', error);
    throw error;
  }
};

export const saveToDatabase = async (data: SaveToDbData) => {
  try {
    console.log('💾 [UrlInput] Attempting to save data:', data);
    
    if (!data.url) {
      throw new Error('URL is required');
    }

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
      }]);

    if (error) {
      console.error('❌ [UrlInput] Error saving to database:', error);
      throw error;
    }

    console.log('✅ [UrlInput] Content saved to database successfully');
    return { saved: true, duplicate: false };
  } catch (error) {
    console.error('❌ [UrlInput] Error in saveToDatabase:', error);
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
