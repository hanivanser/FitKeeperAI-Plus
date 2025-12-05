"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Timer, Clock } from "lucide-react";

export default function WorkoutPage() {
  // ===== TIMER PRINCIPAL DEL GYM =====
  const [gymRunning, setGymRunning] = useState(false);
  const [gymPaused, setGymPaused] = useState(false);
  const [gymSeconds, setGymSeconds] = useState(0);
  const gymInterval = useRef<NodeJS.Timeout | null>(null);

  // ===== HORA DE ENTRADA (LOCAL) =====
  const [entryTime, setEntryTime] = useState<string | null>(null);
  const [use24h, setUse24h] = useState(true); // cambia a false para 12h

  // ===== TIMER DE DESCANSO (modal) =====
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [restRunning, setRestRunning] = useState(false);
  const restInterval = useRef<NodeJS.Timeout | null>(null);

  const supabase = createClient();

  // Timer gym
  useEffect(() => {
    if (gymRunning && !gymPaused) {
      gymInterval.current = setInterval(() => setGymSeconds(s => s + 1), 1000);
    } else {
      if (gymInterval.current) clearInterval(gymInterval.current);
    }
    return () => {
      if (gymInterval.current) clearInterval(gymInterval.current);
    };
  }, [gymRunning, gymPaused]);

  // Timer descanso
  useEffect(() => {
    if (restRunning) {
      restInterval.current = setInterval(() => setRestSeconds(s => s + 1), 1000);
    } else {
      if (restInterval.current) clearInterval(restInterval.current);
    }
    return () => {
      if (restInterval.current) clearInterval(restInterval.current);
    };
  }, [restRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatLocalTime = () => {
    const now = new Date();
    if (use24h) {
      return now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    } else {
      return now.toLocaleTimeString("es-ES", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  const handleGymStart = () => {
    setGymRunning(true);
    setGymPaused(false);
    setGymSeconds(0);
  };

  const handleGymPause = () => setGymPaused(true);
  const handleGymResume = () => setGymPaused(false);

  const handleGymStop = async () => {
    if (gymSeconds === 0) return;

    const endTime = new Date();
    await supabase.from("workouts").insert({
      start_time: new Date(Date.now() - gymSeconds * 1000).toISOString(),
      end_time: endTime.toISOString(),
      duration_seconds: gymSeconds,
      status: "completed",
    });

    setGymRunning(false);
    setGymPaused(false);
    setGymSeconds(0);
  };

  const handleSetEntryTime = () => {
    setEntryTime(formatLocalTime());
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
      <div className="max-w-md mx-auto pt-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <Link href="/dashboard" className="text-cyan-400 text-2xl">←</Link>
          <h1 className="text-3xl font-bold">Entrenamiento</h1>
          <button
            onClick={() => setUse24h(!use24h)}
            className="text-cyan-400 text-sm"
          >
            {use24h ? "24h" : "12h"}
          </button>
        </div>

        {/* SIN ENTRENAMIENTO */}
        {!gymRunning && !entryTime && (
          <div className="text-center py-20">
            <div className="text-9xl mb-10 opacity-20">Z Z Z</div>
            <p className="text-3xl text-gray-500 mb-16">Empty Day</p>
            <button
              onClick={handleGymStart}
              className="bg-green-500 hover:bg-green-400 text-black text-2xl font-bold py-8 px-16 rounded-full shadow-2xl mb-6"
            >
            INICIAR ENTRENAMIENTO
            </button>
            <br />
            <button
              onClick={handleSetEntryTime}
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xl py-4 px-10 rounded-full"
            >
              Fijar hora de entrada
            </button>

            {/* ENTRENAMIENTO ACTIVO */}
            {gymRunning && (
              <div className="text-center">
                {/* HORA DE ENTRADA */}
                {entryTime && (
                  <div className="mb-8">
                    <p className="text-gray-400 text-sm">Entrada al gym</p>
                    <p className="text-5xl font-bold text-cyan-400">{entryTime}</p>
                      
                  </div>
                )}

                {/* TIMER PRINCIPAL */}
                <div className="text-8xl font-bold mb-8 text-green-400 tracking-wider">
                  {formatTime(gymSeconds)}
                </div>
                <p className="text-2xl mb-12">Tiempo en el gym</p>

                {/* CONTROLES */}
                <div className="flex justify-center gap-6 mb-12">
                  {!gymPaused ? (
                    <button
                      onClick={handleGymPause}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xl py-6 px-12 rounded-full"
                    >
                      PAUSAR
                    </button>
                  ) : (
                    <button
                      onClick={handleGymResume}
                      className="bg-green-500 hover:bg-green-400 text-black font-bold text-xl py-6 px-12 rounded-full"
                    >
                      REANUDAR
                    </button>
                  )}

                  <button
                    onClick={handleGymStop}
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

            {/* ICONO CRONÓMETRO DESCANSO */}
            <button
              onClick={() => setShowRestTimer(true)}
              className="fixed top-20 right-6 bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-full shadow-2xl z-50"
            >
              <Timer size={32} />
            </button>

            {/* MODAL TIMER DESCANSO */}
            {showRestTimer && (
              <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
                <div className="bg-gray-900 rounded-3xl p-10 max-w-sm w-full border border-purple-600">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-purple-400">Descanso</h2>
                    <button
                      onClick={() => {
                        setShowRestTimer(false);
                        setRestRunning(false);
                        setRestSeconds(0);
                      }}
                      className="text-4xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="text-7xl font-bold text-pink-400 text-center mb-10">
                    {formatTime(restSeconds)}
                  </div>

                  <div className="flex justify-center gap-4">
                    {!restRunning ? (
                      <button
                        onClick={() => setRestRunning(true)}
                        className="bg-green-500 hover:bg-green-400 text-black font-bold text-xl py-5 px-10 rounded-full"
                      >
                        INICIAR
                      </button>
                    ) : (
                      <button
                        onClick={() => setRestRunning(false)}
                        className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xl py-5 px-10 rounded-full"
                      >
                        PAUSAR
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setRestSeconds(0);
                        setRestRunning(false);
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-white font-bold text-xl py-5 px-8 rounded-full"
                    >
                      RESET
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* BOTÓN + FLOTANTE */}
            {gymRunning && (
              <Link
                href="/dashboard/exercises"
                className="fixed bottom-8 right-8 bg-green-500 text-black text-4xl font-bold w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-40"
              >
                +
              </Link>
            )}
          </div>

          </div>


        )}

        
    </div>
  );
}

