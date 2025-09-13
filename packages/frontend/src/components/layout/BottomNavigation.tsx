import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGameOfSkate } from '../../hooks/useGameOfSkate';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const { gameInvites, activeGame } = useGameOfSkate();

  const pendingInvites = gameInvites.filter(inv => inv.status === 'Aguardando').length;
  const hasActiveGame = !!activeGame && !activeGame.jogoFinalizado;

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/skateparks', icon: '🗺️', label: 'Pistas' },
    { 
      path: '/game', 
      icon: hasActiveGame ? '🔥' : '🎮', 
      label: 'Game',
      badge: pendingInvites > 0 ? pendingInvites : undefined
    },
    { path: '/tutorials', icon: '📚', label: 'Tutoriais' },
    { path: '/profile', icon: '👤', label: 'Perfil' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 relative ${
                isActive 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/70 hover:text-white active:scale-95'
              }`}
            >
              <span className={`text-xl mb-1 ${isActive ? 'animate-bounce' : ''}`}>
                {item.icon}
              </span>
              <span className="text-xs font-medium">
                {item.label}
              </span>
              
              {/* Badge for notifications */}
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};