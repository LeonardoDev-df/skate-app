import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGameOfSkate } from '../../hooks/useGameOfSkate';
import { useSkateparks } from '../../hooks/useSkateparks';
import { Player } from '../../types/game.types';

interface CreateGameModalProps {
  onClose: () => void;
  onGameCreated: () => void;
}

export const CreateGameModal: React.FC<CreateGameModalProps> = ({ onClose, onGameCreated }) => {
  const { skatista } = useAuth();
  const { createGameInvite, getSkateParksPlayers, loading } = useGameOfSkate();
  const { skateparks } = useSkateparks();
  
  const [selectedSkatePark, setSelectedSkatePark] = useState('');
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [step, setStep] = useState<'skatepark' | 'players'>('skatepark');

  // Buscar jogadores quando skatepark for selecionado
  useEffect(() => {
    const fetchPlayersInSkatepark = async () => {
      if (!selectedSkatePark) {
        setAvailablePlayers([]);
        return;
      }

      setLoadingPlayers(true);
      try {
        const players = await getSkateParksPlayers(selectedSkatePark);
        setAvailablePlayers(players);
        
        if (players.length === 0) {
          alert('Nenhum skatista online encontrado neste skatepark!');
          setStep('skatepark');
          setSelectedSkatePark('');
        }
      } catch (error) {
        console.error('Erro ao buscar jogadores:', error);
      } finally {
        setLoadingPlayers(false);
      }
    };

    if (selectedSkatePark && step === 'players') {
      fetchPlayersInSkatepark();
    }
  }, [selectedSkatePark, step, getSkateParksPlayers]);

  // ✅ FUNÇÃO CORRIGIDA - estava faltando
  const handleSkateparkSelect = (skatePark: string) => {
    setSelectedSkatePark(skatePark);
    setSelectedPlayers([]);
    setStep('players');
  };

  const togglePlayerSelection = (player: Player) => {
    setSelectedPlayers(prev => {
      const isSelected = prev.some(p => p.id === player.id);
      if (isSelected) {
        return prev.filter(p => p.id !== player.id);
      } else if (prev.length < 3) { // Máximo 4 jogadores total
        return [...prev, player];
      }
      return prev;
    });
  };

  const handleCreateGame = async () => {
    if (!selectedSkatePark || selectedPlayers.length === 0) return;

    try {
      await createGameInvite(selectedSkatePark, selectedPlayers);
      onGameCreated();
    } catch (error) {
      console.error('Erro ao criar jogo:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            🎮 Criar Game of Skate
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step === 'skatepark' ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'
          }`}>
            1
          </div>
          <div className={`w-12 h-1 ${step === 'players' ? 'bg-purple-600' : 'bg-white/20'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step === 'players' ? 'bg-purple-600 text-white' : 'bg-white/20 text-white/50'
          }`}>
            2
          </div>
        </div>

        {/* Step 1: Skatepark Selection */}
        {step === 'skatepark' && (
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              📍 Escolha o Skatepark
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              Apenas skatistas cadastrados neste skatepark poderão ser convidados
            </p>
            
            <div className="space-y-3">
              {skateparks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🛹</div>
                  <p className="text-white/70">Carregando skateparks...</p>
                </div>
              ) : (
                skateparks.map(park => (
                  <button
                    key={park.id}
                    onClick={() => handleSkateparkSelect(park.name)} // ✅ CORRIGIDO
                    className="w-full text-left p-4 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors active:scale-95"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🛹</span>
                      <div>
                        <p className="font-medium">{park.name}</p>
                        <p className="text-sm text-purple-200">{park.city}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 2: Players Selection */}
        {step === 'players' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                👥 Skatistas Online
              </h3>
              <button
                onClick={() => setStep('skatepark')}
                className="text-purple-300 text-sm hover:text-white"
              >
                ← Voltar
              </button>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mb-4">
              <p className="text-blue-200 text-sm">
                📍 {selectedSkatePark}
              </p>
              <p className="text-blue-200 text-xs">
                Selecionados: {selectedPlayers.length}/3
              </p>
            </div>

            {loadingPlayers ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/70">Buscando skatistas online...</p>
              </div>
            ) : availablePlayers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">😔</div>
                <h4 className="text-white font-medium mb-2">
                  Nenhum skatista online
                </h4>
                <p className="text-purple-200 text-sm mb-4">
                  Não há outros skatistas online neste skatepark no momento
                </p>
                <button
                  onClick={() => setStep('skatepark')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Escolher Outro Skatepark
                </button>
              </div>
            ) : (
              <div>
                {/* Selected Players */}
                {selectedPlayers.length > 0 && (
                  <div className="mb-4">
                    <p className="text-white/70 text-sm mb-2">Convidados:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlayers.map(player => (
                        <span
                          key={player.id}
                          className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                        >
                          <span>{player.name}</span>
                          <button
                            onClick={() => togglePlayerSelection(player)}
                            className="hover:text-red-300 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Players */}
                <div className="bg-white/5 rounded-xl p-4 max-h-60 overflow-y-auto mb-4">
                  <div className="space-y-2">
                    {availablePlayers.map(player => {
                      const isSelected = selectedPlayers.some(p => p.id === player.id);
                      const canSelect = selectedPlayers.length < 3;
                      
                      return (
                        <button
                          key={player.id}
                          onClick={() => togglePlayerSelection(player)}
                          disabled={!canSelect && !isSelected}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            isSelected
                              ? 'bg-green-500/20 border border-green-500/50 text-green-200'
                              : canSelect
                              ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20 active:scale-95'
                              : 'bg-white/5 border border-white/10 text-white/50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {player.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{player.name}</p>
                              <p className="text-xs opacity-70 flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                                Online
                              </p>
                            </div>
                            {isSelected && (
                              <span className="ml-auto text-green-400">✓</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Game Rules */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
                  <h4 className="text-orange-200 font-medium mb-2">⚡ Regras do Jogo</h4>
                  <ul className="text-orange-200 text-sm space-y-1">
                    <li>• Timer de 3 minutos para aceitar convite</li>
                    <li>• Primeiro erro não dá letra</li>
                    <li>• Outros jogadores votam se acertou/errou</li>
                    <li>• SKATE completo = eliminado</li>
                    <li>• Último jogador vence</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep('skatepark')}
                    className="flex-1 bg-white/10 border border-white/20 text-white font-medium py-3 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    ← Voltar
                  </button>
                  
                  <button
                    onClick={handleCreateGame}
                    disabled={selectedPlayers.length === 0 || loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all duration-200"
                  >
                    {loading ? 'Enviando...' : `Convidar ${selectedPlayers.length} 🚀`}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};