import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Tutorial {
  id: string;
  title: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: string;
  description: string;
  videoUrl?: string;
  steps: string[];
}

const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Ollie',
    difficulty: 'Iniciante',
    duration: '5 min',
    description: 'A manobra fundamental do skate. Aprenda a base de tudo!',
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
    title: 'Manual',
    difficulty: 'Iniciante',
    duration: '4 min',
    description: 'Equilibre-se apenas nas rodas traseiras. Essencial para combos!',
    steps: [
      'Ganhe velocidade moderada',
      'Posicione os pés: traseiro na tail, dianteiro no meio',
      'Transfira o peso para trás gradualmente',
      'Levante o nose do chão',
      'Use os braços para equilibrar',
      'Mantenha a posição o máximo possível',
      'Volte à posição normal suavemente'
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
      case 'Iniciante': return 'bg-green-100 text-green-800';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800';
      case 'Avançado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              ← Voltar
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">📚 Tutoriais</h1>
          </div>
          <p className="text-gray-600">
            Aprenda novas manobras com nossos tutoriais passo a passo
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar - Lista de Tutoriais */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Manobras
              </h2>

              {/* Filter */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setFilter(diff)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filter === diff
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tutorial List */}
              <div className="space-y-3">
                {filteredTutorials.map((tutorial) => (
                  <button
                    key={tutorial.id}
                    onClick={() => setSelectedTutorial(tutorial)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedTutorial?.id === tutorial.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{tutorial.title}</h3>
                      <span className="text-xs text-gray-500">{tutorial.duration}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{tutorial.description}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                      {tutorial.difficulty}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Tutorial Details */}
          <div className="lg:col-span-2">
            {selectedTutorial ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedTutorial.title}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedTutorial.difficulty)}`}>
                      {selectedTutorial.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{selectedTutorial.description}</p>
                  <div className="text-sm text-gray-500">
                    ⏱️ Duração: {selectedTutorial.duration}
                  </div>
                </div>

                {/* Video Placeholder */}
                <div className="bg-gray-100 rounded-lg p-8 mb-6 text-center">
                  <div className="text-4xl mb-4">🎥</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Vídeo Tutorial
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Vídeo demonstrativo da manobra {selectedTutorial.title}
                  </p>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    ▶️ Assistir Vídeo
                  </button>
                </div>

                {/* Steps */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📝 Passo a Passo
                  </h3>
                  <div className="space-y-4">
                    {selectedTutorial.steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-gray-700">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex space-x-4">
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    ✅ Marcar como Aprendida
                  </button>
                  <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    ⭐ Adicionar aos Favoritos
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Selecione um Tutorial
                </h3>
                <p className="text-gray-600">
                  Escolha uma manobra na lista ao lado para ver o tutorial completo
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};