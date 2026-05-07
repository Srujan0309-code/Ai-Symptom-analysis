const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
});

const analyzeSymptoms = async (symptoms, language = 'en') => {
  const languageContext = language === 'hi' ? 'Response must be in Hindi where appropriate but keep technical JSON keys in English.' : 'Response must be in English.';
  
  const systemPrompt = `You are MediRoute AI, a safe medical triage assistant. 
Given symptoms, you must:
1. Classify urgency: Low | Medium | Emergency
2. Identify the probable condition category (NOT a diagnosis)
3. Recommend a specialist type (e.g., Cardiologist, Dermatologist, General Physician)
4. Give 2-3 safe next-step recommendations (e.g., "Drink fluids", "Rest", "Seek immediate help if pain worsens")
5. Set isEmergency=true if symptoms suggest life-threatening risk (e.g., chest pain, difficulty breathing, severe bleeding)

IMPORTANT: Always include a disclaimer that this is not a medical diagnosis.
${languageContext}

Respond ONLY with a JSON object in this format:
{
  "urgency": "Low" | "Medium" | "Emergency",
  "category": "String describing the category of symptoms",
  "specialist": "Type of specialist recommended",
  "advice": ["Step 1", "Step 2"],
  "disclaimer": "This is not a medical diagnosis.",
  "isEmergency": boolean
}`;

  try {
    if (!process.env.GROQ_API_KEY) {
      // Mock response for demo/if no key
      return {
        urgency: symptoms.toLowerCase().includes('chest') ? 'Emergency' : 'Medium',
        category: 'Respiratory or Cardiovascular',
        specialist: 'General Physician',
        advice: ['Monitor your temperature', 'Rest and hydrate'],
        disclaimer: 'This is a mock response because no API key was provided.',
        isEmergency: symptoms.toLowerCase().includes('chest')
      };
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Analyze these symptoms: ${symptoms}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    let content = chatCompletion.choices[0]?.message?.content || "";
    // Strip markdown code blocks if present
    content = content.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    return JSON.parse(content);
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Failed to analyze symptoms');
  }
};

module.exports = { analyzeSymptoms };
