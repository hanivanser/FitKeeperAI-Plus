"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function WorkoutPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(90); // 1:30
  const [restRunning, setRestRunning] = useState(false);

  const totalInterval = useRef<NodeJS.Timeout | null>(null);
  const restInterval = useRef<NodeJS.Timeout | null>(null);

  // Timer total
  useEffect(() => {
    if (isTraining && !isPaused) {
      totalInterval.current = setInterval(() => setTotalSeconds(s => s + 1), 1000);
    } else {
      if (totalInterval.current) clearInterval(totalInterval.current);
    }
    return () => clearInterval(totalInterval.current!);
  }, [isTraining, isPaused]);

  // Timer descanso (regresivo)
  useEffect(() => {
    if (restRunning && restSeconds > 0) {
      restInterval.current = setInterval(() => setRestSeconds(s => s - 1), 1000);
    } else if (restSeconds === 0) {
      setRestRunning(false);
    }
    return () => clearInterval(restInterval.current!);
  }, [restRunning, restSeconds]);

  const format = (s: number) => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  const startTraining = () => {
    if (exercises.length === 0) return;
    setIsTraining(true);
  };

  const finishTraining = () => {
    setIsTraining(false);
    setIsPaused(false);
    setTotalSeconds(0);
    setRestSeconds(90);
    setRestRunning(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* FONDO ZZZ */}
      {exercises.length === 0 && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="text-[25rem] font-black text-gray-800 opacity-5 select-none">ZZZ</div>
        </div>
      )}

      <div className="relative z-10 px-6 pt-20 pb-32">

        {/* BOTÓN INICIAR */}
        <div className="text-center mb-12">
          <button
            onClick={startTraining}
            disabled={exercises.length === 0}
            className={`w-full max-w-3xl mx-auto text-4xl font-bold py-12 rounded-full shadow-2xl transition-all ${
              exercises.length === 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-400 text-black"
            }`}
          >
            INICIAR ENTRENAMIENTO
          </button>
        </div>

        {/* PAUSAR Y TERMINAR - SIEMPRE VISIBLES */}
        <div className="flex justify-center gap-10 mb-20">
          <button
            onClick={() => setIsPaused(!isPaused)}
            disabled={!isTraining}
            className={`text-2xl font-bold py-8 px-24 rounded-full transition-all ${
              isTraining
                ? isPaused
                  ? "bg-green-500 hover:bg-green-400 text-black"
                  : "bg-yellow-500 hover:bg-yellow-400 text-black"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isPaused ? "REANUDAR" : "PAUSAR"}
          </button>

          <button
            onClick={finishTraining}
            disabled={!isTraining}
            className={`text-2xl font-bold py-8 px-24 rounded-full transition-all ${
              isTraining
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            TERMINAR
          </button>
        </div>

        {/* TIMER PRINCIPAL */}
        {isTraining && (
          <div className="text-center mb-20">
            <div className="text-8xl font-bold text-green-400 tracking-wider">
              {format(totalSeconds)}
            </div>
            <p className="text-2xl text-gray-300 mt-6">Tiempo en el gym</p>
          </div>
        )}

        {/* DESCANSO - SIEMPRE VISIBLE */}
        <div className="fixed top-24 right-6 bg-gradient-to-br from-purple-700 to-pink-700 p-8 rounded-3xl shadow-2xl z-40 text-center w-64">
          <p className="text-xl text-gray-200 mb-4">Descanso</p>
          <div className="text-6xl font-bold text-white mb-8">
            {format(restSeconds)}
          </div>
          <div className="space-y-4">
            <button
              onClick={() => setRestRunning(!restRunning)}
              className="bg-white text-black font-bold text-xl py-5 px-12 rounded-full w-full"
            >
              {restRunning ? "PAUSAR" : "INICIAR"}
            </button>
            <button
              onClick={() => setRestSeconds(s => s + 30)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg py-4 px-10 rounded-full w-full"
            >
              +30 seg
            </button>
          </div>
        </div>

        {/* MENSAJE */}
        {exercises.length === 0 && (
          <p className="text-center text-gray-500 text-xl mt-32">
            Pulsa + para añadir ejercicios
          </p>
        )}
      </div>

      {/* BOTÓN + */}
      <Link
        href="/dashboard/exercises"
        className="fixed bottom-10 right-8 bg-green-500 hover:bg-green-400 text-black text-6xl font-bold w-20 h-20 rounded-full flex items-center justify-center shadow-2xl z-50"
      >
        +
      </Link>
    </div>
  );
}