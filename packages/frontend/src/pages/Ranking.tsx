import React from 'react';
import { Link } from 'react-router-dom';
import { useGameOfSkate } from '../hooks/useGameOfSkate';
import { GameRanking } from '../components/game/GameRanking';

export const Ranking: React.FC = () => {
  const { rankings, loading } = useGameOfSkate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to="/" 
              className="text-white/70 hover:text-white transition-colors flex items-center space-x-2"
            >
              <span>←</span>
              <span>Voltar</span>
            </Link>
            <div className="text-center">
              <div className="text-2xl">🏆</div>
            </div>
            <div className="w-16"></div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Ranking</h1>
            <p className="text-purple-200 text-sm">
              Veja os melhores skatistas de cada skatepark
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/70">Carregando rankings...</p>
          </div>
        )}

        {/* Ranking Component */}
        {!loading && <GameRanking rankings={rankings} />}

        {/* Bottom padding */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};