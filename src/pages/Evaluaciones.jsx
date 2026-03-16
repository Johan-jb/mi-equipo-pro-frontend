import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import ModalNuevaEvaluacion from '../components/ModalNuevaEvaluacion';
import ModalEditarEvaluacion from '../components/ModalEditarEvaluacion';
import ModalConfirmarEliminar from '../components/ModalConfirmarEliminar';
import ModalHabilidades from '../components/ModalHabilidades'; // 👈 NUEVO IMPORT

function Evaluaciones() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jugador, setJugador] = useState(null);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [habilidades, setHabilidades] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNuevaModal, setShowNuevaModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [evaluacionSeleccionada, setEvaluacionSeleccionada] = useState(null);
  const [showHabilidadesModal, setShowHabilidadesModal] = useState(false); // 👈 NUEVO STATE

  const user = JSON.parse(localStorage.getItem('user'));
  const puedeEditar = user?.rol === 'admin' || user?.rol === 'dt' || user?.rol === 'preparador';

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      const [jugadorRes, evalRes, habRes] = await Promise.all([
        api.get(`/jugadores/${id}`),
        api.get(`/evaluaciones/jugador/${id}`),
        api.get(`/habilidades/ultima/${id}`).catch(() => ({ data: { habilidad: null } }))
      ]);

      setJugador(jugadorRes.data.jugador);
      setEvaluaciones(evalRes.data.evaluaciones);
      setHabilidades(habRes.data.habilidad);
    } catch (err) {
      setError('Error al cargar las evaluaciones');
    } finally {
      setLoading(false);
    }
  };

  // 👇 NUEVA FUNCIÓN
  const handleHabilidadesCargadas = (nuevasHabilidades) => {
    setHabilidades(nuevasHabilidades);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const descargarPDF = async () => {
    try {
      const response = await api.get(`/informes/jugador/${id}/pdf`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `informe_${jugador.nombre}_${jugador.apellido}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando PDF:', error);
      alert('Error al descargar el PDF');
    }
  };

  const handleEditarClick = (evaluacion) => {
    setEvaluacionSeleccionada(evaluacion);
    setShowEditarModal(true);
  };

  const handleEliminarClick = (evaluacion) => {
    setEvaluacionSeleccionada(evaluacion);
    setShowEliminarModal(true);
  };

  const handleEliminarConfirmado = async () => {
    try {
      await api.delete(`/evaluaciones/${evaluacionSeleccionada.id_evaluacion}`);
      setEvaluaciones(evaluaciones.filter(e => e.id_evaluacion !== evaluacionSeleccionada.id_evaluacion));
      setShowEliminarModal(false);
      setEvaluacionSeleccionada(null);
    } catch (error) {
      alert('Error al eliminar la evaluación');
    }
  };

  const handleEvaluacionActualizada = (evaluacionActualizada) => {
    setEvaluaciones(evaluaciones.map(e => 
      e.id_evaluacion === evaluacionActualizada.id_evaluacion ? evaluacionActualizada : e
    ));
  };

  const datosGrafico = evaluaciones.map(e => ({
    fecha: new Date(e.fecha_evaluacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
    goles: e.goles,
    asistencias: e.asistencias,
    precision: e.precision_pases || 0
  })).reverse();

  const barraProgreso = (valor) => {
    const porcentaje = valor * 10;
    let colorBarra = 'bg-blue-600';
    if (porcentaje < 50) colorBarra = 'bg-red-500';
    else if (porcentaje < 70) colorBarra = 'bg-yellow-500';
    else colorBarra = 'bg-green-500';

    return (
      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${colorBarra}`} style={{ width: `${porcentaje}%` }}></div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-blue-600">📊 SportMetrics Pro</div>
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
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {jugador.nombre} {jugador.apellido}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{jugador.posicion_principal}</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">{jugador.edad} años</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">{jugador.pierna_habil}</span>
                  </div>
                </div>
                <button
                  onClick={descargarPDF}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
                >
                  <span>📄</span> Descargar Informe PDF
                </button>
              </div>
            </div>

            {habilidades && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Diagnóstico Inicial</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <span className="text-gray-600">Reacción:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-gray-700">{habilidades.reaccion * 10}%</span>
                      {barraProgreso(habilidades.reaccion)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Equilibrio:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-gray-700">{habilidades.equilibrio * 10}%</span>
                      {barraProgreso(habilidades.equilibrio)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Velocidad:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-gray-700">{habilidades.velocidad * 10}%</span>
                      {barraProgreso(habilidades.velocidad)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Fuerza:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-gray-700">{habilidades.fuerza * 10}%</span>
                      {barraProgreso(habilidades.fuerza)}
                    </div>
                  </div>
                </div>
              </div>
            )}

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

            <div className="mb-6 flex justify-end gap-4"> {/* 👈 Agregué gap-4 para separar botones */}
              <button
                onClick={() => setShowHabilidadesModal(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
              >
                <span className="text-xl">📊</span> Diagnóstico Inicial
              </button>
              <button
                onClick={() => setShowNuevaModal(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
              >
                <span className="text-xl">+</span> Nueva Evaluación
              </button>
            </div>

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
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {formatearFecha(evaluacion.fecha_evaluacion)}
                      </h3>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Partido</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-blue-600">{evaluacion.goles}</div>
                        <div className="text-sm text-gray-600">Goles</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-green-600">{evaluacion.asistencias}</div>
                        <div className="text-sm text-gray-600">Asistencias</div>
                      </div>
                      {evaluacion.precision_pases && (
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-purple-600">{evaluacion.precision_pases}%</div>
                          <div className="text-sm text-gray-600">Precisión pases</div>
                        </div>
                      )}
                      {evaluacion.porcentaje_duelos_ganados && (
                        <div className="bg-orange-50 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-orange-600">{Math.round(evaluacion.porcentaje_duelos_ganados)}%</div>
                          <div className="text-sm text-gray-600">Duelos ganados</div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      {evaluacion.minutos_jugados && <div>⏱️ Minutos: {evaluacion.minutos_jugados}</div>}
                      {evaluacion.distancia_recorrida_km && <div>📏 Distancia: {evaluacion.distancia_recorrida_km} km</div>}
                      {evaluacion.velocidad_maxima_kmh && <div>⚡ Vel. máx: {evaluacion.velocidad_maxima_kmh} km/h</div>}
                      {evaluacion.precision_remates && <div>🎯 Remates: {evaluacion.precision_remates}%</div>}
                    </div>

                    {evaluacion.observaciones && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 italic">
                          "{evaluacion.observaciones.destacar || JSON.stringify(evaluacion.observaciones)}"
                        </p>
                      </div>
                    )}

                    {/* Botones de acción para evaluaciones */}
                    {puedeEditar && (
                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          onClick={() => handleEditarClick(evaluacion)}
                          className="text-yellow-600 hover:text-yellow-800 text-sm flex items-center gap-1"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleEliminarClick(evaluacion)}
                          className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modales */}
      {showNuevaModal && (
        <ModalNuevaEvaluacion
          jugadorId={id}
          onClose={() => setShowNuevaModal(false)}
          onEvaluacionCreada={(nuevaEvaluacion) => {
            setEvaluaciones([nuevaEvaluacion, ...evaluaciones]);
            setShowNuevaModal(false);
          }}
        />
      )}

      {showEditarModal && evaluacionSeleccionada && (
        <ModalEditarEvaluacion
          evaluacion={evaluacionSeleccionada}
          onClose={() => {
            setShowEditarModal(false);
            setEvaluacionSeleccionada(null);
          }}
          onEvaluacionActualizada={handleEvaluacionActualizada}
        />
      )}

      {showEliminarModal && evaluacionSeleccionada && (
        <ModalConfirmarEliminar
          jugador={evaluacionSeleccionada}
          onConfirm={handleEliminarConfirmado}
          onCancel={() => {
            setShowEliminarModal(false);
            setEvaluacionSeleccionada(null);
          }}
        />
      )}

      {/* 👇 NUEVO MODAL DE HABILIDADES */}
      {showHabilidadesModal && (
        <ModalHabilidades
          jugadorId={id}
          onClose={() => setShowHabilidadesModal(false)}
          onHabilidadesCargadas={handleHabilidadesCargadas}
        />
      )}
    </div>
  );
}

export default Evaluaciones;