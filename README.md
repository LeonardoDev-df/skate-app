# 🛹 Skate App - Documentação Completa

## 📋 Índice
- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração](#-configuração)
- [Desenvolvimento](#-desenvolvimento)
- [API Reference](#-api-reference)
- [Deploy](#-deploy)
- [Troubleshooting](#-troubleshooting)

---

## �� Visão Geral

O **Skate App** é uma aplicação web moderna construída com **monorepo** que combina gamificação com mapas interativos para skatistas. O projeto utiliza tecnologias de ponta para criar uma experiência imersiva e educativa.

### 🚀 Tecnologias Principais

| Componente | Tecnologia | Versão |
|------------|------------|--------|
| **Frontend** | React + TypeScript + Vite | ^18.0.0 |
| **Backend** | NestJS + TypeScript | ^10.0.0 |
| **Database** | Firebase | Latest |
| **Monorepo** | Turborepo | ^1.0.0 |
| **Styling** | CSS Modules / Styled Components | - |

### 🎮 Funcionalidades

- 🗺️ **Mapas Interativos** - Navegação em tempo real
- 🎯 **Sistema de Gamificação** - Pontuação e conquistas
- 👤 **Autenticação** - Login seguro com Firebase
- 📚 **Tutoriais** - Guias passo a passo
- 🏆 **Ranking** - Sistema de classificação
- 📱 **Responsivo** - Compatível com mobile

---

## 🏗️ Arquitetura

```mermaid
graph TB
    A[Frontend - React] --> B[Backend - NestJS]
    B --> C[Firebase Auth]
    B --> D[Firebase Database]
    E[Shared Types] --> A
    E --> B
    F[Turborepo] --> A
    F --> B
    F --> E

📦 Estrutura de Monorepo
skate-app/
├── packages/
│   ├── frontend/          # Aplicação React
│   ├── backend/           # API NestJS
│   └── shared/            # Tipos compartilhados
├── turbo.json             # Configuração Turborepo
└── package.json           # Dependências raiz
📁 Estrutura do Projeto
🎨 Frontend (packages/frontend/)
frontend/
├── public/                # Arquivos estáticos
├── src/
│   ├── components/        # Componentes React
│   │   ├── auth/         # Componentes de autenticação
│   │   ├── game/         # Componentes do jogo
│   │   ├── layout/       # Layout da aplicação
│   │   ├── map/          # Componentes de mapa
│   │   └── ui/           # Componentes de UI
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Páginas da aplicação
│   ├── services/         # Serviços de API
│   ├── store/            # Estado global
│   ├── types/            # Tipos TypeScript
│   ├── utils/            # Utilitários
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Entry point
│   └── index.css         # Estilos globais
├── index.html            # Template HTML
├── package.json          # Dependências
├── tsconfig.json         # Config TypeScript
└── vite.config.ts        # Config Vite
⚙️ Backend (packages/backend/)
backend/
├── src/
│   ├── auth/             # Módulo de autenticação
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── common/           # Recursos compartilhados
│   │   ├── decorators/   # Decorators customizados
│   │   ├── filters/      # Exception filters
│   │   ├── guards/       # Guards de autenticação
│   │   ├── interceptors/ # Interceptors
│   │   └── pipes/        # Validation pipes
│   ├── config/           # Configurações
│   │   └── firebase.config.ts
│   ├── database/         # Módulo de banco
│   ├── game/             # Módulo do jogo
│   ├── map/              # Módulo de mapas
│   ├── tutorial/         # Módulo de tutoriais
│   ├── user/             # Módulo de usuários
│   ├── app.controller.ts # Controller principal
│   ├── app.module.ts     # Módulo principal
│   ├── app.service.ts    # Service principal
│   └── main.ts           # Entry point
├── dist/                 # Arquivos compilados
├── nest-cli.json         # Config NestJS CLI
├── package.json          # Dependências
├── tsconfig.json         # Config TypeScript
└── tsconfig.build.json   # Config build
🔗 Shared (packages/shared/)
shared/
├── src/
│   ├── types/            # Tipos compartilhados
│   │   ├── game.types.ts # Tipos do jogo
│   │   └── user.types.ts # Tipos de usuário
│   └── index.ts          # Exports principais
├── package.json          # Dependências
└── tsconfig.json         # Config TypeScript
⚙️ Configuração
🔧 Pré-requisitos
bash
Copiar

# Node.js (versão 18+)
node --version

# pnpm (recomendado)
npm install -g pnpm

# Git
git --version
📥 Instalação
bash
Copiar

# 1. Clonar repositório
git clone <repository-url>
cd skate-app

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
🔐 Variáveis de Ambiente
.env:

env
Copiar

# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef

# Backend Configuration
PORT=3001
NODE_ENV=development

# Frontend Configuration
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=your_api_key
🔥 Configuração Firebase
Criar projeto no Firebase Console
Ativar Authentication
Configurar Firestore Database
Obter credenciais do projeto
🚀 Desenvolvimento
📜 Scripts Disponíveis
bash
Copiar

# Instalar dependências
pnpm install

# Desenvolvimento (todos os pacotes)
pnpm dev

# Desenvolvimento (frontend apenas)
pnpm dev:frontend

# Desenvolvimento (backend apenas)
pnpm dev:backend

# Build (todos os pacotes)
pnpm build

# Build (frontend apenas)
pnpm build:frontend

# Build (backend apenas)
pnpm build:backend

# Testes
pnpm test

# Linting
pnpm lint

# Formatação
pnpm format
🔄 Fluxo de Desenvolvimento
bash
Copiar

# 1. Iniciar desenvolvimento
pnpm dev

# 2. Acessar aplicações
# Frontend: http://localhost:5173
# Backend: http://localhost:3001
# API Docs: http://localhost:3001/api

# 3. Hot reload ativo em ambos
🧪 Estrutura de Testes
bash
Copiar

# Frontend
packages/frontend/src/__tests__/
├── components/
├── hooks/
├── services/
└── utils/

# Backend
packages/backend/src/**/*.spec.ts
📡 API Reference
🔐 Autenticação
typescript
Copiar

// POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "access_token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "displayName": "User Name"
  }
}
👤 Usuários
typescript
Copiar

// GET /users/profile
Authorization: Bearer <token>

// Response
{
  "id": "user_id",
  "email": "user@example.com",
  "displayName": "User Name",
  "level": 5,
  "points": 1250
}
🎮 Game
typescript
Copiar

// GET /game/status
Authorization: Bearer <token>

// Response
{
  "currentLevel": 3,
  "points": 750,
  "achievements": ["first_trick", "speed_demon"],
  "progress": {
    "tutorials": 5,
    "maps": 3
  }
}
🗺️ Maps
typescript
Copiar

// GET /maps
// Response
[
  {
    "id": "map_1",
    "name": "Downtown Skate Park",
    "difficulty": "beginner",
    "points": [
      { "lat": -23.5505, "lng": -46.6333 }
    ]
  }
]
🎨 Componentes Frontend
🧩 Componentes Principais
AuthForm
typescript
Copiar

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: AuthData) => void;
  loading?: boolean;
}
GameMap
typescript
Copiar

interface GameMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers: MapMarker[];
  onMarkerClick: (marker: MapMarker) => void;
}
TutorialStep
typescript
Copiar

interface TutorialStepProps {
  step: number;
  title: string;
  content: string;
  onNext: () => void;
  onPrev: () => void;
}
🎣 Custom Hooks
typescript
Copiar

// useAuth
const { user, login, logout, loading } = useAuth();

// useGame
const { level, points, achievements } = useGame();

// useMap
const { currentPosition, markers, updatePosition } = useMap();
🏗️ Deploy
🐳 Docker
Dockerfile:

dockerfile
Copiar

# Frontend
FROM node:18-alpine as frontend
WORKDIR /app
COPY packages/frontend/ .
RUN pnpm install && pnpm build

# Backend
FROM node:18-alpine as backend
WORKDIR /app
COPY packages/backend/ .
RUN pnpm install && pnpm build

# Production
FROM nginx:alpine
COPY --from=frontend /app/dist /usr/share/nginx/html
COPY --from=backend /app/dist /app/backend
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
☁️ Vercel (Frontend)
bash
Copiar

# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod

# 3. Configurar variáveis de ambiente
vercel env add VITE_API_URL
🚀 Railway (Backend)
bash
Copiar

# 1. Conectar repositório
railway login
railway link

# 2. Deploy
railway up

# 3. Configurar variáveis
railway variables set NODE_ENV=production
🔧 Troubleshooting
❌ Problemas Comuns
Firebase não conecta
bash
Copiar

# Verificar configuração
echo $FIREBASE_API_KEY

# Verificar regras do Firestore
# Firestore Rules devem permitir read/write autenticado
CORS Error
typescript
Copiar

// backend/src/main.ts
app.enableCors({
  origin: ['http://localhost:5173', 'https://your-domain.com'],
  credentials: true,
});
TypeScript Errors
bash
Copiar

# Limpar cache
pnpm clean
rm -rf node_modules
pnpm install

# Verificar tipos compartilhados
cd packages/shared
pnpm build
🔍 Debug
bash
Copiar

# Logs do backend
pnpm dev:backend --verbose

# Logs do frontend
pnpm dev:frontend --debug

# Verificar build
pnpm build --verbose
📊 Métricas e Monitoramento
📈 Performance
typescript
Copiar

// Frontend - Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
📝 Logs
typescript
Copiar

// Backend - Structured Logging
import { Logger } from '@nestjs/common';

const logger = new Logger('GameService');
logger.log('Game started', { userId, level });
logger.error('Game error', { error, context });
🤝 Contribuição
🔄 Git Workflow
bash
Copiar

# 1. Criar branch
git checkout -b feature/nova-funcionalidade

# 2. Fazer commits
git add .
git commit -m "feat: adicionar nova funcionalidade"

# 3. Push e PR
git push origin feature/nova-funcionalidade
📝 Commit Convention
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: manutenção
�� Suporte
📧 Email: dev@skateapp.com
💬 Discord: 

discord.gg
🐛 Issues: 

github.com
📖 Wiki: 

github.com
📄 Licença
MIT License - veja LICENSE para detalhes.

Última atualização: 09/09/2025 Versão: 1.0.0 Mantenedor: 

github.com


## 📜 **Script para Gerar Documentação**

**`scripts/generate-docs.sh`:**

```bash
#!/bin/bash

echo "📚 Gerando documentação do Skate App..."

# Criar documentação principal
cat > DOCUMENTATION.md << 'EOF'
# 🛹 Skate App - Documentação

[Conteúdo da documentação acima]
EOF

# Gerar README atualizado
cat > README.md << 'EOF'
# 🛹 Skate App

> Aplicação web gamificada para skatistas com mapas interativos

## 🚀 Quick Start

```bash
pnpm install
pnpm dev
📚 Documentação
Veja DOCUMENTATION.md para documentação completa.

🏗️ Arquitetura
Frontend: React + TypeScript + Vite
Backend: NestJS + TypeScript
Database: Firebase
Monorepo: Turborepo
�� Estrutura
skate-app/
├── packages/
│   ├── frontend/     # React App
│   ├── backend/      # NestJS API
│   └── shared/       # Shared Types
└── docs/            # Documentation
🤝 Contribuição
Fork o projeto
Crie sua branch (git checkout -b feature/nova-funcionalidade)
Commit suas mudanças (git commit -m 'feat: adicionar nova funcionalidade')
Push para a branch (git push origin feature/nova-funcionalidade)
Abra um Pull Request
📄 Licença
MIT - veja LICENSE para detalhes. EOF

echo "✅ Documentação gerada!" echo "📄 DOCUMENTATION.md - Documentação completa" echo "📄 README.md - README atualizado"


## 🔧 **Executar:**

```bash
chmod +x scripts/generate-docs.sh
./scripts/generate-docs.sh
