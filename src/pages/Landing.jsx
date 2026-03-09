import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        {/* Sección de registro rápida */}
        <section id="register" className="py-20 bg-gradient-to-br from-blue-600 to-green-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Comenzá hoy mismo
            </h2>
            <p className="text-xl text-white mb-8 opacity-90">
              Unite a los clubes que ya confían en SportMetrics Pro para el desarrollo de sus jugadores.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Crear cuenta gratuita
              </Link>
              <Link
                to="/login"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Iniciar sesión
              </Link>
            </div>
            <p className="text-white text-sm mt-4 opacity-75">
              Sin compromiso. Podés cancelar cuando quieras.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;