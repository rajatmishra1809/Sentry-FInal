
export interface UserProfile {
  name: string;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Other';
  religion: string;
}

export interface CityData {
  name: string;
  country: string;
  lat: number;
  lon: number;
  temp: number;
  description: string;
  imageUrls?: string[];
  compatibilityScore: number;
  intelligence: IntelligenceReport;
}

export interface IntelligenceReport {
  summary: string;
  greeting: string;
  safety: {
    political: number;
    crime: number;
    health: number;
    disaster: number;
    lgbtq: number;
  };
  etiquette: string[];
  traditions: string[];
  clothing: string;
  food: string[];
  warnings: string[];
  nearbySpots: {
    name: string;
    description: string;
    type: string;
  }[];
}

export interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    country: string;
    country_code: string;
  };
}