import { useState, useEffect } from 'react';
import api from '../services/api';

function ModalEtiquetarJugadores({ onConfirm, onCancel }) {
  const [jugadores, setJugadores] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarJugadores();
  }, []);

  const cargarJugadores = async () => {
    try {
      const response = await api.get('/jugadores');
      setJugadores(response.data.jugadores);
    } catch (error) {
      console.error('Error cargando jugadores:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleJugador = (id) => {
    setSeleccionados(prev =>
      prev.includes(id)
        ? prev.filter(j => j !== id)
        : [...prev, id]
    );
  };

  const handleConfirm = () => {
    onConfirm(seleccionados);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Etiquetar jugadores</h2>
          <p className="text-gray-600 mb-4">Seleccioná los jugadores que aparecen en estos archivos:</p>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {jugadores.map(j => (
                <label key={j.id_jugador} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(j.id_jugador)}
                    onChange={() => toggleJugador(j.id_jugador)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700">{j.nombre} {j.apellido}</span>
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              Subir archivos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalEtiquetarJugadores;