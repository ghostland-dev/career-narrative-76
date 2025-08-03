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
    const { text } = await req.json();

    const prompt = `Analyse ce texte et extrait les informations pour créer un CV structuré. Retourne UNIQUEMENT un JSON valide avec la structure exacte suivante :

{
  "personal_info": {
    "fullName": "nom complet trouvé ou vide",
    "email": "email trouvé ou vide", 
    "phone": "téléphone trouvé ou vide",
    "address": "adresse trouvée ou vide",
    "summary": "résumé professionnel créé basé sur le texte"
  },
  "experience": [
    {
      "id": "exp1",
      "title": "titre du poste",
      "company": "nom de l'entreprise",
      "location": "lieu si mentionné ou vide",
      "startDate": "YYYY-MM ou vide",
      "endDate": "YYYY-MM ou 'Présent' ou vide",
      "description": "description des responsabilités et réalisations"
    }
  ],
  "education": [
    {
      "id": "edu1", 
      "degree": "diplôme ou formation",
      "institution": "établissement",
      "location": "lieu si mentionné ou vide",
      "startDate": "YYYY-MM ou vide",
      "endDate": "YYYY-MM ou vide",
      "description": "détails supplémentaires si mentionnés ou vide"
    }
  ],
  "skills": ["compétence1", "compétence2", "compétence3"]
}

Texte à analyser :
${text}

Instructions :
- Extrait TOUTES les informations pertinentes
- Créé un résumé professionnel synthétique
- Identifie toutes les compétences mentionnées ou implicites
- Structure chronologiquement les expériences et formations
- Si une information n'est pas trouvée, utilise une chaîne vide
- Retourne UNIQUEMENT le JSON, sans commentaires ni markdown`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
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
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur API Gemini: ${response.status}`);
    }

    const result = await response.json();
    let parsedData = result.candidates[0].content.parts[0].text;
    
    // Clean up the response to extract JSON
    parsedData = parsedData.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const jsonData = JSON.parse(parsedData);
      return new Response(JSON.stringify({ 
        success: true,
        data: jsonData
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Erreur parsing JSON:', parseError);
      console.error('Réponse brute:', parsedData);
      throw new Error('Format de réponse invalide de l\'IA');
    }

  } catch (error) {
    console.error('Erreur dans ai-cv-parser:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});