import { useState, useEffect } from 'react';

export default function DashboardPublico() {
  const [jugadores, setJugadores] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRlMzJjYzE2LTE2MjEtNDBhMC1iMjY1LWUyOThiMGEyNDEwZCIsImVtYWlsIjoicHJ1ZWJhQHRlc3QuY29tIiwidGlwbyI6InBhZHJlIiwicm9sIjoiYWRtaW4iLCJpZF9jbHViIjoiNmE4MTY3MmMtOTViOS00ZDNjLTg2Y2MtN2M2MDIzYzUwZWZiIiwiaWF0IjoxNzcyOTE4MDY2LCJleHAiOjE3NzM1MjI4NjZ9.Vc3j4RMIUzjlZvuRvp7bRLXFIbQQvMcAMELjfaAWBsw';
    
    fetch('http://localhost:3000/api/jugadores', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      console.log('📦 Datos:', data);
      setJugadores(data.jugadores || []);
      setCargando(false);
    })
    .catch(err => {
      console.error(err);
      setCargando(false);
    });
  }, []);

  if (cargando) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Dashboard Público (Prueba)</h1>
      <h2>Jugadores: {jugadores.length}</h2>
      <ul>
        {jugadores.map(j => (
          <li key={j.id_jugador}>{j.nombre} {j.apellido}</li>
        ))}
      </ul>
    </div>
  );
}