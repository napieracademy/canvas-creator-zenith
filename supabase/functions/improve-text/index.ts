
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

    const promptTitle = title ? `Migliora questo titolo ${getToneInstruction(tone)}. Rendilo ${length === 'shorter' ? 'più conciso' : length === 'longer' ? 'più dettagliato' : 'della stessa lunghezza circa'}:
${title}` : '';

    const promptDescription = description ? `Migliora questa descrizione ${getToneInstruction(tone)}. Rendila ${length === 'shorter' ? 'più concisa' : length === 'longer' ? 'più dettagliata' : 'della stessa lunghezza circa'}:
${description}` : '';

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
              content: 'Sei un esperto copywriter. Migliora il testo seguendo le istruzioni di tono e lunghezza. Non modificare informazioni fattuali.' 
            },
            { role: 'user', content: promptTitle }
          ],
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
              content: 'Sei un esperto copywriter. Migliora il testo seguendo le istruzioni di tono e lunghezza. Non modificare informazioni fattuali.' 
            },
            { role: 'user', content: promptDescription }
          ],
        }),
      }).then(r => r.json()) : null
    ]);

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
