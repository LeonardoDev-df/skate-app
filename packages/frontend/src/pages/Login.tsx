import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email.trim()) {
      setError('Email é obrigatório');
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Senha é obrigatória');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  // Função para login de teste
  const handleTestLogin = async () => {
    setEmail('leonardolopesborges@hotmail.com');
    setPassword('123456'); // Você precisará saber a senha real
    
    // Simular submit
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="relative overflow-hidden pt-12 pb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative text-center px-4">
          <div className="text-6xl mb-4 animate-pulse">🛹</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vindo de volta!
          </h1>
          <p className="text-purple-200">
            Entre na sua conta para continuar
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                📧 Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                🔒 Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                  required
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

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3">
                <p className="text-red-200 text-sm text-center">
                  ❌ {error}
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar 🚀'
              )}
            </button>

            {/* Test Login Button
            <button
              type="button"
              onClick={handleTestLogin}
              className="w-full bg-white/10 border border-white/20 text-white font-medium py-3 rounded-xl hover:bg-white/20 transition-colors"
            >
              🧪 Login de Teste (Leonardo)
            </button>
            */}
            

            {/* Forgot Password */}
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-purple-200 text-sm hover:text-white transition-colors"
              >
                Esqueceu sua senha? 🤔
              </Link>
            </div>
          </form>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mb-8">
          <p className="text-white/70 text-sm">
            Não tem uma conta?{' '}
            <Link
              to="/register"
              className="text-purple-300 font-medium hover:text-white transition-colors"
            >
              Cadastre-se aqui 📝
            </Link>
          </p>
        </div>
      </div>

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