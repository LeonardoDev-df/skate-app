#!/bin/bash

echo "🛹 Configurando Skate App..."

# Instalar dependências da raiz
echo "📦 Instalando dependências principais..."
npm install

# Setup frontend
echo "⚛️ Configurando frontend..."
cd packages/frontend
npm install
cd ../..

# Setup backend
echo "🚀 Configurando backend..."
cd packages/backend
npm install
cp .env.example .env
cd ../..

# Setup shared
echo "📚 Configurando shared..."
cd packages/shared
npm install
npm run build
cd ../..

echo "✅ Setup concluído!"
echo ""
echo "🚀 Para rodar o projeto:"
echo "   npm run dev"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo "📚 API Docs: http://localhost:3001/api/docs"