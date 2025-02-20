
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, length, tone } = await req.json();

    const getToneInstruction = (tone: string) => {
      switch (tone) {
        case 'formal': return 'in modo formale ed elegante';
        case 'casual': return 'in modo informale e rilassato';
        case 'professional': return 'in modo professionale e autorevole';
        case 'friendly': return 'in modo amichevole e accogliente';
        default: return 'mantenendo il tono originale';
      }
    };

    const promptTitle = title ? `Migliora questo titolo ${getToneInstruction(tone)}. Rendilo ${length === 'shorter' ? 'più conciso' : length === 'longer' ? 'più dettagliato' : 'della stessa lunghezza circa'}. Non aggiungere MAI virgolette o apici al testo:
${title}` : '';

    const promptDescription = description ? `Migliora questa descrizione ${getToneInstruction(tone)}. Rendila ${length === 'shorter' ? 'più concisa' : length === 'longer' ? 'più dettagliata' : 'della stessa lunghezza circa'}. Non aggiungere MAI virgolette o apici al testo:
${description}` : '';

    console.log('Invio richiesta a OpenAI:', { promptTitle, promptDescription });

    const results = await Promise.all([
      title ? fetch('https://api.openai.com/v1/chat/completions', {
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
              content: 'Sei un esperto copywriter. Migliora il testo seguendo le istruzioni di tono e lunghezza. Non modificare informazioni fattuali. Non aggiungere mai virgolette o apici al testo.' 
            },
            { role: 'user', content: promptTitle }
          ],
          temperature: 0.7, // Aggiungiamo un po' di creatività ma non troppa
          max_tokens: 150,  // Limitiamo la lunghezza della risposta
          presence_penalty: 0.3, // Incoraggiamo leggermente la varietà nel testo
          frequency_penalty: 0.3 // Evitiamo ripetizioni eccessive
        }),
      }).then(r => r.json()) : null,
      
      description ? fetch('https://api.openai.com/v1/chat/completions', {
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
              content: 'Sei un esperto copywriter. Migliora il testo seguendo le istruzioni di tono e lunghezza. Non modificare informazioni fattuali. Non aggiungere mai virgolette o apici al testo.' 
            },
            { role: 'user', content: promptDescription }
          ],
          temperature: 0.7,
          max_tokens: 250, // Permettiamo una risposta più lunga per le descrizioni
          presence_penalty: 0.3,
          frequency_penalty: 0.3
        }),
      }).then(r => r.json()) : null
    ]);

    console.log('Risposta da OpenAI:', results);

    return new Response(
      JSON.stringify({
        title: title ? { 
          improvedText: results[0].choices[0].message.content.trim() 
        } : null,
        description: description ? { 
          improvedText: results[1].choices[0].message.content.trim() 
        } : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
