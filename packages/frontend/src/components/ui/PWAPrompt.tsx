import React from 'react';
import { usePWA } from '../../hooks/usePWA';
import { Download, RefreshCw, X } from 'lucide-react';
import { clsx } from 'clsx';

export const PWAPrompt: React.FC = () => {
  const { isInstallable, isInstalled, updateAvailable, installApp, updateApp } = usePWA();
  const [showInstallPrompt, setShowInstallPrompt] = React.useState(true);
  const [showUpdatePrompt, setShowUpdatePrompt] = React.useState(true);

  if (isInstalled && !updateAvailable) {
    return null;
  }

  if (updateAvailable && showUpdatePrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-xl shadow-lg border border-purple-500/20 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex-shrink-0">
                <RefreshCw className="w-6 h-6 text-purple-200" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm">Atualização Disponível</h3>
                <p className="text-xs text-purple-200 mt-1">
                  Nova versão do app disponível
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowUpdatePrompt(false)}
              className="flex-shrink-0 text-purple-200 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={updateApp}
              className="flex-1 bg-white text-purple-600 px-3 py-2 rounded-lg font-medium text-sm hover:bg-purple-50 transition-colors flex items-center justify-center space-x-1"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Atualizar</span>
            </button>
            <button
              onClick={() => setShowUpdatePrompt(false)}
              className="px-3 py-2 text-purple-200 hover:text-white transition-colors text-sm"
            >
              Depois
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isInstallable && showInstallPrompt && !isInstalled) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-xl shadow-lg border border-purple-500/20 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex-shrink-0">
                <div className="text-2xl">🛹</div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm">Instalar Skate App</h3>
                <p className="text-xs text-purple-200 mt-1">
                  Adicione à tela inicial para acesso rápido
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="flex-shrink-0 text-purple-200 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={installApp}
              className="flex-1 bg-white text-purple-600 px-3 py-2 rounded-lg font-medium text-sm hover:bg-purple-50 transition-colors flex items-center justify-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>Instalar</span>
            </button>
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="px-3 py-2 text-purple-200 hover:text-white transition-colors text-sm"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};