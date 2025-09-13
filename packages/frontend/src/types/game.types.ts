export interface Player {
  id: string;
  name: string;
  email: string;
  image: string;
  letras: string; // "S", "SK", "SKA", "SKAT", "SKATE"
  isOnline: boolean;
  currentSkatePark?: string;
}

export interface GameInvite {
  id: string;
  createdAt: any;
  expiresAt: any; // 3 minutos após criação
  creator: {
    id: string;
    name: string;
  };
  players: Player[];
  skatePark: string;
  status: 'Aguardando' | 'Expirado' | 'Em Andamento' | 'Finalizado' | 'Cancelado';
  responses: Record<string, 'accepted' | 'declined' | 'pending'>;
  timer: number; // segundos restantes
}

export interface GameMatch {
  id: string;
  inviteId: string;
  skatePark: string;
  jogadores: Player[];
  turnoAtual: string;
  faseAtual: 'aguardandoManobra' | 'executandoManobra' | 'votacao' | 'finalizado';
  manobraAtual: string;
  criadorDaManobra: string | null;
  jogadorExecutando: string;
  manobrasExecutadas: string[];
  eliminados: string[];
  vencedor: string;
  jogoFinalizado: boolean;
  dataInicio: any;
  turnoTimestamp: number;
  votacao: {
    jogadorVotando: string;
    votos: Record<string, 'acertou' | 'errou'>;
    votosNecessarios: number;
    resultado?: 'acertou' | 'errou';
  } | null;
  isFirstRound: boolean; // Primeira rodada não dá letra se errar
}

export type Manobra = {
  id: string;
  name: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Expert';
  category: 'Básico' | 'Flip' | 'Grind' | 'Aéreo' | 'Transição';
};