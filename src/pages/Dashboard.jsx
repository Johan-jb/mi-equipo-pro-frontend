import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ModalAgregarJugador from '../components/ModalAgregarJugador';
import ModalEditarJugador from '../components/ModalEditarJugador';
import ModalConfirmarEliminar from '../components/ModalConfirmarEliminar';

function Dashboard({ user, onLogout }) {
  const [jugadores, setJugadores] = useState([]);
  const [jugadoresFiltrados, setJugadoresFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  
  const puedeCrear = user?.rol === 'admin' || user?.rol === 'dt';
  const puedeEditar = user?.rol === 'admin' || user?.rol === 'dt';
  const puedeEliminar = user?.rol === 'admin' || user?.rol === 'dt';

  // Obtener datos del club desde el usuario
  const clubPlan = user?.club_plan || 'trial';
  const jugadoresMax = user?.jugadores_max || 30;
  const fechaExpiracionTrial = user?.fecha_expiracion_trial;

  // Calcular días restantes de trial
  const calcularDiasRestantes = () => {
    if (!fechaExpiracionTrial) return null;
    const hoy = new Date();
    const expiracion = new Date(fechaExpiracionTrial);
    const diffTime = expiracion - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  const diasRestantes = calcularDiasRestantes();

  useEffect(() => {
    cargarJugadores();
  }, []);

  useEffect(() => {
    filtrarJugadores();
  }, [searchTerm, jugadores]);

  const cargarJugadores = async () => {
    try {
      const response = await api.get('/jugadores');
      setJugadores(response.data.jugadores);
      setJugadoresFiltrados(response.data.jugadores);
    } catch (err) {
      setError('Error al cargar jugadores');
    } finally {
      setLoading(false);
    }
  };

  const filtrarJugadores = () => {
    if (!searchTerm.trim()) {
      setJugadoresFiltrados(jugadores);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const filtrados = jugadores.filter(jugador => 
      jugador.nombre.toLowerCase().includes(term) ||
      jugador.apellido.toLowerCase().includes(term) ||
      (jugador.dni && jugador.dni.includes(term))
    );
    setJugadoresFiltrados(filtrados);
  };

  const handleJugadorCreado = (nuevoJugador) => {
    setJugadores([nuevoJugador, ...jugadores]);
    setJugadoresFiltrados([nuevoJugador, ...jugadoresFiltrados]);
  };

  const handleEditarClick = (jugador) => {
    setJugadorSeleccionado(jugador);
    setShowEditarModal(true);
  };

  const handleJugadorActualizado = (jugadorActualizado) => {
    const nuevosJugadores = jugadores.map(j => 
      j.id_jugador === jugadorActualizado.id_jugador ? jugadorActualizado : j
    );
    setJugadores(nuevosJugadores);
    setJugadoresFiltrados(nuevosJugadores);
  };

  const handleEliminarClick = (jugador) => {
    setJugadorSeleccionado(jugador);
    setShowEliminarModal(true);
  };

  const handleEliminarConfirmado = async () => {
    try {
      await api.delete(`/jugadores/${jugadorSeleccionado.id_jugador}`);
      const nuevosJugadores = jugadores.filter(j => j.id_jugador !== jugadorSeleccionado.id_jugador);
      setJugadores(nuevosJugadores);
      setJugadoresFiltrados(nuevosJugadores);
      setShowEliminarModal(false);
      setJugadorSeleccionado(null);
    } catch (err) {
      alert('Error al eliminar jugador');
    }
  };

  const formatearFecha = (fechaString) => {
    if (!fechaString) return '';
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  };

  // NUEVA FUNCIÓN para formatear fecha de registro
  const formatearFechaRegistro = (fechaString) => {
    if (!fechaString) return 'Desconocida';
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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

        {/* TARJETA DE SUSCRIPCIÓN */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Estado de la suscripción</h2>
          
          {/* Barra de progreso de jugadores */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Jugadores: {jugadores.length} / {jugadoresMax}</span>
              <span>{Math.round((jugadores.length / jugadoresMax) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(jugadores.length / jugadoresMax) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Días restantes (si está en trial) */}
          {clubPlan === 'trial' && diasRestantes !== null && (
            <div className="mb-4 text-sm">
              <span className="font-semibold">Período de prueba:</span> {diasRestantes} días restantes
            </div>
          )}

          {/* Botón para ver planes y actualizar */}
          <button
            onClick={() => window.location.href = '/mi-equipo-pro-frontend/#/planes'}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full"
          >
            Ver planes y actualizar
          </button>
        </div>

        {/* Buscador */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Botón para agregar jugador */}
          {puedeCrear && (
            <button
              onClick={() => setShowAgregarModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
            >
              <span className="text-xl">+</span> Agregar Jugador
            </button>
          )}
        </div>

        {/* Resultado de búsqueda */}
        {searchTerm && (
          <div className="mb-4 text-sm text-gray-600">
            Se encontraron {jugadoresFiltrados.length} jugador(es) para "{searchTerm}"
          </div>
        )}

        {!loading && jugadoresFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No hay jugadores que coincidan con la búsqueda' : 'No hay jugadores cargados'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jugadoresFiltrados.map((jugador) => (
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
                    {/* 👇 NUEVA LÍNEA PARA MOSTRAR FECHA DE REGISTRO */}
                    <p><span className="font-semibold">Registrado:</span> {formatearFechaRegistro(jugador.fecha_creacion)}</p>
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

                  {/* Botones de acción (solo para admin/dt) */}
                  {puedeEditar && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleEditarClick(jugador)}
                        className="flex-1 bg-yellow-500 text-white py-2 rounded-lg text-sm hover:bg-yellow-600 transition flex items-center justify-center gap-1"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleEliminarClick(jugador)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600 transition flex items-center justify-center gap-1"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      {showAgregarModal && (
        <ModalAgregarJugador
          onClose={() => setShowAgregarModal(false)}
          onJugadorCreado={handleJugadorCreado}
        />
      )}

      {showEditarModal && jugadorSeleccionado && (
        <ModalEditarJugador
          jugador={jugadorSeleccionado}
          onClose={() => {
            setShowEditarModal(false);
            setJugadorSeleccionado(null);
          }}
          onJugadorActualizado={handleJugadorActualizado}
        />
      )}

      {showEliminarModal && jugadorSeleccionado && (
        <ModalConfirmarEliminar
          jugador={jugadorSeleccionado}
          onConfirm={handleEliminarConfirmado}
          onCancel={() => {
            setShowEliminarModal(false);
            setJugadorSeleccionado(null);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;