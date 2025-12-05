"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function WorkoutPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [restRunning, setRestRunning] = useState(false);

  const totalInterval = useRef<NodeJS.Timeout | null>(null);
  const restInterval = useRef<NodeJS.Timeout | null>(null);

  // Timer total del gym (nunca se pausa)
  useEffect(() => {
    if (isTraining) {
      totalInterval.current = setInterval(() => setTotalSeconds(s => s + 1), 1000);
    } else {
      if (totalInterval.current) clearInterval(totalInterval.current);
    }
    return () => clearInterval(totalInterval.current!);
  }, [isTraining]);

  // Timer de descanso
  useEffect(() => {
    if (restRunning) {
      restInterval.current = setInterval(() => setRestSeconds(s => s + 1), 1000);
    } else {
      if (restInterval.current) clearInterval(restInterval.current);
    }
    return () => clearInterval(restInterval.current!);
  }, [restRunning]);

  const format = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const startTraining = () => {
    if (exercises.length === 0) return;
    setIsTraining(true);
    setStartTime(new Date());
  };

  const finishTraining = () => {
    setIsTraining(false);
    setTotalSeconds(0);
    setStartTime(null);
    // Aquí guardaremos en Supabase más adelante
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

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

      <div className="relative z-10 px-6 pt-10 pb-32">

        {/* BOTÓN INICIAR - siempre visible, deshabilitado si no hay ejercicios */}
        <div className="text-center mb-12">
          <button
            onClick={startTraining}
            disabled={exercises.length === 0 || isTraining}
            className={`text-3xl font-bold py-10 px-32 rounded-full shadow-2xl transition-all ${
              exercises.length === 0 || isTraining
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-400 text-black"
            }`}
          >
            {isTraining ? "ENTRENAMIENTO EN CURSO" : "INICIAR ENTRENAMIENTO"}
          </button>
        </div>

        {/* ENTRENAMIENTO ACTIVO */}
        {isTraining && (
          <div className="text-center space-y-12">
            {/* Hora de entrada */}
            <div>
              <p className="text-gray-400 text-lg">Entrada al gym</p>
              <p className="text-6xl font-bold text-cyan-400">
                {startTime?.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            {/* Timer principal - NUNCA se pausa */}
            <div>
              <div className="text-8xl font-bold text-green-400 tracking-wider">
                {format(totalSeconds)}
              </div>
              <p className="text-2xl text-gray-300 mt-400">Tiempo total en el gym</p>
            </div>

            {/* Botón TERMINAR */}
            <button
              onClick={finishTraining}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-3xl py-8 px-32 rounded-full shadow-2xl"
            >
              TERMINAR ENTRENAMIENTO
            </button>
          </div>
        )}

        {/* Mensaje si no hay ejercicios */}
        {exercises.length === 0 && !isTraining && (
          <p className="text-center text-gray-500 text-xl mt-20">
            Pulsa + para añadir ejercicios
          </p>
        )}

        {/* Lista de ejercicios (si los hay) */}
        {exercises.length > 0 && (
          <div className="space-y-4 mt-12">
            {exercises.map((ex, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h3 className="text-2xl font-bold">{ex.name || "Ejercicio"}</h3>
                <p className="text-cyan-400">0 series × 0 reps × 0 kg</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTÓN + SIEMPRE ACTIVO */}
      <Link
        href="/dashboard/exercises"
        className="fixed bottom-10 right-8 bg-green-500 hover:bg-green-400 text-black text-6xl font-bold w-20 h-20 rounded-full flex items-center justify-center shadow-2xl z-50 transition-all"
      >
        +
      </Link>

      {/* CRONÓMETRO DESCANSO */}
      {isTraining && (
        <button
          onClick={() => setShowRestTimer(true)}
          className="fixed top-20 right-6 bg-gradient-to-br from-purple-600 to-pink-600 p-5 rounded-full shadow-2xl z-50"
        >
          <span className="text-4xl">Cronómetro</span>
        </button>
      )}

      {/* MODAL DESCANSO */}
      {showRestTimer && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-3xl p-12 text-center border-4 border-purple-600">
            <h2 className="text-5xl font-bold text-purple-400 mb-10">Descanso</h2>
            <div className="text-8xl font-bold text-pink-400 mb-12">
              {format(restSeconds)}
            </div>
            <div className="flex justify-center gap-8">
              <button
                onClick={() => setRestRunning(!restRunning)}
                className="bg-green-500 hover:bg-green-400 text-black text-2xl font-bold py-6 px-14 rounded-full"
              >
                {restRunning ? "PAUSAR" : "INICIAR"}
              </button>
              <button
                onClick={() => { setRestSeconds(0); setRestRunning(false); }}
                className="bg-gray-700 hover:bg-gray-600 text-white text-2xl font-bold py-6 px-12 rounded-full"
              >
                RESET
              </button>
            </div>
            <button onClick={() => setShowRestTimer(false)} className="mt-12 text-6xl text-gray-500">
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}