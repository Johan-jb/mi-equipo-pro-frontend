import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ModalAgregarJugador from '../components/ModalAgregarJugador';

function Dashboard({ user, onLogout }) {
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const puedeCrear = user?.rol === 'admin' || user?.rol === 'dt';

  useEffect(() => {
    cargarJugadores();
  }, []);

  const cargarJugadores = async () => {
    try {
      const response = await api.get('/jugadores');
      setJugadores(response.data.jugadores);
    } catch (err) {
      setError('Error al cargar jugadores');
    } finally {
      setLoading(false);
    }
  };

  const handleJugadorCreado = (nuevoJugador) => {
    setJugadores([nuevoJugador, ...jugadores]);
  };

  const formatearFecha = (fechaString) => {
    if (!fechaString) return '';
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  };

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
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-blue-600">📊 SportMetrics Pro</div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Hola, {user?.nombre_completo}</span>
              <button
                onClick={() => window.location.href = '/mi-equipo-pro-frontend/#/multimedia'}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                📸 Multimedia
              </button>
              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Mis Jugadores</h1>

        {/* Botón para agregar jugador (solo visible para admin y dt) */}
        {puedeCrear && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
            >
              <span className="text-xl">+</span> Agregar Jugador
            </button>
          </div>
        )}

        {!loading && jugadores.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg">No hay jugadores cargados</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jugadores.map((jugador) => (
              <div key={jugador.id_jugador} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {jugador.nombre} {jugador.apellido}
                  </h3>
                  <p className="text-gray-600 mb-4">{jugador.posicion_principal}</p>
                  
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Edad:</span> {jugador.edad} años</p>
                    <p><span className="font-semibold">Pierna hábil:</span> {jugador.pierna_habil}</p>
                    {jugador.dni && <p><span className="font-semibold">DNI:</span> {jugador.dni}</p>}
                  </div>

                  {jugador.ultima_evaluacion ? (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-800 font-semibold mb-1">
                        📊 Último partido ({formatearFecha(jugador.ultima_evaluacion.fecha_evaluacion)})
                      </p>
                      <div className="flex justify-around text-center">
                        <div>
                          <span className="block text-lg font-bold text-blue-600">{jugador.ultima_evaluacion.goles}</span>
                          <span className="text-xs text-gray-500">Goles</span>
                        </div>
                        <div>
                          <span className="block text-lg font-bold text-green-600">{jugador.ultima_evaluacion.asistencias}</span>
                          <span className="text-xs text-gray-500">Asistencias</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                      <p className="text-xs text-gray-500">Sin evaluaciones aún</p>
                    </div>
                  )}

                  {jugador.habilidades ? (
                    <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs text-purple-800 font-semibold mb-2">📈 Diagnóstico inicial</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Reacción:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-700">{jugador.habilidades.reaccion * 10}%</span>
                            {barraProgreso(jugador.habilidades.reaccion)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Equilibrio:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-700">{jugador.habilidades.equilibrio * 10}%</span>
                            {barraProgreso(jugador.habilidades.equilibrio)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Velocidad:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-700">{jugador.habilidades.velocidad * 10}%</span>
                            {barraProgreso(jugador.habilidades.velocidad)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Fuerza:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-700">{jugador.habilidades.fuerza * 10}%</span>
                            {barraProgreso(jugador.habilidades.fuerza)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                      <p className="text-xs text-gray-500">Sin diagnóstico inicial</p>
                    </div>
                  )}

                  <div className="mt-4">
                    <Link 
                      to={`/evaluaciones/${jugador.id_jugador}`}
                      className="block text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Ver Evaluaciones
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para agregar jugador */}
      {showModal && (
        <ModalAgregarJugador
          onClose={() => setShowModal(false)}
          onJugadorCreado={handleJugadorCreado}
        />
      )}
    </div>
  );
}

export default Dashboard;