export interface Skatepark {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  type: string;
  coordinates: {
    lat: number;
    lng: number;
    source: string;
  };
}

export interface SkateparkFilters {
  city?: string;
  state?: string;
  type?: string;
  search?: string;
}

export interface SkateparkResponse {
  skateparks: Skatepark[];
  count: number;
  message?: string;
  timestamp: string;
}