
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
    const { text, type } = await req.json();

    // Customize prompt based on text type
    let systemPrompt = "Sei un esperto di copywriting. ";
    if (type === 'title') {
      systemPrompt += "Migliora questo titolo mantenendolo conciso, incisivo ed efficace. Correggi eventuali errori grammaticali e migliora la leggibilità. Mantieni lo stesso significato ma rendilo più accattivante.";
    } else {
      systemPrompt += "Migliora questa descrizione mantenendo un tono professionale e chiaro. Correggi eventuali errori grammaticali e migliora la leggibilità. Mantieni lo stesso significato ma rendi il testo più scorrevole e coinvolgente.";
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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
      }),
    });

    const data = await response.json();
    const improvedText = data.choices[0].message.content;

    return new Response(JSON.stringify({ improvedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in improve-text function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
