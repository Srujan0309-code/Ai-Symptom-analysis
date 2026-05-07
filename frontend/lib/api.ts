import { auth } from "./firebase";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

const getAuthHeaders = async (baseHeaders: Record<string, string> = {}) => {
  const user = auth.currentUser;
  const headers = { ...baseHeaders };
  if (user) {
    const token = await user.getIdToken();
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const analyzeSymptoms = async (symptoms: string, userId?: string, language: string = 'en') => {
  const headers = await getAuthHeaders({ 'Content-Type': 'application/json' });
  const response = await fetch(`${BACKEND_URL}/analyze`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ symptoms, language }),
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

export const fetchHistory = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BACKEND_URL}/history`, { headers });
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
};
