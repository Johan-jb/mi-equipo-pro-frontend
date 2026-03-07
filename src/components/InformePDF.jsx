import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff'
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: '#1e40af',
    textAlign: 'center'
  },
  subheader: {
    fontSize: 16,
    marginBottom: 10,
    color: '#374151',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 5
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 8
  },
  infoItem: {
    width: '50%',
    marginBottom: 8
  },
  infoLabel: {
    fontSize: 10,
    color: '#6b7280'
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827'
  },
  table: {
    marginTop: 20,
    marginBottom: 20
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold'
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    textAlign: 'center'
  },
  footer: {
    marginTop: 30,
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center'
  }
});

// Componente del documento PDF
const InformePDF = ({ jugador, evaluacion }) => {
  // Calcular edad exacta
  const calcularEdad = (fechaNac) => {
    const hoy = new Date();
    const nac = new Date(fechaNac);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const mes = hoy.getMonth() - nac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) {
      edad--;
    }
    return edad;
  };

  const fechaFormateada = new Date(evaluacion.fecha_evaluacion).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Título */}
        <Text style={styles.header}>Informe de Rendimiento</Text>
        
        {/* Datos del jugador */}
        <Text style={styles.subheader}>Datos del Jugador</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nombre completo</Text>
            <Text style={styles.infoValue}>{jugador.nombre} {jugador.apellido}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Edad</Text>
            <Text style={styles.infoValue}>{calcularEdad(jugador.fecha_nacimiento)} años</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Posición</Text>
            <Text style={styles.infoValue}>{jugador.posicion_principal}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Pierna hábil</Text>
            <Text style={styles.infoValue}>{jugador.pierna_habil}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>DNI</Text>
            <Text style={styles.infoValue}>{jugador.dni || 'No especificado'}</Text>
          </View>
        </View>

        {/* Datos de la evaluación */}
        <Text style={styles.subheader}>Evaluación del {fechaFormateada}</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Goles</Text>
            <Text style={styles.infoValue}>{evaluacion.goles}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Asistencias</Text>
            <Text style={styles.infoValue}>{evaluacion.asistencias}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Minutos jugados</Text>
            <Text style={styles.infoValue}>{evaluacion.minutos_jugados}</Text>
          </View>
          {evaluacion.precision_pases && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Precisión de pases</Text>
              <Text style={styles.infoValue}>{evaluacion.precision_pases}%</Text>
            </View>
          )}
          {evaluacion.precision_remates && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Precisión de remates</Text>
              <Text style={styles.infoValue}>{evaluacion.precision_remates}%</Text>
            </View>
          )}
        </View>

        {/* Métricas de rendimiento */}
        <Text style={styles.subheader}>Métricas de Rendimiento</Text>
        <View style={styles.table}>
          {/* Header de la tabla */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Métrica</Text>
            <Text style={styles.tableCell}>Valor</Text>
          </View>

          {/* Filas de métricas */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Duelos ganados</Text>
            <Text style={styles.tableCell}>{evaluacion.duelos_ganados || '-'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Duelos perdidos</Text>
            <Text style={styles.tableCell}>{evaluacion.duelos_perdidos || '-'}</Text>
          </View>
          {evaluacion.porcentaje_duelos_ganados && (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>% duelos ganados</Text>
              <Text style={styles.tableCell}>{Math.round(evaluacion.porcentaje_duelos_ganados)}%</Text>
            </View>
          )}
          {evaluacion.distancia_recorrida_km && (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Distancia recorrida</Text>
              <Text style={styles.tableCell}>{evaluacion.distancia_recorrida_km} km</Text>
            </View>
          )}
          {evaluacion.velocidad_maxima_kmh && (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Velocidad máxima</Text>
              <Text style={styles.tableCell}>{evaluacion.velocidad_maxima_kmh} km/h</Text>
            </View>
          )}
        </View>

        {/* Observaciones */}
        {evaluacion.observaciones && (
          <>
            <Text style={styles.subheader}>Observaciones</Text>
            <View style={{ marginTop: 10, padding: 10, backgroundColor: '#f9fafb' }}>
              <Text style={{ fontSize: 11, color: '#374151' }}>
                {evaluacion.observaciones.destacar || JSON.stringify(evaluacion.observaciones)}
              </Text>
            </View>
          </>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Informe generado por Mi Equipo Pro - {new Date().toLocaleDateString('es-ES')}
        </Text>
      </Page>
    </Document>
  );
};

// Componente para el botón de descarga
const BotonDescargarPDF = ({ jugador, evaluacion }) => (
  <PDFDownloadLink
    document={<InformePDF jugador={jugador} evaluacion={evaluacion} />}
    fileName={`informe_${jugador.nombre}_${jugador.apellido}_${new Date(evaluacion.fecha_evaluacion).toISOString().split('T')[0]}.pdf`}
  >
    {({ loading }) => (
      <button
        className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-600 transition flex items-center gap-1"
        disabled={loading}
      >
        <span className="text-lg">📄</span>
        {loading ? 'Generando...' : 'PDF'}
      </button>
    )}
  </PDFDownloadLink>
);

export default BotonDescargarPDF;