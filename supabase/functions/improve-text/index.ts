
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, type, length, targetLanguage = 'it' } = await req.json();
    console.log('Richiesta ricevuta:', { text, type, length, targetLanguage });

    // Verifica la lingua del testo input
    const languageCheckResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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

    const languageData = await languageCheckResponse.json();
    const sourceLanguage = languageData.choices[0].message.content.toLowerCase().trim();
    console.log('Lingua rilevata:', sourceLanguage);

    // Se la lingua sorgente è diversa dalla lingua target, traduciamo
    let textToImprove = text;
    if (sourceLanguage !== targetLanguage) {
      console.log('Avvio parafrasi e traduzione da', sourceLanguage, 'a', targetLanguage);
      const translationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: type === 'title' 
                ? `Sei un esperto di comunicazione bilingue che parla perfettamente ${LANGUAGE_NAMES[sourceLanguage]} e ${LANGUAGE_NAMES[targetLanguage]}.
                   Il tuo compito è capire il significato essenziale di questo titolo e ricrearlo in ${LANGUAGE_NAMES[targetLanguage]}.
                   
                   Non tradurre letteralmente, ma:
                   1. Comprendi il messaggio chiave e il tono
                   2. Considera il contesto culturale della lingua di destinazione
                   3. Ricrea il messaggio con parole e strutture naturali in ${LANGUAGE_NAMES[targetLanguage]}
                   4. Mantieni lo stesso impatto emotivo
                   
                   La versione finale deve sembrare pensata e scritta originariamente in ${LANGUAGE_NAMES[targetLanguage]}.`
                : `Sei un esperto di comunicazione bilingue che parla perfettamente ${LANGUAGE_NAMES[sourceLanguage]} e ${LANGUAGE_NAMES[targetLanguage]}.
                   Il tuo compito è capire il significato essenziale di questo testo e ricrearlo in ${LANGUAGE_NAMES[targetLanguage]}.
                   
                   Non tradurre letteralmente, ma:
                   1. Comprendi il messaggio principale e i dettagli importanti
                   2. Considera il contesto culturale e professionale
                   3. Ricrea il contenuto con espressioni naturali in ${LANGUAGE_NAMES[targetLanguage]}
                   4. Mantieni lo stesso livello di formalità e tono
                   
                   La versione finale deve sembrare pensata e scritta originariamente in ${LANGUAGE_NAMES[targetLanguage]}.`
            },
            { role: 'user', content: text }
          ],
          temperature: 0.3,
          max_tokens: type === 'title' ? MAX_TOKENS.title : MAX_TOKENS.description
        }),
      });

      const translationData = await translationResponse.json();
      textToImprove = translationData.choices[0].message.content;
      console.log('Testo parafrasato e tradotto:', textToImprove);
    }

    // Ora procediamo con il miglioramento del testo
    let systemPrompt = `Sei un esperto copywriter che scrive in ${LANGUAGE_NAMES[targetLanguage]}. `;

    const lengthInstruction = length === 'shorter' ? 'più conciso' : 
                            length === 'longer' ? 'più dettagliato' : 
                            'della stessa lunghezza circa';
    
    if (type === 'title') {
      systemPrompt += `
        Riscrivi questo titolo in modo naturale e scorrevole.
        
        Linee guida:
        1. Mantieni il messaggio essenziale
        2. Usa un linguaggio chiaro e diretto
        3. Evita espressioni forzate o artificiose
        4. Rendilo ${lengthInstruction}
        
        Il risultato deve essere naturale e convincente.
      `;
    } else {
      systemPrompt += `
        Riscrivi questa descrizione in modo naturale e scorrevole.
        
        Linee guida:
        1. Mantieni tutti i concetti chiave
        2. Usa un linguaggio chiaro e professionale
        3. Evita espressioni forzate o artificiose
        4. Rendila ${lengthInstruction}
        
        Il risultato deve essere naturale e convincente.
      `;
    }

    console.log('Avvio miglioramento testo');
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
              Testo da migliorare: ${textToImprove}
              
              Riscrivi questo testo in modo naturale e scorrevole, mantenendo il significato ma evitando forzature linguistiche.
              Il risultato deve essere ${lengthInstruction} rispetto all'originale.
            `
          }
        ],
        temperature: type === 'title' ? 0.4 : 0.6,
        top_p: type === 'title' ? 0.7 : 0.9,
        max_tokens: type === 'title' ? MAX_TOKENS.title : MAX_TOKENS.description
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error: ' + await response.text());
    }

    const data = await response.json();
    const improvedText = data.choices[0].message.content;
    console.log('Testo migliorato:', improvedText);

    return new Response(
      JSON.stringify({ 
        improvedText,
        wasTranslated: sourceLanguage !== targetLanguage 
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
