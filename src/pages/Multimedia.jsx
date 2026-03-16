import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Multimedia() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const [jugadores, setJugadores] = useState([]);
  const [showEtiquetar, setShowEtiquetar] = useState(false);
  const [jugadoresSeleccionados, setJugadoresSeleccionados] = useState([]);
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: '',
    tipo: 'partido',
    fecha: new Date().toISOString().split('T')[0],
    lugar: '',
    descripcion: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const puedeSubir = user?.rol === 'admin' || user?.rol === 'dt' || user?.rol === 'preparador';

  useEffect(() => {
    cargarEventos();
    cargarJugadores();
  }, []);

  const cargarEventos = async () => {
    try {
      const response = await api.get('/multimedia/eventos');
      setEventos(response.data.eventos);
    } catch (error) {
      console.error('Error cargando eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarJugadores = async () => {
    try {
      const response = await api.get('/jugadores');
      setJugadores(response.data.jugadores);
    } catch (error) {
      console.error('Error cargando jugadores:', error);
    }
  };

  const cargarArchivos = async (idEvento) => {
    try {
      const response = await api.get(`/multimedia/eventos/${idEvento}/archivos`);
      setArchivos(response.data.archivos);
    } catch (error) {
      console.error('Error cargando archivos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEvento(prev => ({ ...prev, [name]: value }));
  };

  const handleCrearEvento = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/multimedia/eventos', nuevoEvento);
      setEventos([...eventos, response.data.evento]);
      setShowForm(false);
      setNuevoEvento({
        nombre: '',
        tipo: 'partido',
        fecha: new Date().toISOString().split('T')[0],
        lugar: '',
        descripcion: ''
      });
    } catch (error) {
      console.error('Error creando evento:', error);
      alert('Error al crear el evento');
    }
  };

  // Función para subir archivos
  const handleFileUpload = async (files, idEvento, visibilidad, jugadoresIds = []) => {
    setUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tipo = file.type.startsWith('image/') ? 'foto' : 'video';
      
      const formData = new FormData();
      formData.append('archivo', file);
      formData.append('id_evento', idEvento);
      formData.append('tipo', tipo);
      formData.append('titulo', file.name);
      formData.append('visibilidad', visibilidad);

      try {
        const response = await api.post('/multimedia/archivos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (visibilidad === 'privado' && jugadoresIds.length > 0) {
          const archivoId = response.data.archivo.id_archivo;
          for (const jugadorId of jugadoresIds) {
            await api.post('/multimedia/etiquetas', {
              id_archivo: archivoId,
              id_jugador: jugadorId
            });
          }
        }
      } catch (error) {
        console.error('Error subiendo archivo:', error);
      }
    }
    
    setUploading(false);
    alert('Archivos subidos correctamente');
    setShowEtiquetar(false);
    setJugadoresSeleccionados([]);
    cargarEventos();
    if (selectedEvento) {
      cargarArchivos(selectedEvento.id_evento);
    }
  };

  // Manejar selección de archivos
  const handleFileSelect = (e, idEvento, visibilidad) => {
    const files = e.target.files;
    if (!files.length) return;

    if (visibilidad === 'privado') {
      // Si es privado, mostrar modal para etiquetar
      setShowEtiquetar(true);
      setJugadoresSeleccionados([]);
      // Guardamos los datos en el estado para usarlos después
      setArchivoSubiendoTemp({ files, idEvento, visibilidad });
    } else {
      // Si es público, subir directamente
      handleFileUpload(files, idEvento, visibilidad);
    }
  };

  // Estado temporal para el archivo que se está subiendo
  const [archivoSubiendoTemp, setArchivoSubiendoTemp] = useState(null);

  const confirmarEtiquetado = () => {
    if (archivoSubiendoTemp) {
      handleFileUpload(
        archivoSubiendoTemp.files,
        archivoSubiendoTemp.idEvento,
        archivoSubiendoTemp.visibilidad,
        jugadoresSeleccionados
      );
      setArchivoSubiendoTemp(null);
    }
  };

  const cancelarEtiquetado = () => {
    setShowEtiquetar(false);
    setJugadoresSeleccionados([]);
    setArchivoSubiendoTemp(null);
  };

  const handleEventoClick = async (evento) => {
    setSelectedEvento(evento);
    await cargarArchivos(evento.id_evento);
  };

  const openFileViewer = (archivo) => {
    setSelectedFile(archivo);
    setShowViewer(true);
  };

  const closeViewer = () => {
    setShowViewer(false);
    setSelectedFile(null);
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTipoColor = (tipo) => {
    switch(tipo) {
      case 'partido': return 'bg-blue-100 text-blue-800';
      case 'entrenamiento': return 'bg-green-100 text-green-800';
      case 'torneo': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVisibilidadColor = (visibilidad) => {
    return visibilidad === 'publico' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const toggleJugador = (jugadorId) => {
    setJugadoresSeleccionados(prev => {
      if (prev.includes(jugadorId)) {
        return prev.filter(id => id !== jugadorId);
      } else {
        return [...prev, jugadorId];
      }
    });
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
            <div className="text-xl font-bold text-blue-600">📊 SportMetrics Pro - Multimedia</div>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              ← Volver
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Galería Multimedia</h1>
          {puedeSubir && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              <span className="text-xl">+</span> Nuevo Evento
            </button>
          )}
        </div>

        {showForm && puedeSubir && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Crear nuevo evento</h2>
            <form onSubmit={handleCrearEvento} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nombre del evento</label>
                  <input
                    type="text"
                    name="nombre"
                    value={nuevoEvento.nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Tipo</label>
                  <select
                    name="tipo"
                    value={nuevoEvento.tipo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="partido">Partido</option>
                    <option value="entrenamiento">Entrenamiento</option>
                    <option value="torneo">Torneo</option>
                    <option value="evento_especial">Evento especial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Fecha</label>
                  <input
                    type="date"
                    name="fecha"
                    value={nuevoEvento.fecha}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Lugar</label>
                  <input
                    type="text"
                    name="lugar"
                    value={nuevoEvento.lugar}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                <textarea
                  name="descripcion"
                  value={nuevoEvento.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Crear evento
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((evento) => (
            <div key={evento.id_evento} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
              onClick={() => handleEventoClick(evento)}
            >
              <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                <span className="text-6xl">📸</span>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{evento.nombre}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTipoColor(evento.tipo)}`}>
                    {evento.tipo}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">{formatFecha(evento.fecha)}</p>
                <p className="text-gray-600 text-sm mb-4">{evento.lugar}</p>
                
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>📷 {evento.fotos || 0} fotos</span>
                  <span>🎥 {evento.videos || 0} videos</span>
                </div>

                {puedeSubir && (
                  <div className="mt-4 space-y-2">
                    <div className="flex gap-2">
                      <label className="flex-1 block">
                        <span className="block text-center bg-green-500 text-white px-2 py-1 rounded-lg text-xs hover:bg-green-600 transition cursor-pointer">
                          📸 Subir Público
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={(e) => handleFileSelect(e, evento.id_evento, 'publico')}
                          className="hidden"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </label>
                      <label className="flex-1 block">
                        <span className="block text-center bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs hover:bg-yellow-600 transition cursor-pointer">
                          🔒 Subir Privado
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={(e) => handleFileSelect(e, evento.id_evento, 'privado')}
                          className="hidden"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal de etiquetado */}
        {showEtiquetar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Etiquetar jugadores</h2>
                <p className="text-gray-600 mb-4">
                  Seleccioná los jugadores que aparecen en este archivo:
                </p>

                <div className="max-h-60 overflow-y-auto mb-4 border rounded-lg p-2">
                  {jugadores.map((jugador) => (
                    <div key={jugador.id_jugador} className="flex items-center gap-2 py-2 border-b last:border-0">
                      <input
                        type="checkbox"
                        id={`jugador-${jugador.id_jugador}`}
                        checked={jugadoresSeleccionados.includes(jugador.id_jugador)}
                        onChange={() => toggleJugador(jugador.id_jugador)}
                        className="w-4 h-4"
                      />
                      <label htmlFor={`jugador-${jugador.id_jugador}`} className="flex-1">
                        {jugador.nombre} {jugador.apellido}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={confirmarEtiquetado}
                    disabled={uploading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {uploading ? 'Subiendo...' : 'Confirmar y subir'}
                  </button>
                  <button
                    onClick={cancelarEtiquetado}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedEvento && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedEvento.nombre}</h2>
                  <button onClick={() => setSelectedEvento(null)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
                </div>
                <p className="text-gray-600 mb-4">{formatFecha(selectedEvento.fecha)} - {selectedEvento.lugar}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {archivos.map((archivo) => (
                    <div key={archivo.id_archivo} className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition relative"
                      onClick={() => openFileViewer(archivo)}
                    >
                      {archivo.tipo === 'foto' ? (
                        <img src={archivo.secure_url || archivo.url || archivo.url_archivo} alt={archivo.titulo} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center text-white">
                          <span className="text-4xl mb-2">🎥</span>
                          <span className="text-xs text-center px-2">{archivo.titulo}</span>
                        </div>
                      )}
                      <span className={`absolute top-1 right-1 px-1 py-0.5 rounded-full text-[8px] font-semibold ${getVisibilidadColor(archivo.visibilidad)}`}>
                        {archivo.visibilidad === 'publico' ? '🌐' : '🔒'}
                      </span>
                    </div>
                  ))}
                </div>
                {archivos.length === 0 && <div className="text-center py-12"><p className="text-gray-500">No hay archivos en este evento</p></div>}
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setSelectedEvento(null)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showViewer && selectedFile && (
          <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4" onClick={closeViewer}>
            <div className="relative max-w-6xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
              <button onClick={closeViewer} className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center text-2xl hover:bg-opacity-75 z-10">✕</button>
              {selectedFile.tipo === 'foto' ? (
                <div className="flex items-center justify-center h-full">
                  <img src={selectedFile.secure_url || selectedFile.url || selectedFile.url_archivo} alt={selectedFile.titulo} className="max-w-full max-h-[85vh] object-contain" />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <video src={selectedFile.secure_url || selectedFile.url || selectedFile.url_archivo} controls autoPlay className="max-w-full max-h-[85vh]" controlsList="nodownload">
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
              )}
              <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg flex items-center gap-2">
                <span>{selectedFile.titulo}</span>
                <span className={`px-1 py-0.5 rounded-full text-[8px] font-semibold ${getVisibilidadColor(selectedFile.visibilidad)}`}>
                  {selectedFile.visibilidad === 'publico' ? '🌐 Público' : '🔒 Privado'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Multimedia;