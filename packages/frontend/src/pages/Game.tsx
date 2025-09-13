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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Faça login para jogar
          </h2>
          <p className="text-purple-200 mb-6">
            Entre na sua conta para desafiar outros skatistas
          </p>
          <Link
            to="/login"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-xl"
          >
            Fazer Login 🚀
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden pt-12 pb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative px-4">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/" className="text-white/70 hover:text-white">
              ← Voltar
            </Link>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Game of Skate
            </h1>
            <p className="text-purple-200">
              Desafie outros skatistas e prove suas habilidades
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-6">
        <div className="flex bg-white/10 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab('game')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'game'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            🎮 Jogo
          </button>
          <button
            onClick={() => setActiveTab('invites')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all relative ${
              activeTab === 'invites'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            📨 Convites
            {gameInvites.filter(inv => inv.status === 'Aguardando').length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {gameInvites.filter(inv => inv.status === 'Aguardando').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'ranking'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            🏆 Ranking
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {activeTab === 'game' && (
          <div>
            {activeGame ? (
              <ActiveGame game={activeGame} />
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛹</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Nenhum jogo ativo
                </h3>
                <p className="text-purple-200 mb-8">
                  Crie um novo jogo ou aceite um convite para começar
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all duration-200"
                  >
                    🎮 Criar Novo Jogo
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('invites')}
                    className="w-full bg-white/10 border border-white/20 text-white font-medium py-4 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    📨 Ver Convites ({gameInvites.filter(inv => inv.status === 'Aguardando').length})
                  </button>
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