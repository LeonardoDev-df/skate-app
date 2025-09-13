import React, { useState } from 'react';
import { GameRanking as GameRankingType } from '../../types/game.types';

interface GameRankingProps {
  rankings: GameRankingType[];
}

export const GameRanking: React.FC<GameRankingProps> = ({ rankings }) => {
  const [filter, setFilter] = useState<'all' | 'recent' | 'skatePark'>('all');
  const [selectedSkatePark, setSelectedSkatePark] = useState<string>('');

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Data não disponível';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Estatísticas gerais
  const stats = {
    totalGames: rankings.length,
    uniqueWinners: new Set(rankings.map(r => r.vencedor)).size,
    uniqueSkateparks: new Set(rankings.map(r => r.skatePark)).size,
    topWinner: rankings.length > 0 
      ? rankings.reduce((acc, curr) => {
          acc[curr.vencedor] = (acc[curr.vencedor] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      : {}
  };

  const topWinnerName = Object.keys(stats.topWinner).length > 0 
    ? Object.keys(stats.topWinner).reduce((a, b) => 
        stats.topWinner[a] > stats.topWinner[b] ? a : b, ''
      )
    : 'Nenhum';

  // Filtrar rankings
  const filteredRankings = rankings.filter(ranking => {
    if (filter === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const rankingDate = ranking.data?.toDate ? ranking.data.toDate() : new Date(ranking.data);
      return rankingDate >= oneWeekAgo;
    }
    if (filter === 'skatePark' && selectedSkatePark) {
      return ranking.skatePark === selectedSkatePark;
    }
    return true;
  });

  const skateparks = [...new Set(rankings.map(r => r.skatePark))];

  if (rankings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-xl font-bold text-white mb-2">
          Nenhuma partida finalizada ainda
        </h3>
        <p className="text-purple-200">
          Jogue algumas partidas para ver o ranking aparecer aqui
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">📊</span>
          Estatísticas Gerais
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {stats.totalGames}
            </div>
            <div className="text-purple-200 text-sm">Partidas</div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {stats.uniqueWinners}
            </div>
            <div className="text-purple-200 text-sm">Vencedores</div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {stats.uniqueSkateparks}
            </div>
            <div className="text-purple-200 text-sm">Skateparks</div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-lg font-bold text-green-400 truncate">
              👑 {topWinnerName}
            </div>
            <div className="text-purple-200 text-sm">Top Player</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">🔍 Filtros</h3>
        
        <div className="space-y-4">
          {/* Filter Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('recent')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === 'recent'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              Recentes
            </button>
            <button
              onClick={() => setFilter('skatePark')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === 'skatePark'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              Por Skatepark
            </button>
          </div>

          {/* Skatepark Selector */}
          {filter === 'skatePark' && (
            <select
              value={selectedSkatePark}
              onChange={(e) => setSelectedSkatePark(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecione um skatepark</option>
              {skateparks.map(park => (
                <option key={park} value={park} className="bg-slate-800">
                  {park}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Rankings List */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">🏆</span>
          Ranking ({filteredRankings.length} partidas)
        </h3>
        
        {filteredRankings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-purple-200">
              Nenhuma partida encontrada com os filtros selecionados
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRankings.map((ranking, index) => (
              <div
                key={ranking.id}
                className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-r from-orange-600 to-orange-700' :
                    'bg-gradient-to-r from-purple-500 to-blue-500'
                  }`}>
                    <span className="text-white font-bold text-sm">
                      #{index + 1}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xl">🏆</span>
                      <span className="text-white font-bold truncate">
                        {ranking.vencedor}
                      </span>
                      <span className="text-green-400 text-sm">
                        Vencedor
                      </span>
                    </div>
                    
                    <p className="text-purple-200 text-sm mb-2 truncate">
                      📍 {ranking.skatePark}
                    </p>
                    
                    <p className="text-white/70 text-xs mb-2">
                      {formatDate(ranking.data)}
                    </p>

                    {ranking.eliminados && ranking.eliminados.length > 0 && (
                      <div>
                        <p className="text-white/70 text-xs mb-1">
                          Eliminados:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {ranking.eliminados.slice(0, 3).map((eliminado, idx) => (
                            <span
                              key={idx}
                              className="bg-red-500/20 text-red-200 px-2 py-1 rounded text-xs"
                            >
                              {eliminado}
                            </span>
                          ))}
                          {ranking.eliminados.length > 3 && (
                            <span className="text-white/50 text-xs">
                              +{ranking.eliminados.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white/70 text-xs">
                      Criado por
                    </div>
                    <div className="text-white text-sm font-medium truncate max-w-20">
                      {ranking.criador}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};