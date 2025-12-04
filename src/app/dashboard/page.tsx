use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  // Login anónimo automático al entrar al dashboard
  useEffect(() => {
    createClient()
      .auth.signInAnonymously()
      .catch(() => {
        // Si ya está logueado, no hace nada
      });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-bold mb-6 text-cyan-400">
          ¡BIENVENIDO A FITKEEPER AI+!
        </h1>
        <p className="text-2xl text-cyan-300 mb-12">
          Tu gimnasio personal ya está vivo, hermano.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link
            href="/dashboard/exercises"
            className="bg-gray-800 hover:bg-gray-700 rounded-2xl p-10 text-center transition-all transform hover:scale-105 border border-cyan-900"
          >
            <div className="text-6xl mb-4">Weight</div>
            <h2 className="text-3xl font-bold">Ejercicios</h2>
            <p className="text-cyan-400 mt-2">Ver todos los ejercicios</p>
          </Link>

          <Link
            href="/dashboard/workout"
            className="bg-gray-800 hover:bg-gray-700 rounded-2xl p-10 text-center transition-all transform hover:scale-105 border border-cyan-900 opacity-50"
          >
            <div className="text-6xl mb-4">Stopwatch</div>
            <h2 className="text-3xl font-bold">Entrenar</h2>
            <p className="text-gray-500 mt-2">Próximamente</p>
          </Link>

          <Link
            href="/dashboard/calendar"
            className="bg-gray-800 hover:bg-gray-700 rounded-2xl p-10 text-center transition-all transform hover:scale-105 border border-cyan-900 opacity-50"
          >
            <div className="text-6xl mb-4">Calendar</div>
            <h2 className="text-3xl font-bold">Calendario</h2>
            <p className="text-gray-500 mt-2">Próximamente</p>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <p className="text-4xl">ESTÁS DENTRO</p>
          <p className="text-cyan-400 text-2xl mt-4">
            Ahora sí: a romperla todos los días.
          </p>
        </div>
      </div>
    </main>
  );
}