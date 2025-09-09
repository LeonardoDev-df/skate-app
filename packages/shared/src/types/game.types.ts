export interface Game {
  id: string;
  players: Player[];
  currentPlayerIndex: number;
  status: GameStatus;
  rounds: Round[];
  winner?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Player {
  id: string;
  name: string;
  picture?: string;
  lives: number;
  isReady: boolean;
}

export interface Round {
  id: string;
  playerId: string;
  trick: Trick;
  attempts: Attempt[];
  status: RoundStatus;
}

export interface Trick {
  id: string;
  name: string;
  difficulty: number;
  category: string;
  videoUrl?: string;
}

export interface Attempt {
  playerId: string;
  success: boolean;
  timestamp: Date;
}

export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

export enum RoundStatus {
  SETTING_TRICK = 'setting_trick',
  ATTEMPTING = 'attempting',
  COMPLETED = 'completed',
}