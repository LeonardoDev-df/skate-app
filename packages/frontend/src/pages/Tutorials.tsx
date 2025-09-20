import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Tutorial {
  id: string;
  title: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: string;
  description: string;
  videoUrl: string;
  steps: string[];
}

const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Ollie',
    difficulty: 'Iniciante',
    duration: '5 min',
    description: 'A manobra fundamental do skate. Aprenda a base de tudo!',
    videoUrl: 'https://www.youtube.com/embed/QkeOAcj8Y5k', // Braille Skateboarding - How to Ollie
    steps: [
      'Posicione o pé traseiro na tail do skate',
      'Pé da frente no meio do shape',
      'Flexione os joelhos e prepare-se para pular',
      'Bata a tail no chão com força',
      'Puxe o pé da frente para cima e para frente',
      'Nivele o skate no ar',
      'Prepare-se para aterrissar'
    ]
  },
  {
    id: '2',
    title: 'Kickflip',
    difficulty: 'Intermediário',
    duration: '8 min',
    description: 'Evolução do ollie com giro do skate. Manobra clássica!',
    videoUrl: 'https://www.youtube.com/embed/Islzjx93Mmc', // VLSkate - How to Kickflip
    steps: [
      'Domine o ollie primeiro',
      'Posicione o pé da frente mais diagonal',
      'Execute o ollie normalmente',
      'No momento do slide, faça um movimento de "kick"',
      'Deixe o skate girar completamente',
      'Catch com os dois pés',
      'Aterrisse com estilo'
    ]
  },
  {
    id: '3',
    title: 'Heelflip',
    difficulty: 'Intermediário',
    duration: '7 min',
    description: 'Giro do skate usando o calcanhar. Alternativa ao kickflip!',
    videoUrl: 'https://www.youtube.com/embed/tTnM_hq9J7w', // Braille Skateboarding - How to Heelflip
    steps: [
      'Domine o ollie primeiro',
      'Posicione o pé da frente mais para o lado',
      'Execute o ollie normalmente',
      'Use o calcanhar para fazer o skate girar',
      'Aguarde o giro completo',
      'Catch com os dois pés',
      'Aterrisse suavemente'
    ]
  },
  {
    id: '4',
    title: 'Pop Shove-it',
    difficulty: 'Iniciante',
    duration: '6 min',
    description: 'Giro de 180° do skate sem flip. Ótima para iniciantes!',
    videoUrl: 'https://www.youtube.com/embed/uaVQBXmkp-4', // Braille Skateboarding - How to Pop Shuvit
    steps: [
      'Posicione os pés como no ollie',
      'Pé traseiro um pouco mais para o lado',
      'Execute um ollie baixo',
      'Empurre a tail para trás e para o lado',
      'Deixe o skate girar 180°',
      'Catch quando completar o giro',
      'Aterrisse com os dois pés'
    ]
  },
  {
    id: '5',
    title: 'Manual',
    difficulty: 'Iniciante',
    duration: '4 min',
    description: 'Equilibre-se apenas nas rodas traseiras. Essencial para combos!',
    videoUrl: 'https://www.youtube.com/embed/ZJFlSlmBNQE', // Braille Skateboarding - How to Manual
    steps: [
      'Ganhe velocidade moderada',
      'Posicione os pés: traseiro na tail, dianteiro no meio',
      'Transfira o peso para trás gradualmente',
      'Levante o nose do chão',
      'Use os braços para equilibrar',
      'Mantenha a posição o máximo possível',
      'Volte à posição normal suavemente'
    ]
  },
  {
    id: '6',
    title: '360 Flip (Tre-flip)',
    difficulty: 'Avançado',
    duration: '12 min',
    description: 'Combinação de 360 shove-it com kickflip. Manobra icônica!',
    videoUrl: 'https://www.youtube.com/embed/jmCqmM9yrQE', // VLSkate - How to 360 Flip
    steps: [
      'Domine kickflip e 360 shove-it separadamente',
      'Posição dos pés específica para tre-flip',
      'Execute um ollie forte',
      'Combine o movimento de kick com o shove',
      'Aguarde o giro completo (360° + flip)',
      'Identifique o momento do catch',
      'Aterrisse com precisão'
    ]
  }
];

export const Tutorials: React.FC = () => {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [filter, setFilter] = useState<string>('Todos');

  const difficulties = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'];

  const filteredTutorials = filter === 'Todos' 
    ? tutorials 
    : tutorials.filter(t => t.difficulty === filter);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-500/20 text-green-200 border border-green-500/50';
      case 'Intermediário': return 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/50';
      case 'Avançado': return 'bg-red-500/20 text-red-200 border border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-200 border border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to="/" 
              className="text-white/70 hover:text-white transition-colors flex items-center space-x-2"
            >
              <span>←</span>
              <span>Voltar</span>
            </Link>
            <div className="text-center">
              <div className="text-2xl">📚</div>
            </div>
            <div className="w-16"></div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Tutoriais</h1>
            <p className="text-purple-200 text-sm">
              Aprenda novas manobras com vídeos do YouTube
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
          <h2 className="text-white font-medium mb-3 text-sm">🎯 Dificuldade</h2>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setFilter(diff)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  filter === diff
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Tutoriais */}
        <div className="space-y-4 mb-6">
          {filteredTutorials.map((tutorial) => (
            <button
              key={tutorial.id}
              onClick={() => setSelectedTutorial(tutorial)}
              className={`w-full text-left p-4 rounded-2xl transition-all ${
                selectedTutorial?.id === tutorial.id
                  ? 'bg-white/20 border border-purple-500/50'
                  : 'bg-white/10 hover:bg-white/15'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-3xl flex-shrink-0">🛹</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white text-sm">{tutorial.title}</h3>
                    <span className="text-xs text-white/70">{tutorial.duration}</span>
                  </div>
                  <p className="text-white/70 text-xs mb-2">{tutorial.description}</p>
                  <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                    {tutorial.difficulty}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Tutorial Selecionado */}
        {selectedTutorial && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-white">
                  {selectedTutorial.title}
                </h2>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(selectedTutorial.difficulty)}`}>
                  {selectedTutorial.difficulty}
                </span>
              </div>
              <p className="text-white/70 text-sm mb-2">{selectedTutorial.description}</p>
              <div className="text-xs text-white/50">
                ⏱️ Duração: {selectedTutorial.duration}
              </div>
            </div>

            {/* Vídeo do YouTube */}
            <div className="mb-6">
              <div className="bg-black rounded-xl overflow-hidden">
                <iframe
                  width="100%"
                  height="200"
                  src={selectedTutorial.videoUrl}
                  title={`Tutorial: ${selectedTutorial.title}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full"
                ></iframe>
              </div>
            </div>

            {/* Passo a Passo */}
            <div>
              <h3 className="text-white font-medium mb-3 text-sm">�� Passo a Passo</h3>
              <div className="space-y-3">
                {selectedTutorial.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-white/70 text-sm">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="bg-green-600/20 border border-green-500/50 text-green-200 font-medium py-3 px-4 rounded-xl hover:bg-green-600/30 transition-colors text-sm">
                ✅ Aprendida
              </button>
              <button className="bg-yellow-600/20 border border-yellow-500/50 text-yellow-200 font-medium py-3 px-4 rounded-xl hover:bg-yellow-600/30 transition-colors text-sm">
                ⭐ Favoritar
              </button>
            </div>
          </div>
        )}

        {!selectedTutorial && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-lg font-bold text-white mb-2">
              Selecione um Tutorial
            </h3>
            <p className="text-white/70 text-sm">
              Escolha uma manobra acima para ver o vídeo e instruções
            </p>
          </div>
        )}

        {/* Bottom padding */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};