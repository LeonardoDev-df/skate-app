import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSkateparks } from '../hooks/useSkateparks';
import { useAuth } from '../contexts/AuthContext';

export const Skateparks: React.FC = () => {
  const { skateparks, loading, error } = useSkateparks();
  const { skatista, updateSkatistaProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [addingSpot, setAddingSpot] = useState<string | null>(null);

  // Filtrar skateparks baseado na busca
  const filteredSkateparks = skateparks.filter(park =>
    park.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    park.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Verificar se um spot já está salvo
  const isSpotSaved = (parkName: string) => {
    if (!skatista?.spots) return false;
    return skatista.spots.some(spot => {
      const spotPath = spot.path || spot;
      return spotPath.includes(parkName.replace(/\s+/g, '%20'));
    });
  };

  // Adicionar spot aos favoritos
  const addToMySpots = async (park: any) => {
    if (!skatista) return;
    
    setAddingSpot(park.id);
    
    try {
      // Criar referência no formato correto
      const spotReference = `/SkatePark/Brasilia/Spots/${park.name}`;
      
      const currentSpots = skatista.spots || [];
      const newSpots = [...currentSpots, spotReference];
      
      await updateSkatistaProfile({ spots: newSpots });
    } catch (error) {
      console.error('Erro ao adicionar spot:', error);
    } finally {
      setAddingSpot(null);
    }
  };

  // Remover spot dos favoritos
  const removeFromMySpots = async (park: any) => {
    if (!skatista) return;
    
    setAddingSpot(park.id);
    
    try {
      const currentSpots = skatista.spots || [];
      const newSpots = currentSpots.filter(spot => {
        const spotPath = spot.path || spot;
        return !spotPath.includes(park.name.replace(/\s+/g, '%20'));
      });
      
      await updateSkatistaProfile({ spots: newSpots });
    } catch (error) {
      console.error('Erro ao remover spot:', error);
    } finally {
      setAddingSpot(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Carregando skateparks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-white mb-2">Erro ao carregar</h2>
          <p className="text-purple-200 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden pt-12 pb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative px-4">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/" className="text-white/70 hover:text-white">
              ← Voltar
            </Link>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🗺️</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Skateparks de Brasília
            </h1>
            <p className="text-purple-200">
              {skateparks.length} pistas disponíveis
            </p>
          </div>
        </div>
      </div>

      <div className="px-4">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar skateparks..."
              className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
              🔍
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {filteredSkateparks.length}
            </div>
            <div className="text-purple-200 text-sm">Pistas Encontradas</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {skatista?.spots?.length || 0}
            </div>
            <div className="text-purple-200 text-sm">Meus Spots</div>
          </div>
        </div>

        {/* Skateparks List */}
        {filteredSkateparks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Nenhum skatepark encontrado
            </h3>
            <p className="text-purple-200">
              Tente buscar com outros termos
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {filteredSkateparks.map((park) => {
              const isSaved = isSpotSaved(park.name);
              const isProcessing = addingSpot === park.id;
              
              return (
                <div
                  key={park.id}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl">🛹</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-lg mb-1">
                        {park.name}
                      </h3>
                      <p className="text-purple-200 text-sm mb-2">
                        📍 {park.city}, {park.region}
                      </p>
                      
                      {park.address && park.address !== 'Endereço não informado' && (
                        <a
                          href={park.address}
                          
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-blue-300 text-sm hover:text-blue-200 transition-colors"
                        >
                          <span>🗺️</span>
                          <span>Ver no Maps</span>
                        </a>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2">
                      {skatista ? (
                        <button
                          onClick={() => isSaved ? removeFromMySpots(park) : addToMySpots(park)}
                          disabled={isProcessing}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                            isSaved
                              ? 'bg-red-500/20 border border-red-500/50 text-red-200 hover:bg-red-500/30'
                              : 'bg-green-500/20 border border-green-500/50 text-green-200 hover:bg-green-500/30'
                          }`}
                        >
                          {isProcessing ? '⏳' : isSaved ? '❤️ Salvo' : '🤍 Salvar'}
                        </button>
                      ) : (
                        <Link
                          to="/login"
                          className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 text-purple-200 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-colors"
                        >
                          Login
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* My Spots Link */}
        {skatista && skatista.spots && skatista.spots.length > 0 && (
          <div className="mb-8">
            <Link
              to="/my-spots"
              className="block bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 text-center active:scale-95 transition-all duration-200"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl">📍</span>
                <span className="text-white font-bold">
                  Ver Meus {skatista.spots.length} Spots Salvos
                </span>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Navigation Space */}
      <div className="h-20"></div>
    </div>
  );
};