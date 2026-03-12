import { useState, useEffect } from 'react';
import api from '../services/api';

function ModalEditarEvaluacion({ evaluacion, onClose, onEvaluacionActualizada }) {
  const [formData, setFormData] = useState({
    fecha_evaluacion: '',
    goles: 0,
    asistencias: 0,
    minutos_jugados: 90,
    precision_pases: '',
    precision_remates: '',
    duelos_ganados: '',
    duelos_perdidos: '',
    distancia_recorrida_km: '',
    velocidad_maxima_kmh: '',
    observaciones: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (evaluacion) {
      const fecha = new Date(evaluacion.fecha_evaluacion);
      const fechaFormateada = fecha.toISOString().split('T')[0];
      
      setFormData({
        fecha_evaluacion: fechaFormateada,
        goles: evaluacion.goles || 0,
        asistencias: evaluacion.asistencias || 0,
        minutos_jugados: evaluacion.minutos_jugados || 90,
        precision_pases: evaluacion.precision_pases || '',
        precision_remates: evaluacion.precision_remates || '',
        duelos_ganados: evaluacion.duelos_ganados || '',
        duelos_perdidos: evaluacion.duelos_perdidos || '',
        distancia_recorrida_km: evaluacion.distancia_recorrida_km || '',
        velocidad_maxima_kmh: evaluacion.velocidad_maxima_kmh || '',
        observaciones: evaluacion.observaciones?.destacar || ''
      });
    }
  }, [evaluacion]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const observacionesObj = formData.observaciones ? 
        { destacar: formData.observaciones } : null;

      const response = await api.put(`/evaluaciones/${evaluacion.id_evaluacion}`, {
        ...formData,
        observaciones: observacionesObj,
        goles: parseInt(formData.goles) || 0,
        asistencias: parseInt(formData.asistencias) || 0,
        minutos_jugados: parseInt(formData.minutos_jugados) || 90
      });

      onEvaluacionActualizada(response.data.evaluacion);
      onClose();
    } catch (err) {
      setError('Error al actualizar la evaluación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Editar Evaluación</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Fecha</label>
              <input
                type="date"
                name="fecha_evaluacion"
                value={formData.fecha_evaluacion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Goles</label>
                <input
                  type="number"
                  name="goles"
                  value={formData.goles}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Asistencias</label>
                <input
                  type="number"
                  name="asistencias"
                  value={formData.asistencias}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Minutos</label>
                <input
                  type="number"
                  name="minutos_jugados"
                  value={formData.minutos_jugados}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Precisión pases %</label>
                <input
                  type="number"
                  name="precision_pases"
                  value={formData.precision_pases}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Observaciones</label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalEditarEvaluacion;