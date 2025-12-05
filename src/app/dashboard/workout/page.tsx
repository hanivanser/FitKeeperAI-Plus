"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function WorkoutPage() {
  const [isTraining, setIsTraining] = useState(false);
  const [entryTime, setEntryTime] = useState<string | null>(null);
  const [use24h, setUse24h] = useState(true);
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

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, "0");
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatEntryTime = () => {
    const now = new Date();
    if (use24h) {
      return now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    } else {
      return now.toLocaleTimeString("es-ES", { hour: "numeric", minute: "2-digit", hour12: true });
    }
  };

  const startTraining = () => {
    setIsTraining(true);
    setEntryTime(formatEntryTime());
  };

  const stopTraining = () => {
    setIsTraining(false);
    setElapsedSeconds(0);
    setIsPaused(false);
    setSelectedExercises([]);
    setEntryTime(null);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-center p-6 sticky top-0 z-40 bg-black border-b border-gray-900">
        <Link href="/dashboard" className="text-cyan-400 text-2xl">←</Link>
        <h1 className="text-3xl font-bold">Entrenamiento</h1>
        <button onClick={() => setUse24h(!use24h)} className="text-cyan-400 text-lg">
          {use24h ? "24h" : "12h"}
        </button>
      </div>

      {/* FONDO ZZZ - solo si no hay ejercicios */}
      {selectedExercises.length === 0 && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="text-[20rem] font-black text-gray-800 opacity-5 select-none leading-none">
            ZZZ
          </div>
        </div>
      )}

      <div className="relative z-10 px-6 pt-10 pb-32">

        {/* PANTALLA INICIAL - CON BOTÓN INICIAR */}
        {!isTraining && selectedExercises.length === 0 && (
          <div className="text-center pt-32">
            <div className="text-9xl opacity-20 mb-8 select-none">Z Z Z</div>
            <p className="text-4xl text-gray-500 mb-16">Empty Day</p>
            <button
              onClick={startTraining}
              className="bg-green-500 hover:bg-green-400 text-black font-bold text-3xl py-10 px-28 rounded-full shadow-2xl transition"
            >
              INICIAR ENTRENAMIENTO
            </button>
          </div>
        )}

        {/* ENTRENAMIENTO ACTIVO - TODO EN LA MISMA PANTALLA */}
        {isTraining && (
          <>
            {/* Hora de entrada */}
            <div className="text-center mb-10">
              <p className="text-gray-500 text-lg">Entrada al gym</p>
              <p className="text-6xl font-bold text-cyan-400">{entryTime}</p>
            </div>

            {/* Timer principal */}
            <div className="text-center mb-12">
              <div className="text-8xl font-bold text-green-400 tracking-wider">
                {formatTime(elapsedSeconds)}
              </div>
              <p className="text-2xl mt-4">Tiempo en el gym</p>
            </div>

            {/* Botones Pausar / Terminar */}
            <div className="flex justify-center gap-8 mb-12">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`font-bold text-2xl py-6 px-16 rounded-full transition ${
                  isPaused ? "bg-green-500 hover:bg-green-400" : "bg-yellow-500 hover:bg-yellow-400"
                } text-black`}
              >
                {isPaused ? "REANUDAR" : "PAUSAR"}
              </button>
              <button
                onClick={stopTraining}
                className="bg-red-600 hover:bg-red-500 font-bold text-2xl py-6 px-16 rounded-full"
              >
                TERMINAR
              </button>
            </div>

            {/* Mensaje si no hay ejercicios */}
            {selectedExercises.length === 0 && (
              <p className="text-center text-gray-400 text-xl mb-10">
                Pulsa + para añadir ejercicios
              </p>
            )}

            {/* Aquí irán los ejercicios cuando los añadas */}
            {/* <div className="space-y-4"> ... </div> */}
          </>
        )}
      </div>

      {/* BOTÓN + FLOTANTE */}
      {isTraining && (
        <Link
          href="/dashboard/exercises"
          className="fixed bottom-10 right-8 bg-green-500 text-black text-6xl font-bold w-20 h-20 rounded-full flex items-center justify-center shadow-2xl z-50"
        >
          +
        </Link>
      )}

      {/* ICONO CRONÓMETRO DESCANSO */}
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
          <div className="bg-gray-900 rounded-3xl p-12 text-center border-4 border-purple-600 max-w-md w-full">
            <h2 className="text-5xl font-bold text-purple-400 mb-10">Descanso</h2>
            <div className="text-8xl font-bold text-pink-400 mb-12">
              {formatTime(restSeconds)}
            </div>
            <div className="flex justify-center gap-8">
              <button
                onClick={() => setRestRunning(!restRunning)}
                className="bg-green-500 hover:bg-green-400 text-black text-2xl font-bold py-6 px-14 rounded-full"
              >
                {restRunning ? "PAUSAR" : "INICIAR"}
              </button>
              <button
                onClick={() => {
                  setRestSeconds(0);
                  setRestRunning(false);
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white text-2xl font-bold py-6 px-12 rounded-full"
              >
                RESET
              </button>
            </div>
            <button
              onClick={() => setShowRestTimer(false)}
              className="mt-12 text-6xl text-gray-500"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}