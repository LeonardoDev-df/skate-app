import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface SpotData {
  id: string;
  name: string;
  location?: string;
  addedAt?: string;
}

export const MySpots: React.FC = () => {
  const { skatista, updateSkatistaProfile } = useAuth();
  const [spots, setSpots] = useState<SpotData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSpots = async () => {
      if (!skatista?.spots) {
        setLoading(false);
        return;
      }

      try {
        const spotsData: SpotData[] = [];
        
        for (const spotRef of skatista.spots) {
          try {
            // Extrair ID do path da referência
            const spotId = spotRef.path ? spotRef.path.split('/').pop() : spotRef.id || spotRef;
            
            // Buscar dados do spot (você pode ajustar a coleção conforme sua estrutura)
            const spotDoc = await getDoc(doc(db, 'SkatePark/Brasilia/Spots', spotId));
            
            if (spotDoc.exists()) {
              spotsData.push({
                id: spotId,
                name: spotDoc.data().name || `Spot ${spotId}`,
                location: spotDoc.data().location || 'Brasília, DF',
                addedAt: spotDoc.data().addedAt || new Date().toISOString()
              });
            } else {
              // Se não encontrar o documento, adicionar com dados básicos
              spotsData.push({
                id: spotId,
                name: `Spot ${spotId}`,
                location: 'Localização não encontrada',
                addedAt: new Date().toISOString()
              });
            }
          } catch (error) {
            console.error('Erro ao carregar spot:', error);
          }
        }
        
        setSpots(spotsData);
      } catch (error) {
        console.error('Erro ao carregar spots:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSpots();
  }, [skatista?.spots]);

  const removeSpot = async (spotId: string) => {
    if (!skatista) return;

    try {
      const updatedSpots = skatista.spots.filter(spot => {
        const id = spot.path ? spot.path.split('/').pop() : spot.id || spot;
        return id !== spotId;
      });

      await updateSkatistaProfile({ spots: updatedSpots });
      setSpots(prev => prev.filter(spot => spot.id !== spotId));
    } catch (error) {
      console.error('Erro ao remover spot:', error);
    }
  };

  if (!skatista) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p>Faça login para ver seus spots</p>
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
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-white/70 hover:text-white">
              ← Voltar
            </Link>
          </div>
          <div className="text-center mt-4">
            <div className="text-4xl mb-4">📍</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Meus Spots
            </h1>
            <p className="text-purple-200">
              {spots.length} spots salvos
            </p>
          </div>
        </div>
      </div>

      <div className="px-4">
        {/* Add New Spot */}
        <div className="mb-6">
          <Link
            to="/skateparks"
            className="block bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 text-center active:scale-95 transition-all duration-200"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">➕</span>
              <span className="text-white font-bold">Adicionar Novo Spot</span>
            </div>
          </Link>
        </div>

        {/* Spots List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/70">Carregando spots...</p>
          </div>
        ) : spots.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛹</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Nenhum spot salvo ainda
            </h3>
            <p className="text-purple-200 mb-6">
              Explore os skateparks e adicione seus favoritos!
            </p>
            <Link
              to="/skateparks"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-xl"
            >
              Explorar Pistas →
            </Link>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {spots.map((spot) => (
              <div
                key={spot.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🛹</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-lg mb-1">
                      {spot.name}
                    </h3>
                    <p className="text-purple-200 text-sm mb-2">
                      📍 {spot.location}
                    </p>
                    <p className="text-white/70 text-xs">
                      Adicionado em {new Date(spot.addedAt || '').toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => removeSpot(spot.id)}
                      className="bg-red-500/20 border border-red-500/50 text-red-200 px-3 py-2 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {spots.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">📊 Estatísticas</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {spots.length}
                </div>
                <div className="text-purple-200 text-sm">Total de Spots</div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {new Set(spots.map(s => s.location)).size}
                </div>
                <div className="text-purple-200 text-sm">Localizações</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Space */}
      <div className="h-20"></div>
    </div>
  );
};