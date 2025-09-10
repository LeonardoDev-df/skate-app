import React, { useState } from 'react';
import { useSkateparks } from '../hooks/useSkateparks';
import { Skatepark } from '../services/api';

interface SkateparkListProps {
  onSkateparkSelect?: (skatepark: Skatepark) => void;
}

export const SkateparkList: React.FC<SkateparkListProps> = ({ onSkateparkSelect }) => {
  const [searchCity, setSearchCity] = useState('');
  const [debouncedCity, setDebouncedCity] = useState('');
  
  const { skateparks, loading, error, refetch } = useSkateparks(debouncedCity);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCity(searchCity);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchCity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedCity(searchCity);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Carregando skateparks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erro ao carregar skateparks</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={refetch}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Buscar por cidade
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="city"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Ex: Brasília, DF, Paranoá..."
            />
            <button
              type="submit"
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
            >
              🔍
            </button>
          </div>
        </div>
        
        {debouncedCity && (
          <div className="text-sm text-gray-600">
            Buscando por: <strong>{debouncedCity}</strong>
            <button
              type="button"
              onClick={() => {
                setSearchCity('');
                setDebouncedCity('');
              }}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              Limpar
            </button>
          </div>
        )}
      </form>

      {/* Results */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Skateparks Encontrados
          </h2>
          <span className="text-sm text-gray-500">
            {skateparks.length} resultado(s)
          </span>
        </div>

        {skateparks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum skatepark encontrado.</p>
            {debouncedCity && (
              <p className="mt-2">Tente buscar por outra cidade ou termo.</p>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skateparks.map((skatepark) => (
              <div
                key={skatepark.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSkateparkSelect?.(skatepark)}
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {skatepark.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  📍 {skatepark.city}, {skatepark.state}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {skatepark.type}
                </p>
                
                <div className="flex justify-between items-center">
                  <a
                    href={skatepark.address}
                    
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Ver no Maps
                  </a>
                  <span className="text-xs text-gray-400">
                    {skatepark.coordinates.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};