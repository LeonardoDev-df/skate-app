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

export const useGameOfSkate = () => {
  const { skatista } = useAuth();
  const [gameInvites, setGameInvites] = useState<GameInvite[]>([]);
  const [activeGame, setActiveGame] = useState<GameMatch | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ Cache para evitar buscas repetidas
  const playersCache = useRef<Record<string, { players: Player[], timestamp: number }>>({});
  const CACHE_DURATION = 30000; // 30 segundos

  // Buscar convites com timer
  useEffect(() => {
    if (!skatista) return;

    const q = query(
      collection(db, 'GameInvites'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const invites = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Calcular timer restante
        const now = new Date();
        const expiresAt = data.expiresAt?.toDate();
        const timer = expiresAt ? Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000)) : 0;
        
        return {
          id: doc.id,
          ...data,
          timer
        };
      }).filter(invite => 
        // Mostrar apenas convites relevantes para o usuário
        invite.creator.id === skatista.uid || 
        invite.players.some((p: Player) => p.id === skatista.uid)
      ) as GameInvite[];
      
      setGameInvites(invites);

      // Auto-expirar convites (apenas uma vez por convite)
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

      // Encontrar jogo onde o usuário participa
      const myGame = activeGames.find(game => 
        game.jogadores?.some(p => p.id === skatista.uid)
      );

      setActiveGame(myGame || null);
    });

    return unsubscribe;
  }, [skatista]);

  // ✅ FUNÇÃO OTIMIZADA com cache e useCallback
  const getSkateParksPlayers = useCallback(async (skatePark: string): Promise<Player[]> => {
    try {
      // Verificar cache primeiro
      const cacheKey = skatePark;
      const cached = playersCache.current[cacheKey];
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        console.log('📦 Usando cache para:', skatePark, '- Jogadores:', cached.players.length);
        return cached.players;
      }

      console.log('🔍 Buscando jogadores no skatepark:', skatePark);
      
      const skatistasQuery = query(collection(db, 'Skatistas'));
      const snapshot = await getDocs(skatistasQuery);
      
      const players: Player[] = [];
      
      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        
        // ✅ Verificação mais rigorosa do UID
        if (!data.uid || data.uid === skatista?.uid || data.status !== 'Online') {
          return; // Pular este skatista
        }
        
        // Verificar se tem o skatepark nos spots
        const hasSkatepark = data.spots?.some((spot: any) => {
          const spotPath = spot.path || spot;
          const spotName = typeof spot === 'string' ? spot : spotPath;
          
          // Verificações múltiplas para garantir compatibilidade
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
      
      // ✅ Salvar no cache
      playersCache.current[cacheKey] = {
        players,
        timestamp: now
      };
      
      console.log('✅ Jogadores encontrados:', players.length);
      return players;
    } catch (error) {
      console.error('❌ Erro ao buscar jogadores:', error);
      return [];
    }
  }, [skatista?.uid]);

  // Criar convite com timer de 3 minutos
  const createGameInvite = useCallback(async (skatePark: string, invitedPlayers: Player[]) => {
    if (!skatista) throw new Error('Usuário não autenticado');

    setLoading(true);
    setError(null);

    try {
      console.log('🎮 Criando convite para:', skatePark, 'com', invitedPlayers.length, 'jogadores');
      
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 3 * 60 * 1000); // 3 minutos

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

      // Criar objeto de respostas
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
        timer: 180 // 3 minutos em segundos
      };

      const docRef = await addDoc(collection(db, 'GameInvites'), inviteData);
      
      // ✅ Limpar cache após criar convite
      playersCache.current = {};
      
      console.log('✅ Convite criado com ID:', docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error('❌ Erro ao criar convite:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [skatista]);

  // Responder convite
  const respondToInvite = useCallback(async (inviteId: string, response: 'accepted' | 'declined') => {
    if (!skatista) throw new Error('Usuário não autenticado');

    setLoading(true);
    setError(null);

    try {
      console.log('📝 Respondendo convite:', inviteId, 'com:', response);
      
      const invite = gameInvites.find(inv => inv.id === inviteId);
      if (!invite) throw new Error('Convite não encontrado');

      // Atualizar resposta
      const updatedResponses = {
        ...invite.responses,
        [skatista.uid]: response
      };

      await updateDoc(doc(db, 'GameInvites', inviteId), {
        responses: updatedResponses
      });

      // Verificar se todos aceitaram
      const allResponses = Object.values(updatedResponses);
      const allAccepted = allResponses.every(resp => resp === 'accepted');
      const hasDeclined = allResponses.some(resp => resp === 'declined');

      if (hasDeclined) {
        // Se alguém recusou, cancelar
        await updateDoc(doc(db, 'GameInvites', inviteId), {
          status: 'Cancelado'
        });
        console.log('❌ Convite cancelado - alguém recusou');
      } else if (allAccepted) {
        // Se todos aceitaram, iniciar jogo
        console.log('🚀 Todos aceitaram - iniciando jogo!');
        await startGame(invite);
      }

    } catch (error: any) {
      console.error('❌ Erro ao responder convite:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [skatista, gameInvites]);

  // Iniciar jogo
  const startGame = useCallback(async (invite: GameInvite) => {
    try {
      console.log('🎯 Iniciando jogo com', invite.players.length, 'jogadores');
      
      // Escolher jogador aleatório para começar
      const randomIndex = Math.floor(Math.random() * invite.players.length);
      const firstPlayer = invite.players[randomIndex];

      console.log('🎲 Jogador inicial escolhido:', firstPlayer.name);

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

      // Atualizar status do convite
      await updateDoc(doc(db, 'GameInvites', invite.id), {
        status: 'Em Andamento'
      });

      console.log('✅ Jogo iniciado com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao iniciar jogo:', error);
      throw error;
    }
  }, []);

  // Escolher manobra
  const escolherManobra = useCallback(async (manobra: string) => {
    if (!activeGame || !skatista) return;

    setLoading(true);
    try {
      console.log('🎯 Escolhendo manobra:', manobra);
      
      await updateDoc(doc(db, 'Partidas', activeGame.id), {
        manobraAtual: manobra,
        criadorDaManobra: skatista.uid,
        jogadorExecutando: skatista.uid,
        faseAtual: 'executandoManobra',
        manobrasExecutadas: arrayUnion(manobra),
        turnoTimestamp: Date.now()
      });
      
      console.log('✅ Manobra escolhida com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao escolher manobra:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [activeGame, skatista]);

  // ✅ EXECUTAR MANOBRA CORRIGIDO
  const executarManobra = useCallback(async (resultado: 'acertou' | 'errou') => {
    if (!activeGame || !skatista) return;

    setLoading(true);
    try {
      console.log('🛹 Executando manobra com resultado:', resultado);
      
      if (resultado === 'errou' && activeGame.isFirstRound) {
        // Primeira rodada: se errar, próximo jogador tenta (sem ganhar letra)
        const nextPlayer = getNextPlayer(activeGame.jogadores, activeGame.turnoAtual, activeGame.eliminados);
        
        await updateDoc(doc(db, 'Partidas', activeGame.id), {
          turnoAtual: nextPlayer,
          faseAtual: 'aguardandoManobra',
          manobraAtual: '',
          criadorDaManobra: null,
          jogadorExecutando: '',
          isFirstRound: true
        });
        
        console.log('🔄 Primeira rodada - próximo jogador tenta');
      } else if (resultado === 'acertou') {
        // Acertou: outros jogadores precisam tentar a mesma manobra
        const nextPlayer = getNextPlayer(activeGame.jogadores, activeGame.turnoAtual, activeGame.eliminados);
        
        await updateDoc(doc(db, 'Partidas', activeGame.id), {
          turnoAtual: nextPlayer,
          jogadorExecutando: nextPlayer,
          faseAtual: 'executandoManobra',
          isFirstRound: false
        });
        
        console.log('✅ Acertou - próximo jogador deve tentar a mesma manobra');
      } else {
        // ✅ CORREÇÃO: Quem criou a manobra não pode votar
        const otherPlayers = activeGame.jogadores.filter(p => 
          p.id !== skatista.uid && 
          p.id !== activeGame.criadorDaManobra && // Criador não vota
          !activeGame.eliminados.includes(p.id)
        );

        if (otherPlayers.length === 0) {
          // Se não há outros jogadores para votar, considerar como erro automático
          await processarErro(skatista.uid);
        } else {
          const votacao = {
            jogadorVotando: skatista.uid,
            votos: {},
            votosNecessarios: otherPlayers.length,
            resultado: undefined
          };

          await updateDoc(doc(db, 'Partidas', activeGame.id), {
            faseAtual: 'votacao',
            votacao
          });
          
          console.log('🗳️ Iniciando votação - jogadores que podem votar:', otherPlayers.length);
        }
      }
    } catch (error: any) {
      console.error('❌ Erro ao executar manobra:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [activeGame, skatista]);

  // ✅ VOTAR CORRIGIDO
  const votar = useCallback(async (voto: 'acertou' | 'errou') => {
    if (!activeGame || !skatista || !activeGame.votacao) return;
    
    // Verificar se pode votar (não pode ser criador nem executando)
    if (skatista.uid === activeGame.criadorDaManobra || 
        skatista.uid === activeGame.jogadorExecutando ||
        activeGame.eliminados.includes(skatista.uid)) {
      console.log('❌ Jogador não pode votar');
      return;
    }

    setLoading(true);
    try {
      console.log('🗳️ Votando:', voto);
      
      const novosVotos = {
        ...activeGame.votacao.votos,
        [skatista.uid]: voto
      };

      const votosRecebidos = Object.keys(novosVotos).length;
      const votacao = { ...activeGame.votacao, votos: novosVotos };

      // Verificar se todos votaram
      if (votosRecebidos >= activeGame.votacao.votosNecessarios) {
        const votosErrou = Object.values(novosVotos).filter(v => v === 'errou').length;
        const votosAcertou = Object.values(novosVotos).filter(v => v === 'acertou').length;
        
        const resultado = votosErrou > votosAcertou ? 'errou' : 'acertou';
        votacao.resultado = resultado;

        console.log('📊 Votação finalizada:', { votosErrou, votosAcertou, resultado });

        // Processar resultado
        if (resultado === 'errou') {
          await processarErro(activeGame.jogadorExecutando);
        } else {
          await processarAcerto();
        }
      } else {
        // Ainda aguardando votos
        await updateDoc(doc(db, 'Partidas', activeGame.id), {
          votacao
        });
        
        console.log('⏳ Aguardando mais votos:', votosRecebidos, '/', activeGame.votacao.votosNecessarios);
      }
    } catch (error: any) {
      console.error('❌ Erro ao votar:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [activeGame, skatista]);

  // Função auxiliar para próximo jogador
  const getNextPlayer = (jogadores: Player[], currentPlayer: string, eliminados: string[]): string => {
    const jogadoresAtivos = jogadores.filter(p => !eliminados.includes(p.id));
    const currentIndex = jogadoresAtivos.findIndex(p => p.id === currentPlayer);
    const nextIndex = (currentIndex + 1) % jogadoresAtivos.length;
    return jogadoresAtivos[nextIndex].id;
  };

  // ✅ PROCESSAR ERRO COMPLETO
  const processarErro = async (playerId: string) => {
    if (!activeGame) return;

    try {
      console.log('❌ Processando erro para jogador:', playerId);
      
      const player = activeGame.jogadores.find(p => p.id === playerId);
      if (!player) return;

      const letrasSequence = ['S', 'K', 'A', 'T', 'E'];
      const novasLetras = player.letras + letrasSequence[player.letras.length];
      
      console.log('📝 Adicionando letra:', letrasSequence[player.letras.length], '- Total:', novasLetras);
      
      const jogadoresAtualizados = activeGame.jogadores.map(p => 
        p.id === playerId ? { ...p, letras: novasLetras } : p
      );

      const eliminados = [...activeGame.eliminados];
      if (novasLetras === 'SKATE') {
        eliminados.push(playerId);
        console.log('💀 Jogador eliminado:', player.name);
      }

      // Verificar fim de jogo
      const jogadoresAtivos = jogadoresAtualizados.filter(p => !eliminados.includes(p.id));
      const jogoFinalizado = jogadoresAtivos.length <= 1;
      const vencedor = jogoFinalizado && jogadoresAtivos.length === 1 
        ? jogadoresAtivos[0].name 
        : '';

      if (jogoFinalizado) {
        console.log('🏆 Jogo finalizado! Vencedor:', vencedor);
      }

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

      // Salvar no ranking se terminou
      if (jogoFinalizado) {
        await salvarRanking(jogadoresAtualizados, eliminados, vencedor);
      }

    } catch (error: any) {
      console.error('❌ Erro ao processar erro:', error);
      setError(error.message);
      throw error;
    }
  };

  // ✅ PROCESSAR ACERTO COMPLETO
  const processarAcerto = async () => {
    if (!activeGame) return;

    try {
      console.log('✅ Processando acerto');
      
      const nextPlayer = getNextPlayer(activeGame.jogadores, activeGame.turnoAtual, activeGame.eliminados);
      
      await updateDoc(doc(db, 'Partidas', activeGame.id), {
        turnoAtual: nextPlayer,
        jogadorExecutando: nextPlayer,
        faseAtual: 'executandoManobra',
        votacao: null
      });
      
      console.log('🔄 Próximo jogador deve tentar a manobra');
    } catch (error: any) {
      console.error('❌ Erro ao processar acerto:', error);
      setError(error.message);
      throw error;
    }
  };

  // ✅ SALVAR RANKING COMPLETO
  const salvarRanking = async (jogadores: Player[], eliminados: string[], vencedor: string) => {
    if (!activeGame) return;

    try {
      console.log('🏆 Salvando ranking');
      
      await addDoc(collection(db, 'ranking'), {
        criador: activeGame.criadorDaManobra || 'Sistema',
        data: serverTimestamp(),
        eliminados: eliminados.map(id => 
          jogadores.find(p => p.id === id)?.name || 'Desconhecido'
        ),
        inviteId: activeGame.inviteId,
        skatePark: activeGame.skatePark,
        vencedor
      });
      
      console.log('✅ Ranking salvo com sucesso');
    } catch (error) {
      console.error('❌ Erro ao salvar ranking:', error);
    }
  };

  // ✅ Função para limpar cache manualmente
  const clearPlayersCache = useCallback(() => {
    playersCache.current = {};
    console.log('🧹 Cache de jogadores limpo');
  }, []);

  return {
    gameInvites,
    activeGame,
    loading,
    error,
    getSkateParksPlayers,
    createGameInvite,
    respondToInvite,
    escolherManobra,
    executarManobra,
    votar,
    clearPlayersCache
  };
};