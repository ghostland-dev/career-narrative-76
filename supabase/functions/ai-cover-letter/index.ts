import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, cv, jobTitle, company, jobDescription } = await req.json();
    
    let prompt = '';
    
    const cvSummary = `
Nom: ${cv.personal_info?.fullName || 'Non spécifié'}
Email: ${cv.personal_info?.email || 'Non spécifié'}
Résumé: ${cv.personal_info?.summary || 'Non spécifié'}
Expériences: ${cv.experience?.map(exp => `${exp.title} chez ${exp.company}`).join(', ') || 'Aucune'}
Compétences: ${cv.skills?.join(', ') || 'Aucune'}
Formation: ${cv.education?.map(edu => `${edu.degree} à ${edu.institution}`).join(', ') || 'Aucune'}
`;

    if (type === 'spontaneous') {
      prompt = `Génère une lettre de motivation spontanée professionnelle basée sur ce CV :

${cvSummary}

La lettre doit :
- Être chaleureuse et professionnelle
- Faire environ 200-250 mots
- Mettre en valeur les compétences du candidat
- Exprimer la motivation pour rejoindre une entreprise
- Être structurée (introduction, développement, conclusion)
- Éviter les clichés
- Être personnalisée selon le profil

Retourne uniquement le contenu de la lettre, sans titre ni signature.`;
    } else {
      prompt = `Génère une lettre de motivation ciblée pour ce poste :

Poste: ${jobTitle}
Entreprise: ${company}
${jobDescription ? `Description du poste: ${jobDescription}` : ''}

Profil du candidat :
${cvSummary}

La lettre doit :
- Être spécifiquement adaptée au poste et à l'entreprise
- Faire le lien entre les compétences du candidat et les besoins du poste
- Faire environ 200-250 mots
- Être structurée et professionnelle
- Montrer la connaissance de l'entreprise
- Éviter les formulations génériques

Retourne uniquement le contenu de la lettre, sans titre ni signature.`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur API Gemini: ${response.status}`);
    }

    const result = await response.json();
    const coverLetter = result.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ 
      success: true,
      coverLetter,
      type
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erreur dans ai-cover-letter:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});