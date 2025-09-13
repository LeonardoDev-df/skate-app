import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGameOfSkate } from '../../hooks/useGameOfSkate';
import { GameInvite } from '../../types/game.types';

interface GameInvitesProps {
  invites: GameInvite[];
}

export const GameInvites: React.FC<GameInvitesProps> = ({ invites }) => {
  const { skatista } = useAuth();
  const { respondToInvite, loading } = useGameOfSkate();
  const [timers, setTimers] = useState<Record<string, number>>({});

  // Atualizar timers a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers: Record<string, number> = {};
      
      invites.forEach(invite => {
        if (invite.status === 'Aguardando' && invite.expiresAt) {
          const now = new Date();
          const expiresAt = invite.expiresAt.toDate ? invite.expiresAt.toDate() : new Date(invite.expiresAt);
          const timeLeft = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
          newTimers[invite.id] = timeLeft;
        }
      });
      
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [invites]);

  const formatTimer = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRespond = async (inviteId: string, response: 'accepted' | 'declined') => {
    try {
      await respondToInvite(inviteId, response);
    } catch (error) {
      console.error('Erro ao responder convite:', error);
    }
  };

  const getResponseStatus = (invite: GameInvite) => {
    const responses = Object.entries(invite.responses);
    const accepted = responses.filter(([_, resp]) => resp === 'accepted').length;
    const declined = responses.filter(([_, resp]) => resp === 'declined').length;
    const pending = responses.filter(([_, resp]) => resp === 'pending').length;
    
    return { accepted, declined, pending, total: responses.length };
  };

  const pendingInvites = invites.filter(invite => invite.status === 'Aguardando');
  const otherInvites = invites.filter(invite => invite.status !== 'Aguardando');

  if (invites.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-md mx-auto p-4">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📨</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Nenhum convite ainda
            </h3>
            <p className="text-purple-200">
              Crie um jogo ou aguarde convites de outros skatistas
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-md mx-auto p-4 space-y-4">
        
        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <span className="text-2xl mr-2">⏰</span>
                Convites Ativos
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {pendingInvites.length}
                </span>
              </h3>
            </div>
            
            {pendingInvites.map(invite => {
              const timeLeft = timers[invite.id] || 0;
              const isExpired = timeLeft <= 0;
              const myResponse = invite.responses[skatista?.uid || ''];
              const responseStatus = getResponseStatus(invite);
              const isCreator = invite.creator.id === skatista?.uid;
              
              return (
                <div
                  key={invite.id}
                  className={`bg-white/10 backdrop-blur-sm rounded-2xl p-4 border ${
                    isExpired 
                      ? 'border-red-500/30 opacity-75' 
                      : timeLeft <= 60 
                      ? 'border-orange-500/50 animate-pulse' 
                      : 'border-green-500/30'
                  }`}
                >
                  {/* Header do Convite */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="text-3xl flex-shrink-0">
                        {isExpired ? '⏰' : timeLeft <= 60 ? '🔥' : '⏳'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">
                          {isCreator ? 'Seu convite' : `${invite.creator.name} te desafiou!`}
                        </p>
                        <p className="text-xs text-purple-200 truncate">
                          📍 {invite.skatePark}
                        </p>
                        <p className="text-xs text-white/70 mt-1">
                          {invite.players.length} jogadores
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <div className={`text-lg font-bold ${
                        isExpired 
                          ? 'text-red-400' 
                          : timeLeft <= 60 
                          ? 'text-orange-400' 
                          : 'text-green-400'
                      }`}>
                        {isExpired ? 'EXPIRADO' : formatTimer(timeLeft)}
                      </div>
                      <p className="text-xs text-white/70">
                        {isExpired ? 'Convite expirou' : 'Restante'}
                      </p>
                    </div>
                  </div>

                  {/* Status dos Jogadores */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-white/70">Status dos jogadores:</span>
                      <span className="text-white font-medium">
                        {responseStatus.accepted}/{responseStatus.total} confirmados
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {invite.players.map(player => {
                        const playerResponse = invite.responses[player.id];
                        return (
                          <div
                            key={player.id}
                            className={`flex items-center space-x-3 p-3 rounded-xl text-sm ${
                              playerResponse === 'accepted' 
                                ? 'bg-green-500/20 border border-green-500/30'
                                : playerResponse === 'declined'
                                ? 'bg-red-500/20 border border-red-500/30'
                                : 'bg-white/10 border border-white/20'
                            }`}
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">
                                {player.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="flex-1 truncate text-white font-medium">
                              {player.name}
                            </span>
                            <div className="flex items-center space-x-1">
                              <span className="text-lg">
                                {playerResponse === 'accepted' ? '✅' : 
                                 playerResponse === 'declined' ? '❌' : '⏳'}
                              </span>
                              <span className={`text-xs font-medium ${
                                playerResponse === 'accepted' ? 'text-green-300' :
                                playerResponse === 'declined' ? 'text-red-300' :
                                'text-white/70'
                              }`}>
                                {playerResponse === 'accepted' ? 'Aceitou' :
                                 playerResponse === 'declined' ? 'Recusou' : 'Aguardando'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  {!isCreator && !isExpired && myResponse === 'pending' && (
                    <div className="space-y-3">
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
                        <p className="text-blue-200 text-sm text-center">
                          🎮 Você foi desafiado para um Game of Skate!
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleRespond(invite.id, 'accepted')}
                          disabled={loading}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-4 rounded-xl disabled:opacity-50 active:scale-95 transition-all duration-200 text-sm"
                        >
                          ✅ Aceitar
                        </button>
                        
                        <button
                          onClick={() => handleRespond(invite.id, 'declined')}
                          disabled={loading}
                          className="bg-red-500/20 border border-red-500/50 text-red-200 font-medium py-3 px-4 rounded-xl hover:bg-red-500/30 transition-colors disabled:opacity-50 text-sm"
                        >
                          ❌ Recusar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mensagens de Status */}
                  {isCreator && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
                      <p className="text-blue-200 text-sm text-center">
                        ⏳ Aguardando {responseStatus.pending} jogador(es) responderem
                      </p>
                    </div>
                  )}

                  {!isCreator && myResponse === 'accepted' && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                      <p className="text-green-200 text-sm text-center">
                        ✅ Você aceitou! Aguardando outros jogadores...
                      </p>
                    </div>
                  )}

                  {!isCreator && myResponse === 'declined' && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                      <p className="text-red-200 text-sm text-center">
                        ❌ Você recusou este convite
                      </p>
                    </div>
                  )}

                  {isExpired && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                      <p className="text-red-200 text-sm text-center">
                        ⏰ Convite expirou - Tempo limite de 3 minutos excedido
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Histórico de Convites */}
        {otherInvites.length > 0 && (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <span className="text-2xl mr-2">📋</span>
                Histórico
                <span className="ml-auto text-white/70 text-sm">
                  {otherInvites.length} convites
                </span>
              </h3>
            </div>
            
            <div className="space-y-3">
              {otherInvites.slice(0, 10).map(invite => {
                const formatDate = (timestamp: any) => {
                  try {
                    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
                    return date.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                  } catch {
                    return 'Data inválida';
                  }
                };

                return (
                  <div
                    key={invite.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                              {invite.creator.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <p className="text-white font-medium text-sm truncate">
                            {invite.creator.name}
                          </p>
                        </div>
                        
                        <p className="text-purple-200 text-xs mb-1 truncate">
                          📍 {invite.skatePark}
                        </p>
                        
                        <div className="flex items-center space-x-3 text-xs text-white/70">
                          <span>📅 {formatDate(invite.createdAt)}</span>
                          <span>👥 {invite.players.length} jogadores</span>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 ml-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invite.status === 'Em Andamento' 
                            ? 'bg-green-500/20 text-green-200 border border-green-500/50'
                            : invite.status === 'Finalizado'
                            ? 'bg-blue-500/20 text-blue-200 border border-blue-500/50'
                            : invite.status === 'Expirado'
                            ? 'bg-orange-500/20 text-orange-200 border border-orange-500/50'
                            : 'bg-red-500/20 text-red-200 border border-red-500/50'
                        }`}>
                          {invite.status === 'Em Andamento' ? '🎮' :
                           invite.status === 'Finalizado' ? '✅' :
                           invite.status === 'Expirado' ? '⏰' : '❌'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {otherInvites.length > 10 && (
                <div className="text-center py-2">
                  <p className="text-white/50 text-sm">
                    +{otherInvites.length - 10} convites mais antigos
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom padding */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};