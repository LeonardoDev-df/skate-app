import React, { useState } from 'react';
import { GameMatch } from '../types/game.types';

interface GameFinishedProps {
  game: GameMatch;
  onViewRanking: () => void;
  onNewGame: () => void;
}

export const GameFinished: React.FC<GameFinishedProps> = ({ game, onViewRanking, onNewGame }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Calcular duração formatada
  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return 'Não disponível';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Separar vencedores e perdedores
  const vencedores = game.jogadores.filter(p => !game.eliminados.includes(p.id));
  const perdedores = game.jogadores.filter(p => game.eliminados.includes(p.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-center">
          
          {/* Cabeçalho de Vitória */}
          <div className="text-6xl mb-4 animate-bounce">🏆</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Game of Skate Finalizado!
          </h2>
          
          {/* Vencedor Principal */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-2xl p-6 mb-6">
            <div className="text-4xl mb-2">👑</div>
            <h3 className="text-2xl font-bold text-yellow-400 mb-2">
              VENCEDOR
            </h3>
            <p className="text-xl text-white font-bold">
              {game.vencedor}
            </p>
          </div>

          {/* Estatísticas do Jogo */}
          <div className="bg-white/5 rounded-2xl p-4 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">📊 Estatísticas da Partida</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {(game.manobrasExecutadas || []).length}
                </div>
                <div className="text-white/70 text-sm">Manobras Estabelecidas</div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {formatDuration(game.duracaoJogo)}
                </div>
                <div className="text-white/70 text-sm">Duração</div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-purple-200 text-sm">
                📍 {game.skatePark}
              </p>
            </div>
          </div>

          {/* Resultados dos Jogadores */}
          <div className="bg-white/5 rounded-2xl p-4 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">🎮 Resultado dos Jogadores</h3>
            
            {/* Vencedores */}
            {vencedores.length > 0 && (
              <div className="mb-4">
                <h4 className="text-green-400 font-medium mb-2">✅ Vencedores</h4>
                <div className="space-y-2">
                  {vencedores.map(player => (
                    <div key={player.id} className="flex justify-between items-center p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {player.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white font-medium text-sm">{player.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-green-400 font-bold">
                          {player.letras || '—'}
                        </span>
                        <p className="text-green-300 text-xs">Venceu!</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Perdedores */}
            {perdedores.length > 0 && (
              <div>
                <h4 className="text-red-400 font-medium mb-2">❌ Eliminados</h4>
                <div className="space-y-2">
                  {perdedores.map(player => (
                    <div key={player.id} className="flex justify-between items-center p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {player.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white font-medium text-sm">{player.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-red-400 font-bold text-xl">
                          {player.letras}
                        </span>
                        <p className="text-red-300 text-xs">Eliminado</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Detalhes Expandíveis */}
          <div className="bg-white/5 rounded-2xl p-4 mb-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between text-white hover:text-purple-300 transition-colors"
            >
              <span className="font-medium">🛹 Detalhes das Manobras</span>
              <span className="text-2xl">{showDetails ? '▲' : '▼'}</span>
            </button>
            
            {showDetails && (
              <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                {/* Manobras Estabelecidas */}
                {(game.manobrasExecutadas || []).length > 0 && (
                  <div>
                    <h5 className="text-green-400 font-medium mb-2">✅ Manobras Estabelecidas</h5>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {(game.manobrasExecutadas || []).map((manobra, index) => (
                        <span
                          key={index}
                          className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-xs border border-green-500/30"
                        >
                          #{index + 1} {manobra}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Todas as Tentativas */}
                {(game.manobrasTentadas || []).length > 0 && (
                  <div>
                    <h5 className="text-purple-400 font-medium mb-2">🎯 Todas as Tentativas</h5>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {(game.manobrasTentadas || []).map((manobra, index) => (
                        <span
                          key={index}
                          className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-xs border border-purple-500/30"
                        >
                          {manobra}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {(game.manobrasExecutadas || []).length === 0 && (game.manobrasTentadas || []).length === 0 && (
                  <p className="text-white/50 text-sm text-center">
                    Nenhuma manobra foi executada
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3">
            <button
              onClick={onViewRanking}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:scale-105 transition-transform shadow-lg"
            >
              🏆 Ver Ranking do {game.skatePark}
            </button>
            
            <button
              onClick={onNewGame}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:scale-105 transition-transform shadow-lg"
            >
              🎮 Novo Jogo
            </button>
            
            <button
              onClick={() => window.history.back()}
              className="w-full bg-white/10 border border-white/20 text-white font-medium py-3 px-6 rounded-xl hover:bg-white/20 transition-colors"
            >
              ← Voltar ao Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};