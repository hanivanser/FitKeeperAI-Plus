"use client";

import { useState } from "react";
import Link from "next/link";

export default function WorkoutPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null);

  const hasExercises = exercises.length > 0;

  const startTraining = () => {
    if (!hasExercises) return;
    setIsTraining(true);
    setStartTime(new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));
  };

  return (
    <div className="min-h-screen bg-black text-white relative">

      {/* HEADER */}
      <div className="flex justify-center items-center p-6 sticky top-0 bg-black z-40 border-b border-gray-900">
        <h1 className="text-4xl font-bold">Entrenamiento</h1>
      </div>

      {/* FONDO ZZZ */}
      {exercises.length === 0 && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="text-[20rem] font-black text-gray-800 opacity-5 select-none">ZZZ</div>
        </div>
      )}

      <div className="relative z-10 px-6 pt-20 pb-32 text-center">

        {/* BOTÓN INICIAR - siempre visible, gris si no hay ejercicios */}
        <button
          onClick={startTraining}
          disabled={!hasExercises}
          className={`text-3xl font-bold py-10 px-32 rounded-full shadow-2xl mb-20 transition-all ${
            hasExercises
              ? "bg-green-500 hover:bg-green-400 text-black"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          INICIAR ENTRENAMIENTO
        </button>

        {/* SI HAY ENTRENAMIENTO ACTIVO */}
        {isTraining && (
          <div className="space-y-12">
            <div>
              <p className="text-gray-400 text-lg">Entrada al gym</p>
              <p className="text-6xl font-bold text-cyan-400">{startTime}</p>
            </div>

            <div className="text-8xl font-bold text-green-400">
              00:00:00
            </div>
            <p className="text-2xl">Tiempo en el gym</p>

            <button className="bg-red-600 hover:bg-red-500 text-white font-bold text-3xl py-8 px-32 rounded-full">
              TERMINAR
            </button>
          </div>
        )}

        {/* MENSAJE SI NO HAY EJERCICIOS */}
        {exercises.length === 0 && (
          <p className="text-gray-500 text-xl">
            Pulsa + para añadir ejercicios
          </p>
        )}
      </div>

      {/* BOTÓN + SIEMPRE ACTIVO */}
      <Link
        href="/dashboard/exercises"
        className="fixed bottom-10 right-8 bg-green-500 hover:bg-green-400 text-black text-6xl font-bold w-20 h-20 rounded-full flex items-center justify-center shadow-2xl z-50"
      >
        +
      </Link>
    </div>
  );
}