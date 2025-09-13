import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSkateparks } from '../hooks/useSkateparks';

interface SelectedSpot {
  name: string;
  path: string;
}

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [selectedSpots, setSelectedSpots] = useState<SelectedSpot[]>([]);
  const [showSpotSelection, setShowSpotSelection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedLGPD, setAcceptedLGPD] = useState(false);
  const [showLGPDModal, setShowLGPDModal] = useState(false);
  
  const { register } = useAuth();
  const { skateparks, loading: skateparksLoading } = useSkateparks();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const toggleSpot = (park: any) => {
    const spotPath = `/SkatePark/Brasilia/Spots/${park.name}`;
    const isSelected = selectedSpots.some(spot => spot.path === spotPath);
    
    if (isSelected) {
      setSelectedSpots(prev => prev.filter(spot => spot.path !== spotPath));
    } else {
      setSelectedSpots(prev => [...prev, { name: park.name, path: spotPath }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validação LGPD
    if (!acceptedLGPD) {
      setError('Você deve aceitar os termos de privacidade para continuar');
      setLoading(false);
      return;
    }

    // Validações existentes
    if (!formData.name.trim()) {
      setError('Nome é obrigatório');
      setLoading(false);
      return;
    }

    if (formData.name.trim().length < 2) {
      setError('Nome deve ter pelo menos 2 caracteres');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Senha é obrigatória');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      setSuccess('Criando sua conta...');
      
      await register(formData.email, formData.password, formData.name, selectedSpots);
      
      setSuccess('Conta criada com sucesso! Redirecionando...');
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error: any) {
      setError(error.message || 'Erro ao criar conta');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="relative overflow-hidden pt-12 pb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative text-center px-4">
          <div className="text-6xl mb-4 animate-pulse">🛹</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Junte-se à comunidade!
          </h1>
          <p className="text-purple-200">
            Crie sua conta e escolha seus spots favoritos
          </p>
        </div>
      </div>

      {/* Register Form */}
      <div className="flex-1 px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                👤 Nome Completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Ex: João Silva"
                required
                minLength={2}
                maxLength={50}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                📧 Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                🔒 Senha *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                🔒 Confirmar Senha *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Repita sua senha"
                required
              />
            </div>

            {/* Spot Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-white text-sm font-medium">
                  🗺️ Seus Spots Favoritos ({selectedSpots.length} selecionados)
                </label>
                <button
                  type="button"
                  onClick={() => setShowSpotSelection(!showSpotSelection)}
                  className="text-purple-300 text-sm hover:text-white transition-colors"
                >
                  {showSpotSelection ? 'Ocultar' : 'Escolher'}
                </button>
              </div>
              
              {showSpotSelection && (
                <div className="bg-white/5 rounded-xl p-4 max-h-60 overflow-y-auto">
                  {skateparksLoading ? (
                    <div className="text-center py-4">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-white/70 text-sm">Carregando skateparks...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {skateparks.map((park) => {
                        const spotPath = `/SkatePark/Brasilia/Spots/${park.name}`;
                        const isSelected = selectedSpots.some(spot => spot.path === spotPath);
                        
                        return (
                          <button
                            key={park.id}
                            type="button"
                            onClick={() => toggleSpot(park)}
                            className={`w-full text-left p-3 rounded-lg transition-all ${
                              isSelected
                                ? 'bg-green-500/20 border border-green-500/50 text-green-200'
                                : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">
                                {isSelected ? '✅' : '🛹'}
                              </span>
                              <div>
                                <p className="font-medium text-sm">{park.name}</p>
                                <p className="text-xs opacity-70">{park.city}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              
              {selectedSpots.length > 0 && (
                <div className="mt-3">
                  <p className="text-white/70 text-xs mb-2">Spots selecionados:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpots.map((spot) => (
                      <span
                        key={spot.path}
                        className="bg-green-500/20 text-green-200 px-2 py-1 rounded-lg text-xs flex items-center space-x-1"
                      >
                        <span>{spot.name}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedSpots(prev => prev.filter(s => s.path !== spot.path))}
                          className="hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Termo LGPD */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="lgpd"
                  checked={acceptedLGPD}
                  onChange={(e) => setAcceptedLGPD(e.target.checked)}
                  className="mt-1 w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                  required
                />
                <div className="flex-1">
                  <label htmlFor="lgpd" className="text-blue-200 text-sm">
                    Eu concordo com os{' '}
                    <button
                      type="button"
                      onClick={() => setShowLGPDModal(true)}
                      className="text-purple-300 underline hover:text-white"
                    >
                      termos de privacidade e proteção de dados
                    </button>
                    {' '}*
                  </label>
                  <p className="text-blue-200/70 text-xs mt-1">
                    🔒 Seus dados estão seguros conosco. Aplicável para usuários de 12+ anos.
                  </p>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-3">
                <p className="text-green-200 text-sm text-center">
                  ✅ {success}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3">
                <p className="text-red-200 text-sm text-center">
                  ❌ {error}
                </p>
              </div>
            )}

            {/* Form Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
              <p className="text-blue-200 text-xs text-center">
                ℹ️ Você pode escolher seus spots favoritos agora ou adicionar depois no seu perfil!
              </p>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading || !acceptedLGPD}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Criando conta...</span>
                </div>
              ) : (
                `Criar Conta ${selectedSpots.length > 0 ? `com ${selectedSpots.length} spots` : ''} 🚀`
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mb-8">
          <p className="text-white/70 text-sm">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-purple-300 font-medium hover:text-white transition-colors"
            >
              Faça login aqui 🔑
            </Link>
          </p>
        </div>
      </div>

      {/* Modal LGPD */}
      {showLGPDModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🔒</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Termos de Privacidade
              </h3>
              <p className="text-white/70 text-sm">
                Lei Geral de Proteção de Dados (LGPD)
              </p>
            </div>

            <div className="space-y-4 text-sm text-white/80">
              <div>
                <h4 className="font-medium text-white mb-2">📋 Coleta de Dados</h4>
                <p>
                  Coletamos apenas os dados necessários para o funcionamento do app: 
                  nome, email e skateparks favoritos.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">🛡️ Proteção</h4>
                <p>
                  Seus dados são criptografados e armazenados com segurança. 
                  Não compartilhamos informações com terceiros.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">👶 Idade Mínima</h4>
                <p>
                  Este serviço é destinado a usuários de 12 anos ou mais. 
                  Menores de idade devem ter autorização dos responsáveis.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">✅ Seus Direitos</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Acessar seus dados a qualquer momento</li>
                  <li>Solicitar correção de informações</li>
                  <li>Excluir sua conta e dados</li>
                                    <li>Portabilidade dos dados</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">📧 Contato</h4>
                <p>
                  Para exercer seus direitos ou tirar dúvidas sobre privacidade, 
                  entre em contato conosco através do app.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => {
                  setAcceptedLGPD(true);
                  setShowLGPDModal(false);
                }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl"
              >
                ✅ Aceito os Termos
              </button>
              
              <button
                onClick={() => setShowLGPDModal(false)}
                className="w-full bg-white/10 border border-white/20 text-white font-medium py-3 rounded-xl"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Decoration */}
      <div className="px-4 pb-8">
        <div className="text-center">
          <div className="flex justify-center space-x-4 text-2xl mb-4">
            <span className="animate-bounce delay-0">🛹</span>
            <span className="animate-bounce delay-100">🔥</span>
            <span className="animate-bounce delay-200">⚡</span>
          </div>
          <p className="text-white/50 text-xs">
            Skate App © 2025 - Sua pista digital
          </p>
        </div>
      </div>
    </div>
  );
};