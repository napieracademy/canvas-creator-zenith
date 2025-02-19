
interface MetadataResult {
  success: boolean;
  title?: string;
  description?: string;
  image?: string;
  error?: string;
}

export class MetaService {
  static async extractMetadata(url: string): Promise<MetadataResult> {
    try {
      const response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        return {
          success: false,
          error: 'Errore nel formato della risposta'
        };
      }

      if (!data) {
        return {
          success: false,
          error: 'Nessun dato ricevuto dal server'
        };
      }

      return {
        success: true,
        title: data.title || '',
        description: data.description || '',
        image: data.image || ''
      };
    } catch (error) {
      console.error('Error in metadata extraction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Errore sconosciuto'
      };
    }
  }
}
