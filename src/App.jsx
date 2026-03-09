import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Evaluaciones from './pages/Evaluaciones';
import Multimedia from './pages/Multimedia';
import Landing from './pages/Landing';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    console.log('📦 App iniciada - Token:', token ? '✅' : '❌', 'User:', savedUser ? '✅' : '❌');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        console.log('✅ Usuario cargado:', userData.email);
      } catch (e) {
        console.error('❌ Error al parsear usuario');
        localStorage.removeItem('user');
      }
    }
    // Simulamos un pequeño retraso para que el estado se asiente
    setTimeout(() => setCargando(false), 100);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/mi-equipo-pro-frontend/#/';
  };

  if (cargando) {
    return <div style={{padding:20}}>Cargando aplicación...</div>;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/evaluaciones/:id" 
          element={user ? <Evaluaciones /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/multimedia" 
          element={user ? <Multimedia /> : <Navigate to="/login" />} 
        />
        
        {/* Ruta comodín: cualquier otra URL redirige a la raíz */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}

export default App;