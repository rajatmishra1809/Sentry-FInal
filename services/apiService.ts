import { GoogleGenAI, Type } from "@google/genai";
import { SearchResult, IntelligenceReport, UserProfile } from '../types';

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const fetchLocation = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`);
    return await response.json();
  } catch (error) {
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
    // Optimized to 200px for instant results while maintaining enough detail for the B&W look
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages|images&format=json&piprop=thumbnail&pithumbsize=200&titles=${encodeURIComponent(city)}&origin=*`);
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    const urls: string[] = [];
    
    if (pages[pageId].thumbnail?.source) {
      urls.push(pages[pageId].thumbnail.source);
    }

    if (pages[pageId].images) {
      const imageTitles = pages[pageId].images
        .filter((img: any) => img.title.toLowerCase().endsWith('.jpg') || img.title.toLowerCase().endsWith('.png'))
        .slice(0, 3)
        .map((img: any) => img.title);

      const imageMetadataPromises = imageTitles.map(async (title: string) => {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&iiurlwidth=200&format=json&origin=*`);
        const imgData = await res.json();
        const p = imgData.query.pages;
        const id = Object.keys(p)[0];
        return p[id].imageinfo?.[0]?.thumburl || p[id].imageinfo?.[0]?.url;
      });

      const resolvedUrls = await Promise.all(imageMetadataPromises);
      resolvedUrls.forEach(url => { if (url) urls.push(url); });
    }
    
    return [...new Set(urls)].slice(0, 3);
  } catch (error) {
    return [];
  }
};

export const generateIntelligenceWithAI = async (city: string, country: string, temp: number, userProfile: UserProfile): Promise<IntelligenceReport> => {
  const ai = getAI();
  if (!ai) throw new Error("AI Service not initialized");

  try {
    const prompt = `Comprehensive travel intelligence for ${city}, ${country}. 
    User: ${userProfile.gender}, Religion: ${userProfile.religion}.
    
    REQUIREMENTS:
    1. Safety Matrix: scale 0-100. DO NOT use single digits for safe cities. NY/London should be 85-95.
    2. Customs: 3 specific local traditions (e.g., Diwali in Times Square for NYC).
    3. 5 Landmarks: 2 general world-famous (e.g., Statue of Liberty), 3 specifically relevant to ${userProfile.religion}.
    4. Descriptions: Explain importance to this specific user.
    Return compact JSON.`;

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
              minItems: 5,
              maxItems: 5,
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
      summary: "Mission-critical archive link established.",
      safety: { political: 92, crime: 85, health: 95, disaster: 98, lgbtq: 90 },
      etiquette: ["Respect local heritage"],
      traditions: ["Seasonal festivals"],
      clothing: "Climate-appropriate",
      food: ["Signature dishes"],
      warnings: ["Standard precautions"],
      nearbySpots: Array(5).fill({ name: "Strategic Spot", description: "Target landmark.", type: "Landmark" })
    };
  }
};