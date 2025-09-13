import React, { useState, useMemo } from 'react';
import { GameRanking as GameRankingType } from '../../types/game.types';

interface GameRankingProps {
  rankings: GameRankingType[];
}

interface PlayerStats {
  name: string;
  wins: number;
  totalGames: number;
  winRate: number;
  lastWin?: Date;
  skateparks: string[];
}

export const GameRanking: React.FC<GameRankingProps> = ({ rankings }) => {
  const [filter, setFilter] = useState<'all' | 'recent' | 'skatePark'>('all');
  const [selectedSkatePark, setSelectedSkatePark] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'players' | 'matches'>('players');
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  // Função para formatar data
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

  // Função para formatar duração
  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return 'N/A';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Calcular estatísticas dos jogadores
  const playerStats = useMemo(() => {
    const stats: Record<string, PlayerStats> = {};
    
    rankings.forEach(ranking => {
      const winner = ranking.vencedor;
      
      // Inicializar stats do vencedor
      if (!stats[winner]) {
        stats[winner] = {
          name: winner,
          wins: 0,
          totalGames: 0,
          winRate: 0,
          skateparks: []
        };
      }
      
      // Contar vitória
      stats[winner].wins += 1;
      stats[winner].totalGames += 1;
      
      // Atualizar última vitória
      const gameDate = ranking.data?.toDate ? ranking.data.toDate() : new Date(ranking.data);
      if (!stats[winner].lastWin || gameDate > stats[winner].lastWin) {
        stats[winner].lastWin = gameDate;
      }
      
      // Adicionar skatepark se não existir
      if (!stats[winner].skateparks.includes(ranking.skatePark)) {
        stats[winner].skateparks.push(ranking.skatePark);
      }
      
      // Contar participações de todos os jogadores
      if (ranking.jogadores) {
        ranking.jogadores.forEach(player => {
          if (player.name !== winner) {
            if (!stats[player.name]) {
              stats[player.name] = {
                name: player.name,
                wins: 0,
                totalGames: 0,
                winRate: 0,
                skateparks: []
              };
            }
            stats[player.name].totalGames += 1;
            
            if (!stats[player.name].skateparks.includes(ranking.skatePark)) {
              stats[player.name].skateparks.push(ranking.skatePark);
            }
          }
        });
      }
    });
    
    // Calcular win rate
    Object.values(stats).forEach(player => {
      player.winRate = player.totalGames > 0 ? (player.wins / player.totalGames) * 100 : 0;
    });
    
    // Ordenar por vitórias (depois por win rate)
    return Object.values(stats).sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.winRate - a.winRate;
    });
  }, [rankings]);

  // Filtrar rankings
  const filteredRankings = useMemo(() => {
    let filtered = [...rankings];
    
    if (filter === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(ranking => {
        const rankingDate = ranking.data?.toDate ? ranking.data.toDate() : new Date(ranking.data);
        return rankingDate >= oneWeekAgo;
      });
    }
    
    if (filter === 'skatePark' && selectedSkatePark) {
      filtered = filtered.filter(ranking => ranking.skatePark === selectedSkatePark);
    }
    
    // Ordenar por data (mais recente primeiro)
    return filtered.sort((a, b) => {
      const dateA = a.data?.toDate ? a.data.toDate() : new Date(a.data);
      const dateB = b.data?.toDate ? b.data.toDate() : new Date(b.data);
      return dateB.getTime() - dateA.getTime();
    });
  }, [rankings, filter, selectedSkatePark]);

  const skateparks = [...new Set(rankings.map(r => r.skatePark))];

  if (rankings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-md mx-auto text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Nenhuma partida finalizada ainda
          </h3>
          <p className="text-purple-200">
            Jogue algumas partidas para ver o ranking aparecer aqui
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-md mx-auto p-4 space-y-4">
        
        {/* Header */}
        <div className="text-center py-6">
          <div className="text-4xl mb-2">🏆</div>
          <h1 className="text-2xl font-bold text-white mb-2">Ranking</h1>
          <p className="text-purple-200 text-sm">
            {rankings.length} partidas • {playerStats.length} jogadores
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 mb-4">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setActiveTab('players')}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'players'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              👑 Jogadores
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'matches'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              🎮 Partidas
            </button>
          </div>
        </div>

        {/* Filtros para Partidas */}
        {activeTab === 'matches' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <h3 className="text-white font-medium mb-3 text-sm">🔍 Filtros</h3>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => setFilter('all')}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-white/70'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('recent')}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  filter === 'recent'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-white/70'
                }`}
              >
                Recentes
              </button>
              <button
                onClick={() => setFilter('skatePark')}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  filter === 'skatePark'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-white/70'
                }`}
              >
                Skatepark
              </button>
            </div>

            {filter === 'skatePark' && (
              <select
                value={selectedSkatePark}
                onChange={(e) => setSelectedSkatePark(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="" className="bg-slate-800">Todos os skateparks</option>
                {skateparks.map(park => (
                  <option key={park} value={park} className="bg-slate-800">
                    {park}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Conteúdo das Tabs */}
        {activeTab === 'players' ? (
          /* Ranking de Jogadores */
          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <h3 className="text-white font-medium mb-3 text-sm flex items-center">
                👑 Top Jogadores
                <span className="ml-auto text-xs text-white/70">
                  {playerStats.length} jogadores
                </span>
              </h3>
              
              {playerStats.map((player, index) => (
                <div
                  key={player.name}
                  className="flex items-center space-x-3 p-3 rounded-xl mb-2 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  {/* Posição */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-r from-orange-600 to-orange-700' :
                    'bg-gradient-to-r from-purple-500 to-blue-500'
                  }`}>
                    <span className="text-white font-bold text-xs">
                      {index + 1}
                    </span>
                  </div>
                  
                  {/* Info do Jogador */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-white font-medium text-sm truncate">
                        {player.name}
                      </p>
                      {index === 0 && <span className="text-yellow-400">👑</span>}
                    </div>
                    
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-green-400 text-xs font-medium">
                        {player.wins} vitórias
                      </span>
                      <span className="text-white/70 text-xs">
                        {player.totalGames} jogos
                      </span>
                      <span className="text-blue-400 text-xs">
                        {player.winRate.toFixed(0)}%  de Vitória
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-purple-300 text-xs">
                        🛹 {player.skateparks.length} skateparks
                      </span>
                      {player.lastWin && (
                        <span className="text-white/50 text-xs">
                          Última: {player.lastWin.toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Estatísticas */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">
                      {player.wins}
                    </div>
                    <div className="text-xs text-white/70">
                      vitórias
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Lista de Partidas */
          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <h3 className="text-white font-medium mb-3 text-sm flex items-center">
                🎮 Histórico de Partidas
                <span className="ml-auto text-xs text-white/70">
                  {filteredRankings.length} partidas
                </span>
              </h3>
              
              {filteredRankings.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-purple-200 text-sm">
                    Nenhuma partida encontrada com os filtros selecionados
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRankings.map((ranking, index) => (
                    <div
                      key={ranking.id}
                      className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors"
                    >
                      {/* Header da Partida */}
                      <div 
                        className="p-4 cursor-pointer"
                        onClick={() => setExpandedMatch(
                          expandedMatch === ranking.id ? null : ranking.id
                        )}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Ícone de Posição */}
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xs">
                              #{index + 1}
                            </span>
                          </div>
                          
                          {/* Info Principal */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-yellow-400">🏆</span>
                              <span className="text-white font-bold text-sm truncate">
                                {ranking.vencedor}
                              </span>
                              <span className="text-green-400 text-xs">Venceu</span>
                            </div>
                            
                            <p className="text-purple-200 text-xs mb-1 truncate">
                              📍 {ranking.skatePark}
                            </p>
                            
                            <div className="flex items-center space-x-3 text-xs text-white/70">
                              <span>📅 {formatDate(ranking.data)}</span>
                              {ranking.duracaoJogo && (
                                <span>⏱️ {formatDuration(ranking.duracaoJogo)}</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Expand Icon */}
                          <div className="text-white/50">
                            {expandedMatch === ranking.id ? '▲' : '▼'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Detalhes Expandidos */}
                      {expandedMatch === ranking.id && (
                        <div className="border-t border-white/10 p-4 space-y-4">
                          {/* Participantes */}
                          {ranking.jogadores && ranking.jogadores.length > 0 && (
                            <div>
                              <h5 className="text-white font-medium text-xs mb-2">👥 Participantes</h5>
                              <div className="space-y-2">
                                {ranking.jogadores.map((player, idx) => (
                                  <div 
                                    key={idx}
                                    className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                        player.name === ranking.vencedor 
                                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                                          : player.eliminado 
                                          ? 'bg-gradient-to-r from-red-500 to-pink-500'
                                          : 'bg-gradient-to-r from-green-500 to-emerald-500'
                                      }`}>
                                        <span className="text-white text-xs font-bold">
                                          {player.name.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                      <span className="text-white text-sm">{player.name}</span>
                                      {player.name === ranking.vencedor && (
                                        <span className="text-yellow-400">👑</span>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <span className={`text-sm font-bold ${
                                        player.eliminado ? 'text-red-400' : 'text-green-400'
                                      }`}>
                                        {player.letras || '—'}
                                      </span>
                                      <p className="text-xs text-white/70">
                                        {player.eliminado ? 'Eliminado' : 'Venceu'}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Manobras */}
                          {ranking.manobrasExecutadas && ranking.manobrasExecutadas.length > 0 && (
                            <div>
                              <h5 className="text-white font-medium text-xs mb-2">
                                🛹 Manobras Estabelecidas ({ranking.manobrasExecutadas.length})
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {ranking.manobrasExecutadas.map((manobra, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-green-500/20 text-green-200 px-2 py-1 rounded text-xs border border-green-500/30"
                                  >
                                    {manobra}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Estatísticas da Partida */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-lg p-3 text-center">
                              <div className="text-lg font-bold text-blue-400">
                                {(ranking.manobrasExecutadas || []).length}
                              </div>
                              <div className="text-xs text-white/70">Manobras</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3 text-center">
                              <div className="text-lg font-bold text-green-400">
                                {formatDuration(ranking.duracaoJogo)}
                              </div>
                              <div className="text-xs text-white/70">Duração</div>
                            </div>
                          </div>
                          
                          {/* Criador */}
                          <div className="text-center">
                            <p className="text-white/50 text-xs">
                              Criado por: <span className="text-white">{ranking.criador}</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
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