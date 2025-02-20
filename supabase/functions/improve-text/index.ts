
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_TOKENS = {
  title: 100,    
  description: 150  
};

const LANGUAGE_NAMES = {
  it: 'italiano',
  en: 'inglese',
  fr: 'francese',
  de: 'tedesco',
  pt: 'portoghese',
  zh: 'cinese mandarino',
};

type TextType = 'title' | 'description';

interface TextRequest {
  text: string;
  type: TextType;
  length: string;
  targetLanguage?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, length, targetLanguage = 'it' } = await req.json();
    console.log('Richiesta ricevuta:', { title, description, length, targetLanguage });

    // Prima traduciamo entrambi i testi se necessario
    async function detectLanguage(text: string) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'Sei un esperto linguista. Rispondi solo con il codice della lingua in cui è scritto il testo tra: it, en, fr, de, pt, zh'
            },
            { role: 'user', content: text }
          ],
          temperature: 0,
          max_tokens: 10
        }),
      });
      const data = await response.json();
      return data.choices[0].message.content.toLowerCase().trim();
    }

    // Rileva le lingue in parallelo
    const [titleLanguage, descriptionLanguage] = await Promise.all([
      detectLanguage(title),
      detectLanguage(description)
    ]);

    console.log('Lingue rilevate:', { titleLanguage, descriptionLanguage });

    async function translateText(text: string, sourceLanguage: string) {
      if (sourceLanguage === targetLanguage) {
        return text;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: `Sei un traduttore professionale esperto tra ${LANGUAGE_NAMES[sourceLanguage]} e ${LANGUAGE_NAMES[targetLanguage]}.
                       Il tuo compito è tradurre questo testo in ${LANGUAGE_NAMES[targetLanguage]} in modo accurato ma sintetico.
                       
                       Linee guida:
                       1. Mantieni il significato esatto del testo originale
                       2. Usa un linguaggio preciso e conciso
                       3. Evita giri di parole o espressioni ridondanti
                       4. Assicurati che la traduzione suoni naturale
                       5. Non aggiungere o omettere informazioni`
            },
            { role: 'user', content: text }
          ],
          temperature: 0.1,
          max_tokens: MAX_TOKENS.description,
          presence_penalty: -0.5, // Scoraggia l'aggiunta di contenuti non necessari
          frequency_penalty: 0.3  // Incoraggia leggermente la variazione del linguaggio per naturalezza
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content;
    }

    // Traduci entrambi i testi in parallelo se necessario
    const [translatedTitle, translatedDescription] = await Promise.all([
      translateText(title, titleLanguage),
      translateText(description, descriptionLanguage)
    ]);

    console.log('Testi tradotti:', { translatedTitle, translatedDescription });

    // Funzione per il miglioramento del testo
    async function improveText(text: string, type: TextType) {
      const lengthInstruction = length === 'shorter' ? 'più conciso' : 
                              length === 'longer' ? 'più dettagliato' : 
                              'della stessa lunghezza circa';

      const systemPrompt = type === 'title' 
        ? `Sei un esperto copywriter che scrive in ${LANGUAGE_NAMES[targetLanguage]}.
           Migliora questo titolo mantenendolo chiaro e diretto.
           
           Linee guida:
           1. Mantieni il messaggio principale
           2. Usa un linguaggio preciso
           3. Evita parole superflue
           4. Rendilo ${lengthInstruction}
           
           La versione finale deve essere naturale e efficace.`
        : `Sei un esperto copywriter che scrive in ${LANGUAGE_NAMES[targetLanguage]}.
           Migliora questa descrizione mantenendola chiara e diretta.
           
           Linee guida:
           1. Mantieni tutti i punti chiave
           2. Usa un linguaggio preciso
           3. Evita parole superflue
           4. Rendila ${lengthInstruction}
           
           La versione finale deve essere naturale e efficace.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text }
          ],
          temperature: type === 'title' ? 0.2 : 0.3,
          max_tokens: type === 'title' ? MAX_TOKENS.title : MAX_TOKENS.description,
          presence_penalty: -0.5,
          frequency_penalty: 0.3
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content;
    }

    // Migliora entrambi i testi in parallelo
    const [improvedTitle, improvedDescription] = await Promise.all([
      improveText(translatedTitle, 'title'),
      improveText(translatedDescription, 'description')
    ]);

    console.log('Testi migliorati:', { improvedTitle, improvedDescription });

    return new Response(
      JSON.stringify({ 
        title: {
          improvedText: improvedTitle,
          wasTranslated: titleLanguage !== targetLanguage
        },
        description: {
          improvedText: improvedDescription,
          wasTranslated: descriptionLanguage !== targetLanguage
        }
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  }
});
