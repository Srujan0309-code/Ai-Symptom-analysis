const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

export const analyzeSymptoms = async (symptoms: string, userId?: string, language: string = 'en') => {
  const response = await fetch(`${BACKEND_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symptoms, userId, language }),
  });
  if (!response.ok) throw new Error('Analysis failed');
  return response.json();
};

export const fetchClinics = async (specialty?: string) => {
  const url = new URL(`${BACKEND_URL}/clinics`);
  if (specialty) url.searchParams.append('specialty', specialty);
  
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error('Failed to fetch clinics');
  return response.json();
};

export const fetchHistory = async (userId: string) => {
  const response = await fetch(`${BACKEND_URL}/history/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
};
