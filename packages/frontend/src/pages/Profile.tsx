import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { skatista, updateSkatistaProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: skatista?.name || '',
    image: skatista?.image || 'sk10.jpg'
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateSkatistaProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!skatista) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p>Faça login para ver seu perfil</p>
          <Link to="/login" className="text-purple-300 hover:text-white">
            Fazer Login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden pt-12 pb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative text-center px-4">
          <div className="text-4xl mb-4">👤</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Meu Perfil
          </h1>
          <p className="text-purple-200">
            Gerencie suas informações
          </p>
        </div>
      </div>

      <div className="px-4">
        {/* Profile Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6">
          {/* Avatar */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl font-bold">
                {skatista.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                skatista.status === 'Online' ? 'bg-green-400' : 'bg-gray-400'
              }`}></div>
              <span className="text-white text-sm">{skatista.status}</span>
            </div>
          </div>

          {/* Profile Info */}
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-white/10 border border-white/20 text-white font-bold py-3 rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {skatista.name}
                </h2>
                <p className="text-purple-200 text-sm">
                  {skatista.email}
                </p>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="w-full bg-white/10 border border-white/20 text-white font-medium py-3 rounded-xl hover:bg-white/20 transition-colors"
              >
                ✏️ Editar Perfil
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">📊 Estatísticas</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {skatista.spots?.length || 0}
              </div>
              <div className="text-purple-200 text-sm">Spots Salvos</div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {skatista.createdAt ? 
                  Math.floor((Date.now() - new Date(skatista.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                  : 0
                }
              </div>
              <div className="text-purple-200 text-sm">Dias no App</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4 mb-8">
          <Link
            to="/my-spots"
            className="block bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📍</span>
              <div className="flex-1">
                <h4 className="text-white font-medium">Meus Spots</h4>
                <p className="text-purple-200 text-sm">
                  {skatista.spots?.length || 0} spots salvos
                </p>
              </div>
              <span className="text-white/70">→</span>
            </div>
          </Link>

          <Link
            to="/skateparks"
            className="block bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">��️</span>
              <div className="flex-1">
                <h4 className="text-white font-medium">Explorar Pistas</h4>
                <p className="text-purple-200 text-sm">Descobrir novos spots</p>
              </div>
              <span className="text-white/70">→</span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500/20 border border-red-500/50 text-red-200 font-medium py-4 rounded-xl hover:bg-red-500/30 transition-colors"
          >
            🚪 Sair da Conta
          </button>
        </div>

        {/* Account Info */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-8">
          <h4 className="text-white font-medium mb-2">ℹ️ Informações da Conta</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-purple-200">ID:</span>
              <span className="text-white font-mono text-xs">
                {skatista.uid.slice(0, 8)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Criado em:</span>
              <span className="text-white">
                {skatista.createdAt ? 
                  new Date(skatista.createdAt).toLocaleDateString('pt-BR')
                  : 'N/A'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Última atualização:</span>
              <span className="text-white">
                {skatista.updatedAt ? 
                  new Date(skatista.updatedAt).toLocaleDateString('pt-BR')
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Space */}
      <div className="h-20"></div>
    </div>
  );
};