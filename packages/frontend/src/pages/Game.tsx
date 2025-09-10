import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Game: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'play' | 'invites' | 'history'>('play');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              ← Voltar
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">🎮 Game of Skate</h1>
          </div>
          <p className="text-gray-600">
            Desafie seus amigos em partidas épicas de Game of Skate
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'play', label: 'Jogar', icon: '🎮' },
                { id: 'invites', label: 'Convites', icon: '📨' },
                { id: 'history', label: 'Histórico', icon: '📊' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'play' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Criar Nova Partida
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Escolha um skatepark e convide seus amigos para jogar
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      🏃‍♂️ Partida Rápida
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Entre em uma partida com jogadores online
                    </p>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      Buscar Partida
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      👥 Criar Sala Privada
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Convide amigos específicos para jogar
                    </p>
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                      Criar Sala
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-yellow-400 text-xl">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Funcionalidade em Desenvolvimento
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          O sistema de Game of Skate está sendo desenvolvido. 
                          Em breve você poderá desafiar seus amigos!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'invites' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📨</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum convite pendente
                </h3>
                <p className="text-gray-600">
                  Quando alguém te convidar para jogar, os convites aparecerão aqui.
                </p>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma partida jogada ainda
                </h3>
                <p className="text-gray-600">
                  Seu histórico de partidas aparecerá aqui após você jogar.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Game Rules */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 Como Jogar Game of Skate
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Regras Básicas:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cada jogador escolhe uma manobra por vez</li>
                <li>• Os outros jogadores devem tentar executar a manobra</li>
                <li>• Quem não conseguir, ganha uma letra (S-K-A-T-E)</li>
                <li>• O último jogador sem todas as letras vence</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Dicas:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Comece com manobras mais simples</li>
                <li>• Observe o nível dos outros jogadores</li>
                <li>• Seja criativo nas suas escolhas</li>
                <li>• Divirta-se e respeite os adversários</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};