import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🛹</span>
              <span className="text-xl font-bold">Skate App</span>
            </div>
            <p className="text-gray-400 text-sm">
              A plataforma completa para skatistas. Jogue, aprenda e conecte-se com a comunidade.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/game" className="text-gray-400 hover:text-white transition-colors">
                  Game of Skate
                </Link>
              </li>
              <li>
                <Link to="/skateparks" className="text-gray-400 hover:text-white transition-colors">
                  Skateparks
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-gray-400 hover:text-white transition-colors">
                  Tutoriais
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2 text-gray-400">
              <li>🎮 Jogos Online</li>
              <li>🗺️ Mapa Interativo</li>
              <li>📚 Tutoriais HD</li>
              <li>👥 Comunidade</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📧 contato@skateapp.com</li>
              <li>📱 (61) 99999-9999</li>
              <li>📍 Brasília, DF</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                📷
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                🐦
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Skate App. Todos os direitos reservados.</p>
          <p className="mt-2">
            Feito com ❤️ para a comunidade do skate
          </p>
        </div>
      </div>
    </footer>
  );
};