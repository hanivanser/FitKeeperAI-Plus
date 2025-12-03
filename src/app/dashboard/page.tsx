"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">¡BIENVENIDO A FITKEEPER AI+!</h1>
        <p className="text-2xl text-cyan-300 mb-8">
          Tu gimnasio personal ya está vivo, hermano.
        </p>
        <div className="bg-gray-800 rounded-2xl p-10 text-center">
          <p className="text-3xl">ESTÁS DENTRO</p>
          <p className="text-cyan-400 mt-4 text-xl">
            Ahora sí: a meter ejercicios, dietas, progreso y todo lo que quieras.
          </p>
        </div>
      </div>
    </main>
  );
}