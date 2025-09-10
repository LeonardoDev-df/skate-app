import React from 'react';
import { Link } from 'react-router-dom';
import { SkateparkList } from '../components/SkateparkList';
import { Skatepark } from '../services/api';

export const Skateparks: React.FC = () => {
  const handleSkateparkSelect = (skatepark: Skatepark) => {
    // Navegar para detalhes do skatepark ou abrir modal
    console.log('Skatepark selecionado:', skatepark);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              ← Voltar
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">🗺️ Skateparks</h1>
          </div>
          <p className="text-gray-600">
            Encontre os melhores skateparks da sua região
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="text-2xl">📍</span>
              <div className="text-left">
                <div className="font-medium text-gray-900">Perto de Mim</div>
                <div className="text-sm text-gray-600">Usar localização</div>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <span className="text-2xl">⭐</span>
              <div className="text-left">
                <div className="font-medium text-gray-900">Favoritos</div>
                <div className="text-sm text-gray-600">Seus skateparks salvos</div>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="text-2xl">➕</span>
              <div className="text-left">
                <div className="font-medium text-gray-900">Adicionar</div>
                <div className="text-sm text-gray-600">Sugerir novo local</div>
              </div>
            </button>
          </div>
        </div>

        {/* Skatepark List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <SkateparkList onSkateparkSelect={handleSkateparkSelect} />
        </div>
      </div>
    </div>
  );
};