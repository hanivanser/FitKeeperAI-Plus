"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function WorkoutPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [effectiveSeconds, setEffectiveSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(90);
  const [restRunning, setRestRunning] = useState(false);
  const [use24h, setUse24h] = useState(true);
  const [showSummary, setShowSummary] = useState(false);

  const supabase = createClient();
  const totalInterval = useRef<NodeJS.Timeout | null>(null);
  const effectiveInterval = useRef<NodeJS.Timeout | null>(null);
  const restInterval = useRef<NodeJS.Timeout | null>(null);

  // Cargar ejercicios
  useEffect(() => {
    const saved = localStorage.getItem("selectedExercises");
    if (saved) setExercises(JSON.parse(saved));
  }, []);

  // Timer total
  useEffect(() => {
    if (isTraining) {
      totalInterval.current = setInterval(() => setTotalSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(totalInterval.current!);
  }, [isTraining]);

  // Timer efectivo (solo cuando no estás descansando)
  useEffect(() => {
    if (isTraining && !restRunning) {
      effectiveInterval.current = setInterval(() => setEffectiveSeconds(s => s + 1), 1000);
    } else {
      if (effectiveInterval.current) clearInterval(effectiveInterval.current);
    }
    return () => clearInterval(effectiveInterval.current!);
  }, [isTraining, restRunning]);

  // Timer descanso
  useEffect(() => {
    if (restRunning && restSeconds > 0) {
      restInterval.current = setInterval(() => setRestSeconds(s => s - 1), 1000);
    } else if (restSeconds === 0) {
      setRestRunning(false);
    }
    return () => clearInterval(restInterval.current!);
  }, [restRunning, restSeconds]);

  const format = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const formatHour = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !use24h,
    });
  };

  const startTraining = () => {
    if (exercises.length === 0) return;
    setIsTraining(true);
    setStartTime(new Date());
  };

  const finishTraining = async () => {
    if (!startTime) return;

    const endTime = new Date();

    // Guardar en Supabase
    const { data: workout } = await supabase
      .from("workouts")
      .insert({
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        total_seconds: totalSeconds,
        effective_seconds: effectiveSeconds,
      })
      .select()
      .single();

    if (workout) {
      await supabase.from("workout_exercises").insert(
        exercises.map(ex => ({
          workout_id: workout.id,
          exercise_name: ex.name,
          exercise_category: ex.category,
        }))
      );
    }

    setShowSummary(true);
  };

  const closeSummary = () => {
    setShowSummary(false);
    setIsTraining(false);
    setIsPaused(false);
    setTotalSeconds(0);
    setEffectiveSeconds(0);
    setRestSeconds(90);
    setRestRunning(false);
    localStorage.removeItem("selectedExercises");
    setExercises([]);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* AQUÍ VA EL HEADER NUEVO */}
      <div className="flex justify-between items-center p-6 sticky top-0 bg-black z-40 border-b border-gray-900">
        <Link href="/dashboard" className="text-cyan-400 text-2xl">←</Link>
        <h1 className="text-4xl font-bold">Entrenamiento</h1>
        <button
          onClick={() => setUse24h(!use24h)}
          className="bg-gray-800 hover:bg-gray-700 text-cyan-400 font-bold text-lg px-6 py-3 rounded-full transition"
        >
          {use24h ? "24h" : "AM/PM"}
        </button>
      </div>


      {/* FONDO ZZZ */}
      {exercises.length === 0 && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="text-[25rem] font-black text-gray-800 opacity-5 select-none">ZZZ</div>
        </div>
      )}

      <div className="relative z-10 px-6 pt-10 pb-32">

        {/* INICIAR ENTRENAMIENTO + TIMER PEQUEÑO */}
        <div className="text-center mb-8">
          <button
            onClick={startTraining}
            disabled={exercises.length === 0}
            className={`w-full max-w-3xl mx-auto text-4xl font-bold py-14 rounded-full shadow-2xl transition-all ${
              exercises.length === 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-400 text-black"
            }`}
          >
            INICIAR ENTRENAMIENTO
          </button>

          {isTraining && (
            <div className="mt-8">
              <p className="text-5xl font-bold text-green-400">{format(totalSeconds)}</p>
              <p className="text-lg text-gray-400">Tiempo en el gym</p>
            </div>
          )}
        </div>

        {/* PAUSAR Y TERMINAR */}
        <div className="flex justify-center gap-12 mb-20">
          <button
            onClick={() => setIsPaused(!isPaused)}
            disabled={!isTraining}
            className={`text-2xl font-bold py-10 px-24 rounded-full transition-all ${
              isTraining
                ? isPaused
                  ? "bg-green-500 hover:bg-green-400 text-black"
                  : "bg-yellow-500 hover:bg-yellow-400 text-black"
                : "bg-gray-700 text-gray-500"
            }`}
          >
            {isPaused ? "REANUDAR" : "PAUSAR"}
          </button>

          <button
            onClick={finishTraining}
            disabled={!isTraining}
            className={`text-2xl font-bold py-10 px-24 rounded-full transition-all ${
              isTraining
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-gray-700 text-gray-500"
            }`}
          >
            TERMINAR
          </button>
        </div>

        {/* DESCANSO CON + Y - */}
        <div className="fixed top-20 right-6 bg-gradient-to-br from-purple-700 to-pink-700 p-8 rounded-3xl shadow-2xl z-40 text-center w-64">
          <p className="text-xl text-gray-200 mb-4">Descanso</p>
          <div className="text-6xl font-bold text-white mb-6">
            {format(restSeconds)}
          </div>
          <div className="space-y-4">
            <button
              onClick={() => setRestRunning(!restRunning)}
              className="bg-white text-black font-bold text-xl py-5 px-12 rounded-full w-full"
            >
              {restRunning ? "PAUSAR" : "INICIAR"}
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => setRestSeconds(s => Math.max(30, s - 30))}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold text-2xl py-4 px-8 rounded-full flex-1"
              >
                −30
              </button>
              <button
                onClick={() => setRestSeconds(s => s + 30)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold text-2xl py-4 px-8 rounded-full flex-1"
              >
                +30
              </button>
            </div>
          </div>
        </div>

        {/* MENSAJE */}
        {exercises.length === 0 && !isTraining && (
          <p className="text-center text-gray-500 text-xl mt-20">
            Pulsa + para añadir ejercicios
          </p>
        )}

        {/* LISTA DE EJERCICIOS */}
        {exercises.length > 0 && (
          <div className="space-y-6 mt-10">
            {exercises.map((ex, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl p-8 border border-cyan-800">
                <h3 className="text-3xl font-bold text-cyan-400">{ex.name}</h3>
                <p className="text-gray-400 mt-2">{ex.category} • {ex.equipment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTÓN + */}
      <Link
        href="/dashboard/exercises"
        className="fixed bottom-10 right-8 bg-green-500 hover:bg-green-400 text-black text-6xl font-bold w-20 h-20 rounded-full flex items-center justify-center shadow-2xl z-50"
      >
        +
      </Link>

      {/* RESUMEN AL TERMINAR */}
      {showSummary && startTime && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-3xl p-12 text-center border-4 border-cyan-600 max-w-lg w-full">
            <h2 className="text-5xl font-bold text-cyan-400 mb-12">Entrenamiento Guardado!</h2>

            <div className="space-y-8 text-2xl">
              <div>
                <p className="text-gray-400">Inicio</p>
                <p className="text-4xl font-bold text-green-400">{formatHour(startTime)}</p>
              </div>
              <div>
                <p className="text-gray-400">Final</p>
                <p className="text-4xl font-bold text-red-400">{formatHour(new Date())}</p>
              </div>
              <div>
                <p className="text-gray-400">Tiempo total en el gym</p>
                <p className="text-5xl font-bold text-green-400">{format(totalSeconds)}</p>
              </div>
              <div>
                <p className="text-gray-400">Tiempo efectivo entrenando</p>
                <p className="text-5xl font-bold text-yellow-400">{format(effectiveSeconds)}</p>
              </div>
            </div>

            <button
              onClick={closeSummary}
              className="mt-16 bg-green-500 hover:bg-green-400 text-black text-3xl font-bold py-8 px-32 rounded-full shadow-2xl"
            >
              ACEPTAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}