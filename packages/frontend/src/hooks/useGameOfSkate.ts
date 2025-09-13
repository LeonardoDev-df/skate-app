import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  arrayUnion,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { GameInvite, GameMatch, Player } from '../types/game.types';

// Sistema de Som
const createAudioContext = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    return audioContext;
  } catch (error) {
    console.warn('Web Audio API não suportado:', error);
    return null;
  }
};

const playSound = (frequency: number, duration: number = 200, type: 'success' | 'error' | 'notification' | 'vote' | 'elimination' | 'victory' = 'notification') => {
  const audioContext = createAudioContext();
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  const frequencies = {
    success: [523, 659, 784],
    error: [220, 185, 147],
    notification: [440, 554],
    vote: [349, 440],
    elimination: [196, 165, 131],
    victory: [523, 659, 784, 1047]
  };

  const freqs = frequencies[type];
  
  oscillator.frequency.setValueAtTime(freqs[0], audioContext.currentTime);
  if (freqs[1]) {
    oscillator.frequency.setValueAtTime(freqs[1], audioContext.currentTime + 0.1);
  }
  if (freqs[2]) {
    oscillator.frequency.setValueAtTime(freqs[2], audioContext.currentTime + 0.2);
  }
  if (freqs[3]) {
    oscillator.frequency.setValueAtTime(freqs[3], audioContext.currentTime + 0.3);
  }

  gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
};

export const useGameOfSkate = () => {
  const { skatista } = useAuth();
  const [gameInvites, setGameInvites] = useState<GameInvite[]>([]);
  const [activeGame, setActiveGame] = useState<GameMatch | null>(null);
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const playersCache = useRef<Record<string, { players: Player[], timestamp: number }>>({});
  const CACHE_DURATION = 30000;

  // Buscar convites
  useEffect(() => {
    if (!skatista) return;

    const q = query(
      collection(db, 'GameInvites'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const invites = snapshot.docs.map(doc => {
        const data = doc.data();
        
        const now = new Date();
        const expiresAt = data.expiresAt?.toDate();
        const timer = expiresAt ? Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000)) : 0;
        
        return {
          id: doc.id,
          ...data,
          timer
        };
      }).filter(invite => 
        invite.creator.id === skatista.uid || 
        invite.players.some((p: Player) => p.id === skatista.uid)
      ) as GameInvite[];
      
      setGameInvites(invites);

      invites.forEach(invite => {
        if (invite.timer <= 0 && invite.status === 'Aguardando') {
          updateDoc(doc(db, 'GameInvites', invite.id), {
            status: 'Expirado'
          }).catch(err => console.error('Erro ao expirar convite:', err));
        }
      });
    });

    return unsubscribe;
  }, [skatista]);

  // Buscar jogo ativo
  useEffect(() => {
    if (!skatista) return;

    const q = query(
      collection(db, 'Partidas'),
      where('jogoFinalizado', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activeGames = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GameMatch[];

      const myGame = activeGames.find(game => 
        game.jogadores?.some(p => p.id === skatista.uid)
      );

      setActiveGame(myGame || null);
    });

    return unsubscribe;
  }, [skatista]);

  // Buscar rankings
  useEffect(() => {
    const q = query(
      collection(db, 'ranking'),
      orderBy('data', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rankingData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRankings(rankingData);
    });

    return unsubscribe;
  }, []);

  const getSkateParksPlayers = useCallback(async (skatePark: string): Promise<Player[]> => {
    try {
      const cacheKey = skatePark;
      const cached = playersCache.current[cacheKey];
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        return cached.players;
      }

      const skatistasQuery = query(collection(db, 'Skatistas'));
      const snapshot = await getDocs(skatistasQuery);
      
      const players: Player[] = [];
      
      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        
        if (!data.uid || data.uid === skatista?.uid || data.status !== 'Online') {
          return;
        }
        
        const hasSkatepark = data.spots?.some((spot: any) => {
          const spotPath = spot.path || spot;
          const spotName = typeof spot === 'string' ? spot : spotPath;
          
          return spotName.includes(skatePark) || 
                 spotName.includes(skatePark.replace(/\s+/g, '%20')) ||
                 spotName.includes(skatePark.replace(/\s+/g, ' ')) ||
                 spotPath.includes(skatePark);
        });

        if (hasSkatepark) {
          players.push({
            id: data.uid,
            name: data.name,
            email: data.email,
            image: data.image || 'sk10.jpg',
            letras: '',
            isOnline: true,
            currentSkatePark: skatePark
          });
        }
      });
      
      playersCache.current[cacheKey] = {
        players,
        timestamp: now
      };
      
      return players;
    } catch (error) {
      console.error('❌ Erro ao buscar jogadores:', error);
      return [];
    }
  }, [skatista?.uid]);

  const createGameInvite = useCallback(async (skatePark: string, invitedPlayers: Player[]) => {
    if (!skatista) throw new Error('Usuário não autenticado');

    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 3 * 60 * 1000);

      const allPlayers = [
        {
          id: skatista.uid,
          name: skatista.name,
          email: skatista.email,
          image: skatista.image,
          letras: '',
          isOnline: true,
          currentSkatePark: skatePark
        },
        ...invitedPlayers
      ];

      const responses: Record<string, 'accepted' | 'declined' | 'pending'> = {};
      allPlayers.forEach(player => {
        responses[player.id] = player.id === skatista.uid ? 'accepted' : 'pending';
      });

      const inviteData = {
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(expiresAt),
        creator: {
          id: skatista.uid,
          name: skatista.name
        },
        players: allPlayers,
        skatePark,
        status: 'Aguardando',
        responses,
        timer: 180
      };

      const docRef = await addDoc(collection(db, 'GameInvites'), inviteData);
      playersCache.current = {};
      
      playSound(440, 300, 'notification');
      
      return docRef.id;
    } catch (error: any) {
      setError(error.message);
      playSound(220, 500, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [skatista]);

  const respondToInvite = useCallback(async (inviteId: string, response: 'accepted' | 'declined') => {
    if (!skatista) throw new Error('Usuário não autenticado');

    setLoading(true);
    setError(null);

    try {
      const invite = gameInvites.find(inv => inv.id === inviteId);
      if (!invite) throw new Error('Convite não encontrado');

      const updatedResponses = {
        ...invite.responses,
        [skatista.uid]: response
      };

      await updateDoc(doc(db, 'GameInvites', inviteId), {
        responses: updatedResponses
      });

      const allResponses = Object.values(updatedResponses);
      const allAccepted = allResponses.every(resp => resp === 'accepted');
      const hasDeclined = allResponses.some(resp => resp === 'declined');

      if (hasDeclined) {
        await updateDoc(doc(db, 'GameInvites', inviteId), {
          status: 'Cancelado'
        });
        playSound(220, 500, 'error');
      } else if (allAccepted) {
        await startGame(invite);
        playSound(523, 800, 'success');
      } else {
        playSound(440, 200, 'notification');
      }

    } catch (error: any) {
      setError(error.message);
      playSound(220, 500, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [skatista, gameInvites]);

  const startGame = useCallback(async (invite: GameInvite) => {
    try {
      const randomIndex = Math.floor(Math.random() * invite.players.length);
      const firstPlayer = invite.players[randomIndex];

      const gameData = {
        inviteId: invite.id,
        skatePark: invite.skatePark,
        jogadores: invite.players.map(p => ({ ...p, letras: '' })),
        turnoAtual: firstPlayer.id,
        faseAtual: 'aguardandoManobra',
        manobraAtual: '',
        criadorDaManobra: null,
        jogadorExecutando: '',
        manobrasExecutadas: [],
        eliminados: [],
        vencedor: '',
        jogoFinalizado: false,
        dataInicio: serverTimestamp(),
        turnoTimestamp: Date.now(),
        votacao: null,
        isFirstRound: true
      };

      await addDoc(collection(db, 'Partidas'), gameData);

      await updateDoc(doc(db, 'GameInvites', invite.id), {
        status: 'Em Andamento'
      });

    } catch (error) {
      console.error('❌ Erro ao iniciar jogo:', error);
      throw error;
    }
  }, []);

  const escolherManobra = useCallback(async (manobra: string) => {
    if (!activeGame || !skatista) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, 'Partidas', activeGame.id), {
        manobraAtual: manobra,
        criadorDaManobra: skatista.uid,
        jogadorExecutando: skatista.uid,
        faseAtual: 'executandoManobra',
        manobrasExecutadas: arrayUnion(manobra),
        turnoTimestamp: Date.now()
      });
      
      playSound(440, 300, 'notification');
    } catch (error: any) {
      setError(error.message);
      playSound(220, 500, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [activeGame, skatista]);

 // ✅ NOVA FUNÇÃO: Finalizar execução da manobra (sem dizer se acertou/errou)
const finalizarExecucao = useCallback(async () => {
  if (!activeGame || !skatista) return;

  setLoading(true);
  try {
    // ✅ CORREÇÃO: Quem executa NÃO pode dizer se acertou/errou
    // Apenas os outros jogadores votam
    const votingPlayers = activeGame.jogadores.filter(p => 
      p.id !== skatista.uid && // Quem executa não vota
      !activeGame.eliminados.includes(p.id) // Eliminados não votam
    );

    console.log('🗳️ Iniciando votação automática:', {
      jogadorExecutando: skatista.name,
      votingPlayers: votingPlayers.map(p => p.name),
      totalVotantes: votingPlayers.length
    });

    // ✅ CORREÇÃO: Não incluir campo 'resultado' se for undefined
    const votacao = {
      jogadorVotando: skatista.uid,
      votos: {},
      votosNecessarios: votingPlayers.length
      // ✅ REMOVIDO: resultado: undefined (causava erro no Firebase)
    };

    await updateDoc(doc(db, 'Partidas', activeGame.id), {
      faseAtual: 'votacao',
      votacao
    });
    
    playSound(349, 300, 'vote');
  } catch (error: any) {
    setError(error.message);
    playSound(220, 500, 'error');
    throw error;
  } finally {
    setLoading(false);
  }
}, [activeGame, skatista]);

// ✅ VOTAR CORRIGIDO - Reduzir delay para 2 segundos
const votar = useCallback(async (voto: 'acertou' | 'errou') => {
  if (!activeGame || !skatista || !activeGame.votacao) return;
  
  if (skatista.uid === activeGame.jogadorExecutando || 
      activeGame.eliminados.includes(skatista.uid) ||
      activeGame.votacao.votos[skatista.uid]) {
    return;
  }

  setLoading(true);
  try {
    const novosVotos = {
      ...activeGame.votacao.votos,
      [skatista.uid]: voto
    };

    const votosRecebidos = Object.keys(novosVotos).length;
    const votacaoUpdate: any = {
      ...activeGame.votacao,
      votos: novosVotos
    };

    if (votosRecebidos >= activeGame.votacao.votosNecessarios) {
      const votosErrou = Object.values(novosVotos).filter(v => v === 'errou').length;
      const votosAcertou = Object.values(novosVotos).filter(v => v === 'acertou').length;
      
      const resultado = votosAcertou === activeGame.votacao.votosNecessarios ? 'acertou' : 'errou';
      votacaoUpdate.resultado = resultado;

      console.log('🏁 Resultado da votação:', { resultado, votosAcertou, votosErrou });

      await updateDoc(doc(db, 'Partidas', activeGame.id), {
        votacao: votacaoUpdate
      });

      // ✅ CORREÇÃO: Reduzir delay para 2 segundos
      setTimeout(async () => {
        try {
          if (resultado === 'errou') {
            await processarErro(activeGame.jogadorExecutando);
            playSound(220, 600, 'error');
          } else {
            await processarAcerto();
            playSound(523, 600, 'success');
          }
        } catch (error) {
          console.error('❌ Erro ao processar resultado:', error);
        }
      }, 2000); // ✅ Reduzido de 3000 para 2000ms
    } else {
      await updateDoc(doc(db, 'Partidas', activeGame.id), {
        votacao: votacaoUpdate
      });
    }
    
    playSound(440, 200, 'vote');
  } catch (error: any) {
    setError(error.message);
    playSound(220, 500, 'error');
    throw error;
  } finally {
    setLoading(false);
  }
}, [activeGame, skatista]);



  const getNextPlayer = (jogadores: Player[], currentPlayer: string, eliminados: string[]): string => {
    const jogadoresAtivos = jogadores.filter(p => !eliminados.includes(p.id));
    const currentIndex = jogadoresAtivos.findIndex(p => p.id === currentPlayer);
    const nextIndex = (currentIndex + 1) % jogadoresAtivos.length;
    return jogadoresAtivos[nextIndex].id;
  };

  const processarErro = async (playerId: string) => {
    if (!activeGame) return;

    try {
      const player = activeGame.jogadores.find(p => p.id === playerId);
      if (!player) return;

      const letrasSequence = ['S', 'K', 'A', 'T', 'E'];
      const novasLetras = player.letras + letrasSequence[player.letras.length];
      
      const jogadoresAtualizados = activeGame.jogadores.map(p => 
        p.id === playerId ? { ...p, letras: novasLetras } : p
      );

      const eliminados = [...activeGame.eliminados];
      const foiEliminado = novasLetras === 'SKATE';
      
      if (foiEliminado) {
        eliminados.push(playerId);
        playSound(196, 800, 'elimination');
      }

      const jogadoresAtivos = jogadoresAtualizados.filter(p => !eliminados.includes(p.id));
      const jogoFinalizado = jogadoresAtivos.length <= 1;
      const vencedor = jogoFinalizado && jogadoresAtivos.length === 1 
        ? jogadoresAtivos[0].name 
        : '';

      const nextPlayer = jogoFinalizado ? '' : getNextPlayer(jogadoresAtualizados, activeGame.turnoAtual, eliminados);

      await updateDoc(doc(db, 'Partidas', activeGame.id), {
        jogadores: jogadoresAtualizados,
        eliminados,
        jogoFinalizado,
        vencedor,
        turnoAtual: nextPlayer,
        faseAtual: jogoFinalizado ? 'finalizado' : 'aguardandoManobra',
        manobraAtual: '',
        criadorDaManobra: null,
        jogadorExecutando: '',
        votacao: null
      });

      if (jogoFinalizado) {
        await salvarRanking(jogadoresAtualizados, eliminados, vencedor);
        playSound(523, 1500, 'victory');
      }

    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const processarAcerto = async () => {
    if (!activeGame) return;

    try {
      const nextPlayer = getNextPlayer(activeGame.jogadores, activeGame.turnoAtual, activeGame.eliminados);
      
      await updateDoc(doc(db, 'Partidas', activeGame.id), {
        turnoAtual: nextPlayer,
        jogadorExecutando: nextPlayer,
        faseAtual: 'executandoManobra',
        votacao: null
      });
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const salvarRanking = async (jogadores: Player[], eliminados: string[], vencedor: string) => {
    if (!activeGame) return;

    try {
      await addDoc(collection(db, 'ranking'), {
        criador: activeGame.criadorDaManobra || 'Sistema',
        data: serverTimestamp(),
        eliminados: eliminados.map(id => 
          jogadores.find(p => p.id === id)?.name || 'Desconhecido'
        ),
        inviteId: activeGame.inviteId,
        skatePark: activeGame.skatePark,
        vencedor,
        jogadores: jogadores.map(p => ({
          name: p.name,
          letras: p.letras,
          eliminado: eliminados.includes(p.id)
        })),
        manobrasExecutadas: activeGame.manobrasExecutadas
      });
    } catch (error) {
      console.error('❌ Erro ao salvar ranking:', error);
    }
  };

  const clearPlayersCache = useCallback(() => {
    playersCache.current = {};
  }, []);

  return {
    gameInvites,
    activeGame,
    rankings,
    loading,
    error,
    getSkateParksPlayers,
    createGameInvite,
    respondToInvite,
    escolherManobra,
    finalizarExecucao, // ✅ NOVA FUNÇÃO
    votar,
    clearPlayersCache
  };
};