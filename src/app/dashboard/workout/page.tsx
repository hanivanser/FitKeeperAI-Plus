"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function WorkoutPage() {
  const [isTraining, setIsTraining] = useState(false);
  const [entryTime, setEntryTime] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [restRunning, setRestRunning] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const restIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer principal
  useEffect(() => {
    if (isTraining && !isPaused) {
      intervalRef.current = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isTraining, isPaused]);

  // Timer de descanso
  useEffect(() => {
    if (restRunning) {
      restIntervalRef.current = setInterval(() => setRestSeconds(s => s + 1), 1000);
    } else {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    }
    return () => clearInterval(restIntervalRef.current!);
  }, [restRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const startTraining = () => {
    setIsTraining(true);
    setEntryTime(new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));
  };

  const stopTraining = () => {
    setIsTraining(false);
    setElapsedSeconds(0);
    setIsPaused(false);
    setSelectedExercises([]);
    setEntryTime(null);
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <Link href="/dashboard" className="text-cyan-400 text-2xl">←</Link>
        <h1 className="text-3xl font-bold">Entrenamiento</h1>
        <div className="w-10" />
      </div>

      {/* Empty Day - Solo aparece si no hay entrenamiento */}
      {!isTraining && selectedExercises.length === 0 && (
        <div className="text-center pt-32">
          <div className="text-9xl opacity-20 mb-8">Z Z Z</div>
          <p className="text-4xl text-gray-500 mb-16">Empty Day</p>
          <button
            onClick={startTraining}
            className="bg-green-500 hover:bg-green-400 text-black text-2xl font-bold py-8 px-20 rounded-full shadow-2xl"
          >
            INICIAR ENTRENAMIENTO
          </button>
        </div>
      )}

      {/* ENTRENAMIENTO ACTIVO - Todo en la misma pantalla */}
      {isTraining && (
        <div className="pt-10 px-6">
          {/* Hora de entrada */}
          {entryTime && (
            <div className="text-center mb-8">
              <p className="text-gray-400 text-sm">Entrada al gym</p>
              <p className="text-5xl font-bold text-cyan-400">{entryTime}</p>
            </div>
          )}

          {/* Timer principal */}
          <div className="text-center mb-12">
            <div className="text-8xl font-bold text-green-400">
              {formatTime(elapsedSeconds)}
            </div>
            <p className="text-2xl mt-4">Tiempo en el gym</p>
          </div>

          {/* Controles */}
          <div className="flex justify-center gap-6 mb-12">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`font-bold text-xl py-6 px-12 rounded-full ${isPaused ? "bg-green-500" : "bg-yellow-500"} text-black`}
            >
              {isPaused ? "REANUDAR" : "PAUSAR"}
            </button>
            <button
              onClick={stopTraining}
              className="bg-red-600 hover:bg-red-500 font-bold text-xl py-6 px-12 rounded-full"
            >
              TERMINAR
            </button>
          </div>

          {/* Lista de ejercicios (aparece cuando añades) */}
          <div className="space-y-4 mb-20">
            {selectedExercises.length > 0 ? (
              selectedExercises.map((ex, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-6 text-left">
                  <p className="text-2xl font-bold">{ex.name}</p>
                  <p className="text-cyan-400">0 series • 0 reps • 0 kg</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-xl">
                Pulsa + para añadir ejercicios
              </p>
            )}
          </div>
        </div>
      )}

      {/* Botón + flotante - SIEMPRE visible cuando hay entrenamiento */}
      {isTraining && (
        <Link
          href="/dashboard/exercises"
          className="fixed bottom-8 right-8 bg-green-500 text-black text-5xl font-bold w-20 h-20 rounded-full flex items-center justify-center shadow-2xl z-50"
        >
          +
        </Link>
      )}

      {/* Icono cronómetro descanso */}
      {isTraining && (
        <button
          onClick={() => setShowRestTimer(true)}
          className="fixed top-20 right-6 bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-full shadow-2xl z-50 text-3xl"
        >
          
        </button>
      )}

      {/* Modal timer descanso */}
      {showRestTimer && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-3xl p-12 text-center border border-purple-600">
            <h2 className="text-4xl font-bold text-purple-400 mb-8">Descanso</h2>
            <div className="text-8xl font-bold text-pink-400 mb-12">
              {formatTime(restSeconds)}
            </div>
            <div className="flex justify-center gap-8">
              <button
                onClick={() => setRestRunning(!restRunning)}
                className="bg-green-500 hover:bg-green-400 text-black text-xl font-bold py-6 px-12 rounded-full"
              >
                {restRunning ? "PAUSAR" : "INICIAR"}
              </button>
              <button
                onClick={() => {
                  setRestSeconds(0);
                  setRestRunning(false);
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white text-xl font-bold py-6 px-12 rounded-full"
              >
                RESET
              </button>
            </div>
            <button
              onClick={() => setShowRestTimer(false)}
              className="mt-10 text-5xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}