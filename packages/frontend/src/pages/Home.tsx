import React from 'react';
import { Link } from 'react-router-dom';
import { useSkateparks } from '../hooks/useSkateparks';
import { useAuth } from '../contexts/AuthContext';

export const Home: React.FC = () => {
  const { skateparks, loading } = useSkateparks();
  const { skatista } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Header Mobile */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative px-4 pt-12 pb-8">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🛹</div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Skate App
            </h1>
            <p className="text-purple-200 text-lg mb-6">
              Sua pista digital para o mundo do skate
            </p>
            
            {/* User Welcome */}
            {skatista && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {skatista.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">
                      {skatista.name} 👋
                    </p>
                    <p className="text-purple-200 text-sm">
                      Status: <span className="text-green-400">{skatista.status}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 -mt-4 mb-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {loading ? '...' : skateparks.length}
            </div>
            <div className="text-purple-200 text-sm">Pistas</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {skatista?.spots?.length || 0}
            </div>
            <div className="text-purple-200 text-sm">Meus Spots</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">●</div>
            <div className="text-purple-200 text-sm">Online</div>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="px-4 mb-8">
        <div className="grid gap-4">
          {/* Game of Skate */}
          <Link
            to="/game"
            className="group bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 shadow-lg active:scale-95 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl group-active:scale-110 transition-transform">🎮</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">Game of Skate</h3>
                <p className="text-orange-100 text-sm">
                  Desafie outros skatistas em partidas épicas
                </p>
              </div>
              <div className="text-white/70">→</div>
            </div>
          </Link>

          {/* Meus Spots */}
          <Link
            to="/my-spots"
            className="group bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 shadow-lg active:scale-95 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl group-active:scale-110 transition-transform">📍</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">Meus Spots</h3>
                <p className="text-green-100 text-sm">
                  {skatista?.spots?.length || 0} spots salvos
                </p>
              </div>
              <div className="text-white/70">→</div>
            </div>
          </Link>

          {/* Explorar Pistas */}
          <Link
            to="/skateparks"
            className="group bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 shadow-lg active:scale-95 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl group-active:scale-110 transition-transform">🗺️</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">Explorar Pistas</h3>
                <p className="text-blue-100 text-sm">
                  Descubra novos skateparks
                </p>
              </div>
              <div className="text-white/70">→</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Secondary Actions */}
      <div className="px-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/profile"
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center active:scale-95 transition-all duration-200"
          >
            <div className="text-3xl mb-2">👤</div>
            <div className="text-white font-medium text-sm">Perfil</div>
          </Link>
          
          <Link
            to="/ranking"
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center active:scale-95 transition-all duration-200"
          >
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-white font-medium text-sm">Ranking</div>
          </Link>
        </div>
      </div>

      {/* Meus Spots Preview */}
      {skatista?.spots && skatista.spots.length > 0 && (
        <div className="px-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="text-2xl mr-2">📍</span>
              Meus Spots Favoritos
            </h2>
            
            <div className="space-y-3">
              {skatista.spots.slice(0, 3).map((spot, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🛹</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      Spot #{index + 1}
                    </p>
                    <p className="text-purple-200 text-xs">Adicionado recentemente</p>
                  </div>
                </div>
              ))}
              
              {skatista.spots.length > 3 && (
                <Link
                  to="/my-spots"
                  className="block text-center text-purple-300 text-sm hover:text-white transition-colors"
                >
                  Ver todos os {skatista.spots.length} spots →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Space */}
      <div className="h-20"></div>
    </div>
  );
};