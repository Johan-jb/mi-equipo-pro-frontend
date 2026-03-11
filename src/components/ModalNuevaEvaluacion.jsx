import { useState } from 'react';
import api from '../services/api';

function ModalNuevaEvaluacion({ jugadorId, onClose, onEvaluacionCreada }) {
  const [formData, setFormData] = useState({
    fecha_evaluacion: new Date().toISOString().split('T')[0],
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const observacionesObj = formData.observaciones ?
        { destacar: formData.observaciones } : null;

      const response = await api.post('/evaluaciones', {
        id_jugador: jugadorId,
        ...formData,
        observaciones: observacionesObj,
        goles: parseInt(formData.goles) || 0,
        asistencias: parseInt(formData.asistencias) || 0,
        minutos_jugados: parseInt(formData.minutos_jugados) || 90,
        duelos_ganados: parseInt(formData.duelos_ganados) || null,
        duelos_perdidos: parseInt(formData.duelos_perdidos) || null,
        precision_pases: parseFloat(formData.precision_pases) || null,
        precision_remates: parseFloat(formData.precision_remates) || null,
        distancia_recorrida_km: parseFloat(formData.distancia_recorrida_km) || null,
        velocidad_maxima_kmh: parseFloat(formData.velocidad_maxima_kmh) || null
      });

      onEvaluacionCreada(response.data.evaluacion);
    } catch (err) {
      setError('Error al guardar la evaluación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Nueva Evaluación</h2>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Goles</label>
                <input
                  type="number"
                  name="goles"
                  value={formData.goles}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Asistencias</label>
                <input
                  type="number"
                  name="asistencias"
                  value={formData.asistencias}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Minutos jugados</label>
                <input
                  type="number"
                  name="minutos_jugados"
                  value={formData.minutos_jugados}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Precisión pases (%)</label>
                <input
                  type="number"
                  name="precision_pases"
                  value={formData.precision_pases}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Duelos ganados</label>
                <input
                  type="number"
                  name="duelos_ganados"
                  value={formData.duelos_ganados}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Duelos perdidos</label>
                <input
                  type="number"
                  name="duelos_perdidos"
                  value={formData.duelos_perdidos}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Distancia (km)</label>
                <input
                  type="number"
                  name="distancia_recorrida_km"
                  value={formData.distancia_recorrida_km}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Vel. máxima (km/h)</label>
                <input
                  type="number"
                  name="velocidad_maxima_kmh"
                  value={formData.velocidad_maxima_kmh}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Observaciones</label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Ej: Buen partido, destacó en...">
              </textarea>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Evaluación'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
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

export default ModalNuevaEvaluacion;