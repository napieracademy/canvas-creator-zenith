
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
          model: 'gpt-4o',
          messages: [
            { 
              role: 'system', 
              content: `Sei un esperto linguista. Rispondi solo con il codice della lingua del testo tra: ${Object.keys(LANGUAGE_NAMES).join(', ')}` 
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
          model: 'gpt-4o',
          messages: [
            { 
              role: 'system', 
              content: `Sei un esperto di comunicazione bilingue che parla perfettamente ${LANGUAGE_NAMES[sourceLanguage]} e ${LANGUAGE_NAMES[targetLanguage]}.
                       Il tuo compito è capire il significato essenziale di questo testo e ricrearlo in ${LANGUAGE_NAMES[targetLanguage]}.
                       
                       Non tradurre letteralmente, ma:
                       1. Comprendi il messaggio chiave
                       2. Considera il contesto culturale
                       3. Ricrea il contenuto con espressioni naturali
                       4. Mantieni lo stesso tono e stile
                       
                       La versione finale deve sembrare scritta originariamente in ${LANGUAGE_NAMES[targetLanguage]}.`
            },
            { role: 'user', content: text }
          ],
          temperature: 0.3,
          max_tokens: MAX_TOKENS.description
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
           Riscrivi questo titolo in modo naturale e scorrevole.
           
           Linee guida:
           1. Mantieni il messaggio essenziale
           2. Usa un linguaggio chiaro e diretto
           3. Evita espressioni forzate o artificiose
           4. Rendilo ${lengthInstruction}
           
           Il risultato deve essere naturale e convincente.`
        : `Sei un esperto copywriter che scrive in ${LANGUAGE_NAMES[targetLanguage]}.
           Riscrivi questa descrizione in modo naturale e scorrevole.
           
           Linee guida:
           1. Mantieni tutti i concetti chiave
           2. Usa un linguaggio chiaro e professionale
           3. Evita espressioni forzate o artificiose
           4. Rendila ${lengthInstruction}
           
           Il risultato deve essere naturale e convincente.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { 
              role: 'user', 
              content: `
                Testo da migliorare: ${text}
                
                Riscrivi questo testo in modo naturale e scorrevole, mantenendo il significato ma evitando forzature linguistiche.
                Il risultato deve essere ${lengthInstruction} rispetto all'originale.
              `
            }
          ],
          temperature: type === 'title' ? 0.4 : 0.6,
          max_tokens: type === 'title' ? MAX_TOKENS.title : MAX_TOKENS.description
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
