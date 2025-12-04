"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function WorkoutPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  // Timer manual controlado por ti
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatHour = () => {
    return new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStart = async () => {
    const now = new Date();
    setStartTime(now);
    setIsRunning(true);
    setIsPaused(false);
    setElapsedSeconds(0);

    await supabase.from("workouts").insert({
      start_time: now.toISOString(),
      status: "active",
    });
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = async () => {
    if (!startTime || elapsedSeconds === 0) return;

    const endTime = new Date();
    const totalSeconds = elapsedSeconds;

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

    setIsRunning(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    setStartTime(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto pt-10">
        <div className="flex justify-between items-center mb-10">
          <Link href="/dashboard" className="text-cyan-400 text-xl">
            ←
          </Link>
          <h1 className="text-3xl font-bold">Entrenamiento</h1>
          <div className="w-8" />
        </div>

        {!isRunning ? (
          // PANTALLA INICIO
          <div className="text-center py-20">
            <div className="text-9xl mb-10 opacity-20">Z Z Z</div>
            <p className="text-3xl text-gray-500 mb-16">Empty Day</p>
            <button
              onClick={handleStart}
              className="bg-green-500 hover:bg-green-400 text-black text-2xl font-bold py-8 px-16 rounded-full shadow-2xl"
            >
              INICIAR ENTRENAMIENTO
            </button>
          </div>
        ) : (
          // ENTRENAMIENTO ACTIVO
          <div className="text-center">
            <div className="mb-8">
              <p className="text-gray-400 text-sm">Inicio</p>
              <p className="text-4xl font-bold text-cyan-400">
                {startTime && formatHour()}
              </p>
            </div>

            <div className="text-8xl font-bold mb-8 text-green-400 tracking-wider">
              {formatTime(elapsedSeconds)}
            </div>

            <p className="text-2xl mb-16">Tiempo en el gym</p>

            <div className="flex justify-center gap-6 mb-20">
              {!isPaused ? (
                <button
                  onClick={handlePause}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xl py-6 px-12 rounded-full"
                >
                  PAUSAR
                </button>
              ) : (
                <button
                  onClick={handleResume}
                  className="bg-green-500 hover:bg-green-400 text-black font-bold text-xl py-6 px-12 rounded-full"
                >
                  REANUDAR
                </button>
              )}

              <button
                onClick={handleStop}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xl py-6 px-12 rounded-full"
              >
                TERMINAR
              </button>
            </div>

            <Link
              href="/dashboard/exercises"
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xl py-6 px-16 rounded-full"
            >
              + Añadir ejercicio
            </Link>
          </div>
        )}

        {isRunning && (
          <Link
            href="/dashboard/exercises"
            className="fixed bottom-8 right-8 bg-green-500 text-black text-4xl font-bold w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-50"
          >
            +
          </Link>
        )}
      </div>
    </div>
  );
}