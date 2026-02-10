import { GoogleGenAI, Type } from "@google/genai";
import { SearchResult, IntelligenceReport, UserProfile } from '../types';

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
      const imageTitles = pages[pageId].images
        .filter((img: any) => img.title.toLowerCase().endsWith('.jpg') || img.title.toLowerCase().endsWith('.png'))
        .slice(0, 6)
        .map((img: any) => img.title);

      // Fetch all image URLs in parallel for maximum speed
      const imageMetadataPromises = imageTitles.map(async (title: string) => {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json&origin=*`);
        const imgData = await res.json();
        const p = imgData.query.pages;
        const id = Object.keys(p)[0];
        return p[id].imageinfo?.[0]?.url;
      });

      const resolvedUrls = await Promise.all(imageMetadataPromises);
      resolvedUrls.forEach(url => { if (url) urls.push(url); });
    }
    
    return [...new Set(urls)].slice(0, 5);
  } catch (error) {
    console.error('Image fetch error', error);
    return [];
  }
};

export const generateIntelligenceWithAI = async (city: string, country: string, temp: number, userProfile: UserProfile): Promise<IntelligenceReport> => {
  const ai = getAI();
  if (!ai) throw new Error("AI Service not initialized");

  try {
    const prompt = `Travel intel for ${city}, ${country} (${temp}°C). User: ${userProfile.gender}, ${userProfile.religion}. 
    Provide safety scores, local traditions/greetings (BE SPECIFIC), etiquette, clothing, food, and 3 landmarks. Return compact JSON.`;

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
            traditions: { type: Type.ARRAY, items: { type: Type.STRING } },
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
    return {
      summary: "Backup intel loaded.",
      safety: { political: 80, crime: 80, health: 80, disaster: 90, lgbtq: 80 },
      etiquette: ["Respect local customs"],
      traditions: ["Friendly greetings"],
      clothing: "Casual/Respectful",
      food: ["Local cuisine"],
      warnings: ["Situational awareness advised"],
      nearbySpots: [{ name: "City Center", description: "Historic area", type: "Landmark" }]
    };
  }
};