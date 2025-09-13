import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGameOfSkate } from '../../hooks/useGameOfSkate';
import { useGameMusic } from '../../hooks/useGameMusic';
import { GameMatch } from '../../types/game.types';

interface ActiveGameProps {
  game: GameMatch;
}

// Manobras organizadas por dificuldade
const MANOBRAS = {
  'Iniciante': [
    { name: 'Ollie', description: 'O pulo básico com o skate' },
    { name: 'Frontside 180', description: 'O skate e o skatista giram 180° para frente' },
    { name: 'Backside 180', description: 'O skate e o skatista giram 180° para trás' },
    { name: 'Pop Shove-it', description: 'O skate gira 180° sob seus pés' },
    { name: 'Frontside Pop Shove-it', description: 'O skate gira 180° para frente sob seus pés' },
    { name: 'Heelflip', description: 'O skate gira no ar com a ajuda do seu calcanhar' },
    { name: 'Kickflip', description: 'O skate gira no ar com a ajuda da ponta do seu pé' }
  ],
  'Intermediário': [
    { name: 'Varial Kickflip', description: 'Uma mistura de Pop Shove-it e Kickflip' },
    { name: 'Varial Heelflip', description: 'Uma mistura de Pop Shove-it e Heelflip' },
    { name: 'Fakie Bigspin', description: 'Um Backside 180 com a prancha girando 360°, feito de fakie' },
    { name: 'Nollie', description: 'Um ollie feito na posição nollie' },
    { name: 'Switch Ollie', description: 'Um ollie feito na posição switch' },
    { name: 'Hardflip', description: 'Um frontside pop shove-it com um kickflip' },
    { name: 'Inward Heelflip', description: 'Um backside pop shove-it com um heelflip' }
  ],
  'Avançado': [
    { name: '360 Shove-it', description: 'O skate gira 360° sob seus pés' },
    { name: '360 Flip (Tre-flip)', description: 'O skate gira 360° em um eixo horizontal e 360° em um eixo vertical' },
    { name: 'Laser Flip', description: 'Uma mistura de 360° Pop Shove-it e Heelflip' },
    { name: 'Double Kickflip', description: 'O skate faz duas voltas completas no ar' },
    { name: 'Nollie 360 Shove-it', description: 'Um 360° Pop Shove-it feito na posição nollie' },
    { name: 'Switch 360 Flip', description: 'A manobra mais icônica, feita na posição switch' }
  ]
};

const ALL_MANOBRAS = [
  ...MANOBRAS.Iniciante,
  ...MANOBRAS.Intermediário,
  ...MANOBRAS.Avançado
];

export const ActiveGame: React.FC<ActiveGameProps> = ({ game }) => {
  const { skatista } = useAuth();
  const { escolherManobra, executarManobra, votar, loading } = useGameOfSkate();
  const { isPlaying, currentTrack, tracks, isMuted, play, pause, nextTrack, toggleMute } = useGameMusic({ 
    volume: 0.2, 
    autoPlay: true 
  });
  
  const [selectedManobra, setSelectedManobra] = useState('');
  const [showManobrasList, setShowManobrasList] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Iniciante');

  if (!skatista) return null;

  const isMyTurn = game.turnoAtual === skatista.uid;
  const isExecuting = game.jogadorExecutando === skatista.uid;
  const isCreator = game.criadorDaManobra === skatista.uid;
  const currentPlayer = game.jogadores.find(p => p.id === game.turnoAtual);
  const executingPlayer = game.jogadores.find(p => p.id === game.jogadorExecutando);
  const creatorPlayer = game.jogadores.find(p => p.id === game.criadorDaManobra);
  const jogadoresAtivos = game.jogadores.filter(p => !game.eliminados.includes(p.id));
  
  // ✅ CORREÇÃO: Verificar quem pode votar (não pode ser criador nem executando)
  const canVote = game.votacao && 
                  !game.votacao.votos[skatista.uid] && 
                  skatista.uid !== game.jogadorExecutando &&
                  skatista.uid !== game.criadorDaManobra &&
                  !game.eliminados.includes(skatista.uid);

  const manobrasDisponiveis = ALL_MANOBRAS.filter(m => !game.manobrasExecutadas.includes(m.name));

  const handleEscolherManobra = async () => {
    if (!selectedManobra) return;
    await escolherManobra(selectedManobra);
    setSelectedManobra('');
    setShowManobrasList(false);
  };

  const handleExecutarManobra = async (resultado: 'acertou' | 'errou') => {
    await executarManobra(resultado);
  };

  const handleVotar = async (voto: 'acertou' | 'errou') => {
    await votar(voto);
  };

  // Jogo finalizado
  if (game.jogoFinalizado) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Jogo Finalizado!
            </h2>
            <p className="text-xl text-green-400 mb-6">
              🎉 Vencedor: {game.vencedor}
            </p>
            
            {/* Resultado Final */}
            <div className="bg-white/5 rounded-2xl p-4 mb-6">
              <h3 className="text-lg font-bold text-white mb-3">📊 Resultado Final</h3>
              <div className="space-y-3">
                {game.jogadores.map(player => (
                  <div key={player.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {player.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white font-medium text-sm">{player.name}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xl font-bold ${
                        game.eliminados.includes(player.id) ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {player.letras || (game.vencedor === player.name ? '👑' : '—')}
                      </span>
                      <p className="text-xs text-white/70">
                        {game.eliminados.includes(player.id) ? 'Eliminado' : 
                         game.vencedor === player.name ? 'Vencedor' : 'Participou'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manobras executadas */}
            {game.manobrasExecutadas.length > 0 && (
              <div className="bg-white/5 rounded-2xl p-4 mb-6">
                <h3 className="text-lg font-bold text-white mb-3">🛹 Manobras do Jogo</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {game.manobrasExecutadas.map((manobra, index) => (
                    <span
                      key={index}
                      className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full text-xs"
                    >
                      {manobra}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-xl"
            >
              Novo Jogo 🎮
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-md mx-auto p-4 space-y-4">
        
        {/* Music Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                🎵 {tracks[currentTrack]?.name || 'Sem música'}
              </p>
              <p className="text-white/70 text-xs truncate">
                {tracks[currentTrack]?.artist}
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={isPlaying ? pause : play}
                className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button
                onClick={nextTrack}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white"
              >
                ⏭️
              </button>
              <button
                onClick={toggleMute}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white"
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
            </div>
          </div>
        </div>

        {/* Game Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-white mb-2">
              📍 {game.skatePark}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className={`px-2 py-1 rounded-full ${
                game.faseAtual === 'aguardandoManobra' ? 'bg-blue-500/20 text-blue-200' :
                game.faseAtual === 'executandoManobra' ? 'bg-orange-500/20 text-orange-200' :
                game.faseAtual === 'votacao' ? 'bg-purple-500/20 text-purple-200' :
                'bg-green-500/20 text-green-200'
              }`}>
                {game.faseAtual === 'aguardandoManobra' ? '🎯 Escolhendo' :
                 game.faseAtual === 'executandoManobra' ? '🛹 Executando' :
                 game.faseAtual === 'votacao' ? '🗳️ Votação' : '✅ Finalizado'}
              </span>
              {game.isFirstRound && (
                <span className="px-2 py-1 bg-green-500/20 text-green-200 rounded-full">
                  🆕 Primeira Rodada
                </span>
              )}
            </div>
          </div>

          {game.manobraAtual && (
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-white/70 text-xs mb-1">Manobra Atual:</p>
              <p className="text-lg font-bold text-white">{game.manobraAtual}</p>
              {creatorPlayer && (
                <p className="text-purple-200 text-xs mt-1">
                  Por: {creatorPlayer.name}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Players Status */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="text-lg font-bold text-white mb-3">👥 Jogadores</h3>
          <div className="space-y-2">
            {game.jogadores.map(player => {
              const isEliminated = game.eliminados.includes(player.id);
              const isCurrentTurn = game.turnoAtual === player.id;
              const isExecutingNow = game.jogadorExecutando === player.id;
              
              return (
                <div
                  key={player.id}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                    isCurrentTurn ? 'bg-blue-500/20 border border-blue-500/50' :
                    isExecutingNow ? 'bg-orange-500/20 border border-orange-500/50' :
                    'bg-white/5'
                  } ${isEliminated ? 'opacity-50' : ''}`}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {player.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{player.name}</p>
                    <p className="text-white/70 text-xs">
                      {isEliminated ? '❌ Eliminado' :
                       isExecutingNow ? '🛹 Executando' :
                       isCurrentTurn ? '🎯 Escolhendo' : '⏳ Aguardando'}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {player.letras || '—'}
                    </p>
                    <p className="text-white/70 text-xs">
                      {5 - player.letras.length} chances
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Game Actions */}
        {!game.eliminados.includes(skatista.uid) && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            
            {/* ✅ ESCOLHER MANOBRA - Só aparece para quem é a vez */}
            {game.faseAtual === 'aguardandoManobra' && isMyTurn && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  🎯 Sua vez! Escolha uma manobra
                </h3>
                
                <button
                  onClick={() => setShowManobrasList(!showManobrasList)}
                  className="w-full bg-white/10 border border-white/20 text-white font-medium py-3 rounded-xl mb-4 hover:bg-white/20 transition-colors"
                >
                  {selectedManobra || 'Selecionar Manobra'} ▼
                </button>

                {showManobrasList && (
                  <div className="bg-white/5 rounded-xl p-4 mb-4 max-h-80 overflow-y-auto">
                    {/* Category Tabs */}
                    <div className="flex space-x-1 mb-4 overflow-x-auto">
                      {Object.keys(MANOBRAS).map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category as any)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                            selectedCategory === category
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/10 text-white/70 hover:text-white'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>

                    {/* Manobras da categoria */}
                    <div className="space-y-2">
                      {MANOBRAS[selectedCategory]
                        .filter(manobra => !game.manobrasExecutadas.includes(manobra.name))
                        .map(manobra => (
                          <button
                            key={manobra.name}
                            onClick={() => {
                              setSelectedManobra(manobra.name);
                              setShowManobrasList(false);
                            }}
                            className="w-full text-left p-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">{manobra.name}</p>
                                <p className="text-xs text-white/70 mt-1">{manobra.description}</p>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs ml-2 flex-shrink-0 ${
                                selectedCategory === 'Iniciante' ? 'bg-green-500/20 text-green-200' :
                                selectedCategory === 'Intermediário' ? 'bg-yellow-500/20 text-yellow-200' :
                                'bg-red-500/20 text-red-200'
                              }`}>
                                {selectedCategory.charAt(0)}
                              </span>
                            </div>
                          </button>
                        ))}
                    </div>

                    {MANOBRAS[selectedCategory].filter(m => !game.manobrasExecutadas.includes(m.name)).length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-white/70 text-sm">
                          Todas as manobras {selectedCategory.toLowerCase()} já foram executadas
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleEscolherManobra}
                  disabled={!selectedManobra || loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Confirmar Manobra 🚀'}
                </button>
              </div>
            )}

            {/* ✅ EXECUTAR MANOBRA - Só para quem está executando */}
            {game.faseAtual === 'executandoManobra' && isExecuting && !isCreator && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  🛹 Execute: {game.manobraAtual}
                </h3>
                
                {(() => {
                  const manobraInfo = ALL_MANOBRAS.find(m => m.name === game.manobraAtual);
                  return manobraInfo && (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 mb-4">
                      <p className="text-purple-200 text-sm text-center">
                        💡 {manobraInfo.description}
                      </p>
                    </div>
                  );
                })()}
                
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mb-6">
                  <p className="text-blue-200 text-center text-sm">
                    {game.isFirstRound 
                      ? "🆕 Primeira tentativa - se errar, próximo tenta (sem letra)"
                      : "⚠️ Se errar, outros jogadores votarão"
                    }
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleExecutarManobra('acertou')}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl disabled:opacity-50"
                  >
                    ✅ Acertei!
                  </button>
                  
                  <button
                    onClick={() => handleExecutarManobra('errou')}
                    disabled={loading}
                    className="bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold py-4 rounded-xl disabled:opacity-50"
                  >
                    ❌ Errei
                  </button>
                </div>
              </div>
            )}

            {/* ✅ VOTAÇÃO - Só para quem pode votar */}
            {game.faseAtual === 'votacao' && game.votacao && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  🗳️ Votação
                </h3>
                
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 mb-4">
                  <p className="text-purple-200 text-center text-sm">
                    {executingPlayer?.name} disse que <strong>errou</strong>
                  </p>
                  <p className="text-purple-200 text-center text-xs mt-1">
                    <strong>{game.manobraAtual}</strong>
                  </p>
                </div>

                {canVote ? (
                  <div>
                    <p className="text-white text-center mb-4 text-sm">
                      Você acha que {executingPlayer?.name} acertou ou errou?
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleVotar('acertou')}
                        disabled={loading}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl disabled:opacity-50"
                      >
                        ✅ Acertou
                      </button>
                      
                      <button
                        onClick={() => handleVotar('errou')}
                        disabled={loading}
                        className="bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold py-4 rounded-xl disabled:opacity-50"
                      >
                        ❌ Errou
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-white/70 mb-2 text-sm">
                      {game.votacao.votos[skatista.uid] 
                        ? `Você votou: ${game.votacao.votos[skatista.uid] === 'acertou' ? '✅ Acertou' : '❌ Errou'}`
                        : isCreator 
                        ? 'Criador da manobra não pode votar'
                        : 'Aguardando outros jogadores...'
                      }
                    </p>
                    <p className="text-purple-200 text-xs">
                      Votos: {Object.keys(game.votacao.votos).length}/{game.votacao.votosNecessarios}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ✅ AGUARDANDO */}
            {((game.faseAtual === 'aguardandoManobra' && !isMyTurn) ||
              (game.faseAtual === 'executandoManobra' && !isExecuting) ||
              (game.faseAtual === 'executandoManobra' && isCreator)) && (
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-2">
                  ⏳ Aguardando {currentPlayer?.name || executingPlayer?.name}
                </h3>
                <p className="text-purple-200 mb-4 text-sm">
                  {game.faseAtual === 'aguardandoManobra' 
                    ? 'Escolher a próxima manobra'
                    : `Executar: ${game.manobraAtual}`
                  }
                </p>
                
                {game.manobraAtual && (
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-white/70 text-xs mb-1">Manobra atual:</p>
                    <p className="text-lg font-bold text-white">{game.manobraAtual}</p>
                    {(() => {
                      const manobraInfo = ALL_MANOBRAS.find(m => m.name === game.manobraAtual);
                      return manobraInfo && (
                        <p className="text-white/70 text-xs mt-2">{manobraInfo.description}</p>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Game Stats */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-white">{game.manobrasExecutadas.length}</p>
              <p className="text-white/70 text-xs">Manobras</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">{jogadoresAtivos.length}</p>
              <p className="text-white/70 text-xs">Ativos</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">{game.eliminados.length}</p>
              <p className="text-white/70 text-xs">Eliminados</p>
            </div>
          </div>
        </div>

        {/* ✅ HISTÓRICO DE MANOBRAS - Sempre visível */}
        {game.manobrasExecutadas.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
            <h4 className="text-white font-medium mb-3 text-sm">🛹 Histórico de Manobras</h4>
            <div className="flex flex-wrap gap-2">
              {game.manobrasExecutadas.map((manobra, index) => (
                <span
                  key={index}
                  className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full text-xs"
                >
                  {manobra}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};