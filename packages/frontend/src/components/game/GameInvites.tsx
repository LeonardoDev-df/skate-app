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
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📨</div>
        <h3 className="text-xl font-bold text-white mb-2">
          Nenhum convite ainda
        </h3>
        <p className="text-purple-200">
          Crie um jogo ou aguarde convites de outros skatistas
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">⏰</span>
            Convites Ativos ({pendingInvites.length})
          </h3>
          
          <div className="space-y-4">
            {pendingInvites.map(invite => {
              const timeLeft = timers[invite.id] || 0;
              const isExpired = timeLeft <= 0;
              const myResponse = invite.responses[skatista?.uid || ''];
              const responseStatus = getResponseStatus(invite);
              const isCreator = invite.creator.id === skatista?.uid;
              
              return (
                <div
                  key={invite.id}
                  className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border ${
                    isExpired 
                      ? 'border-red-500/30 opacity-75' 
                      : timeLeft <= 60 
                      ? 'border-orange-500/50 animate-pulse' 
                      : 'border-green-500/30'
                  }`}
                >
                  {/* Timer */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {isExpired ? '⏰' : timeLeft <= 60 ? '🔥' : '⏳'}
                      </span>
                      <div>
                        <p className="text-white font-bold">
                          {isCreator ? 'Seu convite' : `${invite.creator.name} te desafiou!`}
                        </p>
                        <p className="text-sm text-purple-200">
                          📍 {invite.skatePark}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        isExpired 
                          ? 'text-red-400' 
                          : timeLeft <= 60 
                          ? 'text-orange-400' 
                          : 'text-green-400'
                      }`}>
                        {isExpired ? 'EXPIRADO' : formatTimer(timeLeft)}
                      </div>
                      <p className="text-xs text-white/70">
                        {isExpired ? 'Convite expirou' : 'Tempo restante'}
                      </p>
                    </div>
                  </div>

                  {/* Players Status */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-white/70">Status dos jogadores:</span>
                      <span className="text-white">
                        {responseStatus.accepted}/{responseStatus.total} confirmados
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {invite.players.map(player => {
                        const playerResponse = invite.responses[player.id];
                        return (
                          <div
                            key={player.id}
                            className={`flex items-center space-x-2 p-2 rounded-lg text-sm ${
                              playerResponse === 'accepted' 
                                ? 'bg-green-500/20 text-green-200'
                                : playerResponse === 'declined'
                                ? 'bg-red-500/20 text-red-200'
                                : 'bg-white/10 text-white/70'
                            }`}
                          >
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {player.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="flex-1 truncate">{player.name}</span>
                            <span className="text-xs">
                              {playerResponse === 'accepted' ? '✅' : 
                               playerResponse === 'declined' ? '❌' : '⏳'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!isCreator && !isExpired && myResponse === 'pending' && (
                    <div className="space-y-3">
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
                        <p className="text-blue-200 text-sm text-center">
                          🎮 Você foi desafiado para um Game of Skate!
                        </p>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleRespond(invite.id, 'accepted')}
                          disabled={loading}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 active:scale-95 transition-all duration-200"
                        >
                          ✅ Aceitar Desafio
                        </button>
                        
                        <button
                          onClick={() => handleRespond(invite.id, 'declined')}
                          disabled={loading}
                          className="flex-1 bg-red-500/20 border border-red-500/50 text-red-200 font-medium py-3 rounded-xl hover:bg-red-500/30 transition-colors disabled:opacity-50"
                        >
                          ❌ Recusar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status Messages */}
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
        </div>
      )}

      {/* Historical Invites */}
      {otherInvites.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">📋</span>
            Histórico de Convites
          </h3>
          
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
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">
                        {invite.creator.name} - {invite.skatePark}
                      </p>
                      <p className="text-white/70 text-sm">
                        {formatDate(invite.createdAt)} • {invite.players.length} jogadores
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        invite.status === 'Em Andamento' 
                          ? 'bg-green-500/20 text-green-200 border border-green-500/50'
                          : invite.status === 'Finalizado'
                          ? 'bg-blue-500/20 text-blue-200 border border-blue-500/50'
                          : invite.status === 'Expirado'
                          ? 'bg-orange-500/20 text-orange-200 border border-orange-500/50'
                          : 'bg-red-500/20 text-red-200 border border-red-500/50'
                      }`}>
                        {invite.status === 'Em Andamento' ? '🎮 Jogando' :
                         invite.status === 'Finalizado' ? '✅ Finalizado' :
                         invite.status === 'Expirado' ? '⏰ Expirado' : '❌ Cancelado'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};