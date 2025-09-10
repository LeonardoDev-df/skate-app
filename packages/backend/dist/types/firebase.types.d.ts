export interface User {
    id: string;
    uid: string;
    Firstname?: string;
    Secondname?: string;
    email: string;
    cpf?: string;
    cep?: string;
    address?: string;
    phone?: string;
    role?: 'user' | 'admin';
    status?: 'active' | 'inactive';
    createdAt?: string;
    updatedAt?: string;
}
export interface Skatista {
    id: string;
    name: string;
    email: string;
    status: string;
    image?: string;
    spots?: any[];
    invitation?: any;
}
export interface SkateparkSpot {
    City: string;
    Adress: string;
}
export interface SkateparkData {
    id: string;
    Spot?: Array<{
        Brasilia?: SkateparkSpot[];
    }>;
}
export interface GameInvite {
    id: string;
    creator: {
        id: string;
        name: string;
    };
    players: Array<{
        id: string;
        name: string;
        email: string;
        image: string;
    }>;
    skatePark: string;
    status: string;
    createdAt: any;
}
export interface Partida {
    id: string;
    skatePark: string;
    criadorDaManobra: any;
    inviteId: string;
    dataInicio: any;
    faseAtual: string;
    jogadores: Array<{
        id: string;
        name: string;
        letras: string;
    }>;
    eliminados: string[];
    jogoFinalizado: boolean;
    vencedor?: string;
    manobrasExecutadas: string[];
    turnoAtual: string;
    manobraAtual: string;
}
export interface Ranking {
    id: string;
    vencedor: string;
    skatePark: string;
    eliminados: string[];
    criador: string;
    inviteId: string;
    data: any;
}
