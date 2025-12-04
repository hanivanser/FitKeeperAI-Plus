"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function WorkoutPage() {
  const [isTraining, setIsTraining] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const supabase = createClient();

  // Timer global del gym
  useEffect(() => {
    if (!isTraining || !startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsed(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTraining, startTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const startWorkout = async () => {
    const now = new Date();
    setStartTime(now);
    setIsTraining(true);

    // Guardamos el inicio en Supabase
    await supabase.from("workouts").insert({
      start_time: now.toISOString(),
      status: "active",
    });
  };

  const endWorkout = async () => {
    if (!startTime) return;

    const endTime = new Date();
    const totalSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    // Actualizamos el workout en Supabase
    const { data: activeWorkout } = await supabase
      .from("workouts")
      .select("id")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (activeWorkout) {
      await supabase
        .from("workouts")
        .update({
          end_time: endTime.toISOString(),
          duration_seconds: totalSeconds,
          status: "completed",
        })
        .eq("id", activeWorkout.id);
    }

    setIsTraining(false);
    setStartTime(null);
    setElapsed(0);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto pt-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <Link href="/dashboard" className="text-cyan-400 text-xl">
            ←
          </Link>
          <h1 className="text-3xl font-bold">Entrenamiento</h1>
          <div className="w-8" />
        </div>

        {!isTraining ? (
          /* PANTALLA INICIO */
          <div className="text-center py-20">
            <div className="text-9xl mb-10 opacity-20">Z Z Z</div>
            <p className="text-3xl text-gray-500 mb-16">Empty Day</p>

            <button
              onClick={startWorkout}
              className="bg-green-500 hover:bg-green-400 text-black text-2xl font-bold py-8 px-16 rounded-full shadow-2xl transform hover:scale-105 transition-all"
            >
              INICIAR ENTRENAMIENTO
            </button>
          </div>
        ) : (
          /* ENTRENAMIENTO ACTIVO */
          <div className="text-center">
            <div className="mb-10">
              <p className="text-gray-400 text-sm">Inicio</p>
              <p className="text-4xl font-bold text-cyan-400">
                {startTime && formatTime(startTime)}
              </p>
            </div>

            <div className="text-8xl font-bold mb-10 text-green-400">
              {formatElapsed(elapsed)}
            </div>

            <p className="text-2xl mb-10">Tiempo en el gym</p>

            <div className="flex justify-center gap-6 mt-20">
              <Link
                href="/dashboard/exercises"
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xl py-6 px-12 rounded-full"
              >
                + Añadir ejercicio
              </Link>

              <button
                onClick={endWorkout}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xl py-6 px-12 rounded-full"
              >
                TERMINAR
              </button>
            </div>
          </div>
        )}

        {/* Botón flotante + (siempre visible) */}
        {isTraining && (
          <Link
            href="/dashboard/exercises"
            className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-400 text-black text-4xl font-bold w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-50"
          >
            +
          </Link>
        )}
      </div>
    </div>
  );
}
