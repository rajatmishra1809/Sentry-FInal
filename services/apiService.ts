import { GoogleGenAI, Type } from "@google/genai";
import { SearchResult, IntelligenceReport, UserProfile } from '../types';

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

// Global session cache for extreme speed
const cache = {
  weather: new Map<string, { data: number, timestamp: number }>(),
  wiki: new Map<string, string>(),
  images: new Map<string, string[]>(),
  search: new Map<string, SearchResult[]>()
};

export const fetchLocation = async (query: string): Promise<SearchResult[]> => {
  const q = query.toLowerCase().trim();
  if (cache.search.has(q)) return cache.search.get(q)!;

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=8`);
    const data = await response.json();
    cache.search.set(q, data);
    return data;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};

export const fetchWeather = async (lat: number, lon: number): Promise<number> => {
  const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached = cache.weather.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 1800000) return cached.data; // 30m cache

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const data = await response.json();
    const temp = data.current_weather.temperature;
    cache.weather.set(cacheKey, { data: temp, timestamp: Date.now() });
    return temp;
  } catch (error) {
    return 20;
  }
};

export const fetchWikipediaSummary = async (city: string): Promise<string> => {
  if (cache.wiki.has(city)) return cache.wiki.get(city)!;

  try {
    let response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(city)}&format=json&origin=*&redirects=1`);
    let data = await response.json();
    let pages = data.query.pages;
    let pageId = Object.keys(pages)[0];
    
    if (pageId === "-1") {
      const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(city)}&format=json&origin=*`);
      const searchData = await searchRes.json();
      if (searchData.query?.search?.length > 0) {
        const correctTitle = searchData.query.search[0].title;
        response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(correctTitle)}&format=json&origin=*&redirects=1`);
        data = await response.json();
        pages = data.query.pages;
        pageId = Object.keys(pages)[0];
      }
    }

    const extract = pages[pageId]?.extract || "No immediate summary found in the archives.";
    cache.wiki.set(city, extract);
    return extract;
  } catch (error) {
    return "Connection to knowledge archives interrupted.";
  }
};

export const fetchCityImages = async (city: string): Promise<string[]> => {
  if (cache.images.has(city)) return cache.images.get(city)!;

  try {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages|images&format=json&piprop=thumbnail&pithumbsize=1000&titles=${encodeURIComponent(city)}&origin=*&redirects=1`);
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    const urls: string[] = [];
    
    if (pages[pageId]?.thumbnail?.source) {
      urls.push(pages[pageId].thumbnail.source);
    }

    if (pages[pageId]?.images) {
      const imageTitles = pages[pageId].images
        .filter((img: any) => {
          const t = img.title.toLowerCase();
          return t.endsWith('.jpg') || t.endsWith('.png') || t.endsWith('.jpeg');
        })
        .slice(0, 10)
        .map((img: any) => img.title);

      const imageMetadataPromises = imageTitles.map(async (title: string) => {
        try {
          const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&iiurlwidth=1000&format=json&origin=*`);
          const imgData = await res.json();
          const p = imgData.query.pages;
          const id = Object.keys(p)[0];
          return p[id].imageinfo?.[0]?.thumburl || p[id].imageinfo?.[0]?.url;
        } catch { return null; }
      });

      const resolvedUrls = await Promise.all(imageMetadataPromises);
      resolvedUrls.forEach(url => { if (url) urls.push(url); });
    }
    
    const finalUrls = [...new Set(urls)].slice(0, 6);
    cache.images.set(city, finalUrls);
    return finalUrls;
  } catch (error) {
    return [];
  }
};

export const generateIntelligenceWithAI = async (city: string, country: string, temp: number, userProfile: UserProfile): Promise<IntelligenceReport> => {
  const ai = getAI();
  if (!ai) throw new Error("AI Service missing API Key");

  const prompt = `Task: Generate a comprehensive travel dossier for ${city}, ${country}.
  User Identity: ${userProfile.name}, Religion: ${userProfile.religion}.

  CRITICAL GUIDELINES:
  1. GREETING: Provide the standard local cultural greeting of the city in its native language (e.g., 'Dzień dobry' for Poland, 'Kon'nichiwa' for Tokyo). Do NOT use religious salutations (like 'Sat Sri Akal') unless the city is a primary global religious hub for that faith.
  2. TRADITIONS: List significant cultural festivals and traditions characteristic of this city (e.g., 'Wielkanoc processions', 'Fat Thursday', 'Midsummer Wianki'). These should be inclusive.
  3. SAFETY SCORES: Use a 0-100 scale. Safe/developed cities must be 85-98.
  4. LANDMARKS: YOU MUST LIST EXACTLY 5 recommended spots in the 'nearbySpots' array. Ensure one reflects ${userProfile.religion} heritage if present in ${city}, but prioritize famous general landmarks for the rest.

  Output strictly as valid JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            greeting: { type: Type.STRING },
            safety: {
              type: Type.OBJECT,
              properties: {
                political: { type: Type.NUMBER },
                crime: { type: Type.NUMBER },
                health: { type: Type.NUMBER },
                disaster: { type: Type.NUMBER },
                lgbtq: { type: Type.NUMBER }
              },
              required: ["political", "crime", "health", "disaster", "lgbtq"]
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
          required: ["summary", "greeting", "safety", "etiquette", "traditions", "clothing", "food", "warnings", "nearbySpots"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.warn("AI Generation fallback.", error);
    return {
      summary: `${city} analysis complete. Local conditions are stable and welcoming.`,
      greeting: "Welcome",
      safety: { political: 90, crime: 85, health: 92, disaster: 98, lgbtq: 85 },
      etiquette: ["Respect local customs", "Greet others politely"],
      traditions: ["Major seasonal festivals", "Local street markets"],
      clothing: "Standard casual clothing appropriate for the weather.",
      food: ["Traditional regional dishes"],
      warnings: ["Standard tourist precautions recommended"],
      nearbySpots: [
        { name: "Historic District", description: "The cultural heart of the city.", type: "Landmark" },
        { name: "Religious Center", description: `Of interest for ${userProfile.religion} visitors.`, type: "Heritage" },
        { name: "City Park", description: "Vast green spaces for relaxation.", type: "Nature" },
        { name: "Local Market", description: "Vibrant place to find local crafts.", type: "Culture" },
        { name: "Waterfront", description: "Scenic area for evening strolls.", type: "Leisure" }
      ]
    };
  }
};