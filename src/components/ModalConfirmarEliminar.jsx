import React from 'react';

function ModalConfirmarEliminar({ jugador, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirmar Eliminación</h2>
          
          <p className="text-gray-600 mb-6">
            ¿Estás seguro que deseas eliminar este elemento?
            <br />
            <span className="text-sm text-red-500">Esta acción no se puede deshacer.</span>
          </p>

          <div className="flex gap-4">
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Sí, Eliminar
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmarEliminar;