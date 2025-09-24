export interface Skatepark {
  id: string;
  name: string;
  description: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  images: string[];
  region?: string; // Adicionar esta propriedade
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  favoriteSpots?: string[];
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  addSpotToFavorites?: (spotId: string) => Promise<void>; // Adicionar
  removeSpotFromFavorites?: (spotId: string) => Promise<void>; // Adicionar
  isSpotFavorite?: (spotId: string) => boolean; // Adicionar
}

export interface GameSession {
  id: string;
  creator: string; // Adicionar
  players: string[]; // Adicionar
  timer: number;
  status: 'waiting' | 'active' | 'completed';
  createdAt: string;
}

export interface SkateparksHook {
  skateparks: Skatepark[];
  loading: boolean;
  error: string | null;
  refetch?: () => void; // Adicionar
}