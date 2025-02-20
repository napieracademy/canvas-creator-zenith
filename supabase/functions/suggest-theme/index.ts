
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
    const { title, description } = await req.json();

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
            content: `Sei un esperto di design che analizza il contenuto e suggerisce il tema più appropriato.
            Le categorie disponibili sono:
            - classic: per contenuti formali, business, professionali
            - cosmic: per contenuti innovativi, futuristici, tecnologici
            - retro: per contenuti nostalgici, vintage, retrò
            - avengers: per contenuti eroici, di intrattenimento, action
            
            Rispondi SOLO con il nome della categoria, nient'altro.`
          },
          {
            role: 'user',
            content: `Titolo: ${title}\nDescrizione: ${description}\nQuale categoria di tema suggerisci per questo contenuto?`
          }
        ],
      }),
    });

    const data = await response.json();
    const suggestedTheme = data.choices[0].message.content.toLowerCase().trim();

    return new Response(JSON.stringify({ theme: suggestedTheme }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
