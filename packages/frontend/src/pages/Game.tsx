import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGameOfSkate } from '../hooks/useGameOfSkate';
import { GameInvites } from '../components/game/GameInvites';
import { ActiveGame } from '../components/game/ActiveGame';
import { CreateGameModal } from '../components/game/CreateGameModal';
import { GameRanking } from '../components/game/GameRanking';

export const Game: React.FC = () => {
  const { skatista } = useAuth();
  const { gameInvites, activeGame, rankings, loading } = useGameOfSkate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'game' | 'invites' | 'ranking'>('game');

  if (!skatista) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Faça login para jogar
          </h2>
          <p className="text-purple-200 mb-6">
            Entre na sua conta para desafiar outros skatistas
          </p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform"
          >
            Fazer Login 🚀
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Header Mobile */}
      <div className="relative overflow-hidden pt-12 pb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-md mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to="/" 
              className="text-white/70 hover:text-white transition-colors flex items-center space-x-2"
            >
              <span>←</span>
              <span>Voltar</span>
            </Link>
            
            {/* Status do Usuário */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {skatista.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-medium truncate max-w-20">
                  {skatista.name}
                </p>
                <p className="text-green-400 text-xs">Online</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-5xl mb-3">🎮</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Game of Skate
            </h1>
            <p className="text-purple-200 text-sm">
              Desafie outros skatistas e prove suas habilidades
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Mobile */}
      <div className="max-w-md mx-auto px-4 mb-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1">
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setActiveTab('game')}
              className={`py-3 px-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'game'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <div className="text-lg mb-1">🎮</div>
              <div>Jogo</div>
            </button>
            
            <button
              onClick={() => setActiveTab('invites')}
              className={`py-3 px-2 rounded-xl text-xs font-medium transition-all relative ${
                activeTab === 'invites'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <div className="text-lg mb-1">📨</div>
              <div>Convites</div>
              {gameInvites.filter(inv => inv.status === 'Aguardando').length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {gameInvites.filter(inv => inv.status === 'Aguardando').length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('ranking')}
              className={`py-3 px-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'ranking'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <div className="text-lg mb-1">🏆</div>
              <div>Ranking</div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto">
        {activeTab === 'game' && (
          <div>
            {activeGame ? (
              <ActiveGame 
                game={activeGame} 
                onViewRanking={() => setActiveTab('ranking')}
              />
            ) : (
              <div className="px-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-6xl mb-4">🛹</div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Nenhum jogo ativo
                  </h3>
                  <p className="text-purple-200 mb-6 text-sm">
                    Crie um novo jogo ou aceite um convite para começar
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all duration-200"
                    >
                      🎮 Criar Novo Jogo
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('invites')}
                      className="w-full bg-white/10 border border-white/20 text-white font-medium py-4 rounded-xl hover:bg-white/20 transition-colors relative"
                    >
                      📨 Ver Convites
                      {gameInvites.filter(inv => inv.status === 'Aguardando').length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                          {gameInvites.filter(inv => inv.status === 'Aguardando').length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Estatísticas Rápidas */}
                <div className="mt-4 grid grid-cols-2 gap-3 px-4">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-blue-400">
                      {rankings.length}
                    </div>
                    <div className="text-white/70 text-xs">Partidas Jogadas</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-green-400">
                      {gameInvites.filter(inv => inv.status === 'Aguardando').length}
                    </div>
                    <div className="text-white/70 text-xs">Convites Ativos</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'invites' && (
          <GameInvites invites={gameInvites} />
        )}

        {activeTab === 'ranking' && (
          <GameRanking rankings={rankings} />
        )}
      </div>

      {/* Create Game Modal */}
      {showCreateModal && (
        <CreateGameModal
          onClose={() => setShowCreateModal(false)}
          onGameCreated={() => {
            setShowCreateModal(false);
            setActiveTab('invites');
          }}
        />
      )}

      {/* Bottom Navigation Space */}
      <div className="h-20"></div>
    </div>
  );
};