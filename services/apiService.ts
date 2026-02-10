import { GoogleGenAI, Type } from "@google/genai";
import { SearchResult, IntelligenceReport, UserProfile } from '../types';

// Initialize AI lazily or with a check to avoid crash on import if key is missing during build
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const fetchLocation = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`);
    if (!response.ok) throw new Error('Search failed');
    return await response.json();
  } catch (error) {
    console.error('Nominatim error', error);
    return [];
  }
};

export const fetchWeather = async (lat: number, lon: number): Promise<number> => {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const data = await response.json();
    return data.current_weather.temperature;
  } catch (error) {
    return 20;
  }
};

export const fetchWikipediaSummary = async (city: string): Promise<string> => {
  try {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(city)}&format=json&origin=*`);
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    return pages[pageId].extract || "Detailed field report unavailable.";
  } catch (error) {
    return "Field report unavailable.";
  }
};

export const fetchCityImages = async (city: string): Promise<string[]> => {
  try {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages|images&format=json&piprop=original&pithumbsize=1000&titles=${encodeURIComponent(city)}&origin=*`);
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    const urls: string[] = [];
    
    if (pages[pageId].original?.source) {
      urls.push(pages[pageId].original.source);
    }

    if (pages[pageId].images) {
      const imageTitles = pages[pageId].images.slice(0, 5).map((img: any) => img.title);
      for (const title of imageTitles) {
        if (title.toLowerCase().endsWith('.jpg') || title.toLowerCase().endsWith('.png')) {
          const imgRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json&origin=*`);
          const imgData = await imgRes.json();
          const p = imgData.query.pages;
          const id = Object.keys(p)[0];
          if (p[id].imageinfo?.[0]?.url) {
            urls.push(p[id].imageinfo[0].url);
          }
        }
        if (urls.length >= 4) break;
      }
    }
    
    return urls.filter((url, index) => urls.indexOf(url) === index);
  } catch (error) {
    console.error('Image fetch error', error);
    return [];
  }
};

export const generateIntelligenceWithAI = async (city: string, country: string, temp: number, userProfile: UserProfile): Promise<IntelligenceReport> => {
  const ai = getAI();
  if (!ai) {
    throw new Error("AI Service not initialized - Missing API Key");
  }

  try {
    const prompt = `Generate a high-level travel intelligence dossier for ${city}, ${country}. 
    Current Temperature: ${temp}°C. 
    User Profile: ${userProfile.gender}, Religion: ${userProfile.religion}.
    
    Provide:
    1. Realistic safety scores (0-100).
    2. Cultural engagement protocols and SPECIFIC local traditions (e.g., if Lucknow, mention 'Tehzeeb' and 'Aap' culture; if Varanasi, mention 'Har Har Mahadev' greeting).
    3. Local traditions, linguistic nuances, and typical greetings unique to this area.
    4. 3-4 Must-visit high-priority tourist spots (landmarks).
    5. Specific advisories based on the user's profile.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            safety: {
              type: Type.OBJECT,
              properties: {
                political: { type: Type.NUMBER },
                crime: { type: Type.NUMBER },
                health: { type: Type.NUMBER },
                disaster: { type: Type.NUMBER },
                lgbtq: { type: Type.NUMBER }
              }
            },
            etiquette: { type: Type.ARRAY, items: { type: Type.STRING } },
            traditions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific local traditions, greetings, and linguistic nuances." },
            clothing: { type: Type.STRING },
            food: { type: Type.ARRAY, items: { type: Type.STRING } },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            nearbySpots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  type: { type: Type.STRING }
                },
                required: ["name", "description", "type"]
              }
            }
          },
          required: ["summary", "safety", "etiquette", "traditions", "clothing", "food", "warnings", "nearbySpots"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini failed, using fallback", error);
    return {
      summary: "Intelligence gathered via secondary channels.",
      safety: { political: 70, crime: 80, health: 90, disaster: 95, lgbtq: 70 },
      etiquette: ["Maintain general respect", "Observe local customs"],
      traditions: ["Greet with respect", "Follow local linguistic cues"],
      clothing: "Standard travel attire",
      food: ["Local delicacies"],
      warnings: ["Always maintain situational awareness."],
      nearbySpots: [
        { name: "City Center", description: "The historical heart of the district.", type: "Landmark" }
      ]
    };
  }
};