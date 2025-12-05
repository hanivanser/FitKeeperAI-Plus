"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function WorkoutPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isExercising, setIsExercising] = useState(false); // solo cuando hace series
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [exerciseSeconds, setExerciseSeconds] = useState(0);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [restRunning, setRestRunning] = useState(false);

  const totalInterval = useRef<NodeJS.Timeout | null>(null);
  const exerciseInterval = useRef<NodeJS.Timeout | null>(null);
  const restInterval = useRef<NodeJS.Timeout | null>(null);

  // Timer total del gym
  useEffect(() => {
    if (isTraining) {
      totalInterval.current = setInterval(() => setTotalSeconds(s => s + 1), 1000);
    } else {
      if (totalInterval.current) clearInterval(totalInterval.current);
    }
    return () => clearInterval(totalInterval.current!);
  }, [isTraining]);

  // Timer solo de ejecución (ejercicio real)
  useEffect(() => {
    if (isExercising) {
      exerciseInterval.current = setInterval(() => setExerciseSeconds(s => s + 1), 1000);
    } else {
      if (exerciseInterval.current) clearInterval(exerciseInterval.current);
    }
    return () => clearInterval(exerciseInterval.current!);
  }, [isExercising]);

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
    return `${h}h ${m}m ${sec}s`;
  };

  const startTraining = () => {
    setIsTraining(true);
    setStartTime(new Date());
  };

  const finishTraining = () => {
    setIsTraining(false);
    setIsExercising(false);
    setTotalSeconds(0);
    setExerciseSeconds(0);
    setExercises([]);
    setStartTime(null);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 sticky top-0 bg-black z-40 border-b border-gray-900">
        <Link href="/dashboard" className="text-cyan-400 text-2xl">←</Link>
        <h1 className="text-3xl font-bold">Entrenamiento</h1>
        <div />
      </div>

      {/* Empty Day - solo si no hay ejercicios */}
      {exercises.length === 0 && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="text-[20rem] font-black text-gray-800 opacity-5 select-none">ZZZ</div>
        </div>
      )}

      <div className="relative z-10 px-6 pt-10 pb-32">

        {/* SIN EJERCICIOS - OBLIGATORIO AÑADIR PRIMERO */}
        {exercises.length === 0 && (
          <div className="text-center pt-32">
            <p className="text-4xl text-gray-500 mb-16">Primero añade ejercicios</p>
            <Link
              href="/dashboard/exercises"
              className="bg-green-500 hover:bg-green-400 text-black text-3xl font-bold py-10 px-28 rounded-full shadow-2xl"
            >
              + AÑADIR EJERCICIOS
            </Link>
          </div>
        )}

        {/* HAY EJERCICIOS - PUEDE INICIAR */}
        {exercises.length > 0 && !isTraining && (
          <div className="text-center pt-20">
            <p className="text-2xl text-gray-400 mb-10">Tienes {exercises.length} ejercicio(s)</p>
            <button
              onClick={startTraining}
              className="bg-green-500 hover:bg-green-400 text-black text-3xl font-bold py-10 px-28 rounded-full shadow-2xl"
            >
              INICIAR ENTRENAMIENTO
            </button>
          </div>
        )}

        {/* ENTRENAMIENTO EN MARCHA */}
        {isTraining && (
          <div className="space-y-12">
            <div className="text-center">
              <p className="text-gray-400">Inicio</p>
              <p className="text-5xl font-bold text-cyan-400">
                {startTime?.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            {/* Timer total */}
            <div className="text-center">
              <p className="text-7xl font-bold text-green-400">{format(totalSeconds)}</p>
              <p className="text-xl text-gray-400">Tiempo total en el gym</p>
            </div>

            {/* Timer de ejecución real */}
            <div className="text-center">
              <p className="text-6xl font-bold text-yellow-400">{format(exerciseSeconds)}</p>
              <p className="text-lg text-gray-400">Tiempo entrenando (sin descansos)</p>
            </div>

            {/* Botones */}
            <div className="flex justify-center gap-8">
              <button
                onClick={() => setIsExercising(!isExercising)}
                className={`font-bold text-2xl py-6 px-16 rounded-full ${
                  isExercising ? "bg-yellow-500" : "bg-green-500"
                } text-black`}
              >
                {isExercising ? "DESCANSANDO" : "HACIENDO SERIES"}
              </button>
              <button
                onClick={finishTraining}
                className="bg-red-600 hover:bg-red-500 font-bold text-2xl py-6 px-16 rounded-full"
              >
                TERMINAR
              </button>
            </div>

            {/* Lista de ejercicios */}
            <div className="space-y-4">
              {exercises.map((ex, i) => (
                <div key={i} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-2xl font-bold">{ex.name}</h3>
                  <p className="text-cyan-400">0 series × 0 reps × 0 kg</p>
                </div>
  ))}

            </div>
          </div>
        )}
      </div>

      {/* BOTÓN + */}
      {exercises.length > 0 && (
        <Link
          href="/dashboard/exercises"
          className="fixed bottom-10 right-8 bg-green-500 text-black text-6xl font-bold w-20 h-20 rounded-full flex items-center justify-center shadow-2xl z-50"
        >
          +
        </Link>
      )}

      {/* CRONÓMETRO DESCANSO */}
      {isTraining && (
        <button
          onClick={() => setShowRestTimer(true)}
          className="fixed top-20 right-6 bg-gradient-to-br from-purple-600 to-pink-600 p-5 rounded-full shadow-2xl z-50 text-4xl"
        >
          ⏱
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
                className="bg-green-500 text-black text-2xl font-bold py-6 px-14 rounded-full"
              >
                {restRunning ? "PAUSAR" : "INICIAR"}
              </button>
              <button
                onClick={() => { setRestSeconds(0); setRestRunning(false); }}
                className="bg-gray-700 text-white text-2xl font-bold py-6 px-12 rounded-full"
              >
                RESET
              </button>
            </div>
            <button onClick={() => setShowRestTimer(false)} className="mt-12 text-6xl">×</button>
          </div>
        </div>
      )}
    </div>
  );
}