import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import NuevaEvaluacion from '../components/NuevaEvaluacion';
import BotonDescargarPDF from '../components/InformePDF';

function Evaluaciones() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jugador, setJugador] = useState(null);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      const [jugadorRes, evalRes] = await Promise.all([
        api.get(`/jugadores/${id}`),
        api.get(`/evaluaciones/jugador/${id}`)
      ]);
      setJugador(jugadorRes.data.jugador);
      setEvaluaciones(evalRes.data.evaluaciones);
    } catch (err) {
      setError('Error al cargar las evaluaciones');
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  // Preparar datos para el gráfico
  const datosGrafico = evaluaciones.map(e => ({
    fecha: formatFecha(e.fecha_evaluacion),
    goles: e.goles,
    asistencias: e.asistencias,
    precision: e.precision_pases || 0
  })).reverse();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-blue-600">⚽ Mi Equipo Pro</div>
            <button onClick={() => navigate(-1)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
              ← Volver
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {jugador && (
          <>
            {/* Header del jugador */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {jugador.nombre} {jugador.apellido}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{jugador.posicion_principal}</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">{jugador.edad} años</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">{jugador.pierna_habil}</span>
              </div>
            </div>

            {/* Gráfico de rendimiento */}
            {evaluaciones.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Evolución del rendimiento</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={datosGrafico}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="goles" stroke="#3b82f6" name="Goles" strokeWidth={2} />
                      <Line type="monotone" dataKey="asistencias" stroke="#10b981" name="Asistencias" strokeWidth={2} />
                      <Line type="monotone" dataKey="precision" stroke="#8b5cf6" name="Precisión %" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Botón para nueva evaluación */}
            <div className="mb-6 flex justify-end">
              <button 
                onClick={() => setShowForm(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
              >
                <span className="text-xl">+</span> Nueva Evaluación
              </button>
            </div>

            {/* Lista de evaluaciones */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Historial de Evaluaciones</h2>

            {evaluaciones.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <p className="text-gray-500 text-lg">No hay evaluaciones cargadas para este jugador</p>
                <p className="text-gray-400 mt-2">Hacé clic en "Nueva Evaluación" para comenzar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {evaluaciones.map((evaluacion) => (
                  <div key={evaluacion.id_evaluacion} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                    {/* Fecha */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {new Date(evaluacion.fecha_evaluacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Partido</span>
                    </div>

                    {/* Métricas en grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {/* Goles */}
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-blue-600">{evaluacion.goles}</div>
                        <div className="text-sm text-gray-600">Goles</div>
                      </div>

                      {/* Asistencias */}
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-green-600">{evaluacion.asistencias}</div>
                        <div className="text-sm text-gray-600">Asistencias</div>
                      </div>

                      {/* Precisión de pases */}
                      {evaluacion.precision_pases && (
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-purple-600">{evaluacion.precision_pases}%</div>
                          <div className="text-sm text-gray-600">Precisión pases</div>
                        </div>
                      )}

                      {/* Duelos ganados */}
                      {evaluacion.porcentaje_duelos_ganados && (
                        <div className="bg-orange-50 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-orange-600">{Math.round(evaluacion.porcentaje_duelos_ganados)}%</div>
                          <div className="text-sm text-gray-600">Duelos ganados</div>
                        </div>
                      )}
                    </div>

                    {/* Métricas adicionales */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      {evaluacion.minutos_jugados && (
                        <div>⏱️ Minutos: {evaluacion.minutos_jugados}</div>
                      )}
                      {evaluacion.distancia_recorrida_km && (
                        <div>📏 Distancia: {evaluacion.distancia_recorrida_km} km</div>
                      )}
                      {evaluacion.velocidad_maxima_kmh && (
                        <div>⚡ Vel. máx: {evaluacion.velocidad_maxima_kmh} km/h</div>
                      )}
                      {evaluacion.precision_remates && (
                        <div>🎯 Remates: {evaluacion.precision_remates}%</div>
                      )}
                    </div>

                    {/* Observaciones */}
                    {evaluacion.observaciones && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 italic">
                          "{evaluacion.observaciones.destacar || JSON.stringify(evaluacion.observaciones)}"
                        </p>
                      </div>
                    )}

                    {/* Botón PDF */}
                    <div className="mt-4 flex justify-end">
                      <BotonDescargarPDF jugador={jugador} evaluacion={evaluacion} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal del formulario */}
            {showForm && (
              <NuevaEvaluacion 
                jugadorId={id}
                onEvaluacionCreada={(nuevaEvaluacion) => {
                  setEvaluaciones([nuevaEvaluacion, ...evaluaciones]);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Evaluaciones;