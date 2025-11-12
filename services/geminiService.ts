import { GoogleGenAI } from "@google/genai";
import { Trip } from '../types';

// IMPORTANT: This assumes the API key is set in the environment variables.
// In a real application, this should be handled securely.
const API_KEY = process.env.API_KEY;

// Fix: Conditionally initialize GoogleGenAI to prevent errors when API_KEY is missing.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!API_KEY) {
  console.warn("Gemini API key not found. Blessing feature will be disabled.");
}

export const getTripBlessing = async (trip: Trip): Promise<string> => {
  // Fix: Check for the AI client instance instead of just the key.
  if (!ai) {
    return "The divine presence is always with you on your journey. May your trip be blessed. (API Key not configured)";
  }
  
  try {
    const prompt = `Generate a short, spiritual blessing (2-3 sentences) from ShraddhaYatra Trust for a devotee undertaking the "${trip.title}" pilgrimage from ${trip.from_station} to ${trip.to_station}. The tone should be uplifting, respectful, and encouraging.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching blessing from Gemini API:", error);
    return "May your journey be filled with peace and devotion. (Error fetching blessing)";
  }
};