import React from 'react';
import { Link } from 'react-router-dom';
import { useSkateparks } from '../hooks/useSkateparks';

export const Home: React.FC = () => {
  const { skateparks, loading } = useSkateparks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            🛹 Skate App
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sua plataforma completa para o mundo do skate
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{loading ? '...' : skateparks.length}</div>
              <div className="text-sm text-gray-600">Skateparks</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">24/7</div>
              <div className="text-sm text-gray-600">Disponível</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">∞</div>
              <div className="text-sm text-gray-600">Diversão</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-orange-600">🔥</div>
              <div className="text-sm text-gray-600">Manobras</div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link
            to="/game"
            className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎮</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Game of Skate</h3>
            <p className="text-gray-600 text-sm">
              Desafie seus amigos em partidas épicas de Game of Skate
            </p>
            <div className="mt-4 text-blue-600 text-sm font-medium">
              Jogar agora →
            </div>
          </Link>

          <Link
            to="/skateparks"
            className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mapa de Pistas</h3>
            <p className="text-gray-600 text-sm">
              Encontre os melhores skateparks da sua região
            </p>
            <div className="mt-4 text-green-600 text-sm font-medium">
              Explorar →
            </div>
          </Link>

          <Link
            to="/tutorials"
            className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tutoriais</h3>
            <p className="text-gray-600 text-sm">
              Aprenda novas manobras com nossos tutoriais
            </p>
            <div className="mt-4 text-purple-600 text-sm font-medium">
              Aprender →
            </div>
          </Link>

          <Link
            to="/profile"
            className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👤</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Perfil</h3>
            <p className="text-gray-600 text-sm">
              Gerencie seu perfil e acompanhe seu progresso
            </p>
            <div className="mt-4 text-orange-600 text-sm font-medium">
              Ver perfil →
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            🔥 Atividade Recente
          </h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                🛹
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Novo skatepark adicionado: Skate Park Paranoá
                </p>
                <p className="text-xs text-gray-500">Há 2 horas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                🎮
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Sistema de Game of Skate atualizado
                </p>
                <p className="text-xs text-gray-500">Ontem</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                📱
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  App mobile em desenvolvimento
                </p>
                <p className="text-xs text-gray-500">Há 3 dias</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};