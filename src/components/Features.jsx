import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '📊',
      title: 'Dashboard de Jugadores',
      description: 'Visualiza toda la información de tus jugadores en un solo lugar: edad, posición, pierna hábil y última evaluación.',
      color: 'blue'
    },
    {
      icon: '📈',
      title: 'Evaluaciones con Gráficos',
      description: 'Registra goles, asistencias y precisión. Visualiza la evolución con gráficos interactivos.',
      color: 'green'
    },
    {
      icon: '📄',
      title: 'Informes PDF',
      description: 'Genera informes profesionales de cada evaluación para compartir con padres y cuerpo técnico.',
      color: 'purple'
    },
    {
      icon: '📸',
      title: 'Galería Multimedia',
      description: 'Subí fotos y videos. Marcá como público o privado según el contenido.',
      color: 'yellow'
    },
    {
      icon: '👥',
      title: 'Múltiples Roles',
      description: 'Administradores, DT, preparadores y padres cada uno con su nivel de acceso.',
      color: 'red'
    },
    {
      icon: '⚡',
      title: 'Diagnóstico Inicial',
      description: 'Evaluá reacción, equilibrio, velocidad y fuerza en escala 0-100 con barras de progreso.',
      color: 'indigo'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Título de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Todo lo que necesitas para gestionar tu club
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            SportMetrics Pro combina tecnología y deporte para ofrecerte las herramientas 
            profesionales que llevarán tu club al siguiente nivel.
          </p>
        </div>

        {/* Grid de características */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border-2 ${getColorClasses(feature.color)} hover:shadow-lg transition`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Separador visual */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-6 py-3 rounded-full">
            <span className="text-blue-600 font-semibold">✓</span>
            <span className="text-gray-700">Y muchas más funcionalidades...</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;