export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  level: number;
  experience: number;
  gamesWon: number;
  gamesLost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalGames: number;
  winRate: number;
  favoriteSpots: string[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}