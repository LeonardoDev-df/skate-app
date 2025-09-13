import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const { skatista } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 z-40">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="grid grid-cols-5 gap-1">
          {/* Home */}
          <Link
            to="/"
            className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
              isActive('/') 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="text-xl mb-1">🏠</span>
            <span className="text-xs font-medium">Home</span>
          </Link>

          {/* Skateparks */}
          <Link
            to="/skateparks"
            className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
              isActive('/skateparks') 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="text-xl mb-1">🗺️</span>
            <span className="text-xs font-medium">Pistas</span>
          </Link>

          {/* Game */}
          <Link
            to="/game"
            className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
              isActive('/game') 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="text-xl mb-1">🎮</span>
            <span className="text-xs font-medium">Game</span>
          </Link>

          {/* Ranking */}
          <Link
            to="/ranking"
            className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
              isActive('/ranking') 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="text-xl mb-1">🏆</span>
            <span className="text-xs font-medium">Ranking</span>
          </Link>

          {/* Profile/Login */}
          <Link
            to={skatista ? "/profile" : "/login"}
            className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
              isActive('/profile') || isActive('/login')
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="text-xl mb-1">{skatista ? '👤' : '🔑'}</span>
            <span className="text-xs font-medium">{skatista ? 'Perfil' : 'Login'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};