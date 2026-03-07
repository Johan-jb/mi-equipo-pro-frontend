import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Carlos Rodríguez',
      role: 'Director Técnico, Club El Trebol',
      content: 'SportMetrics Pro revolucionó la forma en que seguimos el rendimiento de nuestros juveniles. Los padres están encantados de poder ver el progreso de sus hijos.',
      rating: 5,
      initial: 'CR'
    },
    {
      name: 'Martina González',
      role: 'Preparadora Física',
      content: 'Las evaluaciones de habilidades y los gráficos de evolución me permiten ajustar las cargas de entrenamiento de forma personalizada para cada jugador.',
      rating: 5,
      initial: 'MG'
    },
    {
      name: 'Juan Pérez',
      role: 'Padre de Lucas (13 años)',
      content: 'Poder ver los videos de los goles de mi hijo y sus evaluaciones mensuales me hace sentir parte de su desarrollo. ¡Gracias SportMetrics!',
      rating: 5,
      initial: 'JP'
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className="text-yellow-400 text-xl">★</span>
    ));
  };

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Título de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Clubes, entrenadores y padres ya confían en SportMetrics Pro para el seguimiento deportivo.
          </p>
        </div>

        {/* Grid de testimonios */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              {/* Avatar con iniciales */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.initial}
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              {/* Estrellas */}
              <div className="flex mb-3">
                {renderStars(testimonial.rating)}
              </div>

              {/* Contenido */}
              <p className="text-gray-600 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>

        {/* Estadísticas de confianza */}
        <div className="mt-16 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600">50+</div>
            <div className="text-gray-600">Clubes activos</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">500+</div>
            <div className="text-gray-600">Jugadores</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">1000+</div>
            <div className="text-gray-600">Evaluaciones</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">4.9/5</div>
            <div className="text-gray-600">Valoración</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;