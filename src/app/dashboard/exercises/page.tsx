"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Lista de ejercicios pre-cargados con categoría y color
const allExercises = [
  // PECHO
  { id: 1, name: "Press Banca Barra", category: "Pecho", equipment: "barbell" },
  { id: 2, name: "Press Banca Mancuernas", category: "Pecho", equipment: "dumbbell" },
  { id: 3, name: "Press Inclinado", category: "Pecho", equipment: "barbell" },
  { id: 4, name: "Aperturas en Banco", category: "Pecho", equipment: "dumbbell" },
  { id: 5, name: "Cruces en Polea", category: "Pecho", equipment: "cable" },
  { id: 6, name: "Fondos en Paralelas", category: "Pecho", equipment: "bodyweight" },

  // ESPALDA
  { id: 7, name: "Dominadas", category: "Espalda", equipment: "bodyweight" },
  { id: 8, name: "Jalón al Pecho", category: "Espalda", equipment: "cable" },
  { id: 9, name: "Remo con Barra", category: "Espalda", equipment: "barbell" },
  { id: 10, name: "Remo con Mancuerna", category: "Espalda", equipment: "dumbbell" },

  // HOMBROS
  { id: 11, name: "Press Militar", category: "Hombros", equipment: "barbell" },
  { id: 12, name: "Elevaciones Laterales", category: "Hombros", equipment: "dumbbell" },
  { id: 13, name: "Pájaro", category: "Hombros", equipment: "dumbbell" },

  // BÍCEPS
  { id: 14, name: "Curl con Barra", category: "Bíceps", equipment: "barbell" },
  { id: 15, name: "Curl con Mancuernas", category: "Bíceps", equipment: "dumbbell" },
  { id: 16, name: "Curl Martillo", category: "Bíceps", equipment: "dumbbell" },

  // TRÍCEPS
  { id: 17, name: "Press Francés", category: "Tríceps", equipment: "barbell" },
  { id: 18, name: "Extensiones en Polea", category: "Tríceps", equipment: "cable" },
  { id: 19, name: "Fondos en Banco", category: "Tríceps", equipment: "bodyweight" },

  // PIERNAS
  { id: 20, name: "Sentadillas", category: "Piernas", equipment: "barbell" },
  { id: 21, name: "Prensa", category: "Piernas", equipment: "machine" },
  { id: 22, name: "Zancadas", category: "Piernas", equipment: "dumbbell" },
  { id: 23, name: "Peso Muerto", category: "Piernas", equipment: "barbell" },
];

// COLORES POR GRUPO MUSCULAR
const muscleColors: Record<string, string> = {
  Pecho: "#ef4444",
  Espalda: "#f59e0b",
  Hombros: "#10b981",
  Bíceps: "#3b82f6",
  Tríceps: "#8b5cf6",
  Antebrazos: "#ec4899",
  Piernas: "#14b8a6",
};

export default function ExercisesPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const router = useRouter();

  const toggleExercise = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const goToWorkout = () => {
    const selectedExercises = allExercises.filter(ex => selected.includes(ex.id));
    localStorage.setItem("selectedExercises", JSON.stringify(selectedExercises));
    router.push("/dashboard/workout");
  };

  // Obtener categorías únicas
  const categories = [...new Set(allExercises.map(ex => ex.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold text-cyan-400">Ejercicios</h1>
          <Link href="/dashboard" className="text-cyan-300 hover:text-cyan-100 text-xl">
            ← Volver
          </Link>
        </div>

        {/* AQUÍ VA EL CÓDIGO QUE TE DIJE */}
        {categories.map(cat => (
          <div key={cat} className="mb-16">
            <h2
              className="text-5xl font-bold mb-8 tracking-wider"
              style={{ color: muscleColors[cat] || "#22d3ee" }}
            >
              {cat}
            </h2>

            <div className="grid gap-4">
              {allExercises
                .filter(ex => ex.category === cat)
                .map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => toggleExercise(ex.id)}
                    className={`p-6 rounded-2xl text-left transition-all border-4 ${
                      selected.includes(ex.id)
                        ? `bg-opacity-20 border-${cat.toLowerCase()} shadow-2xl shadow-${cat.toLowerCase()}-500/50 scale-105`
                        : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                    }`}
                    style={{
                      backgroundColor: selected.includes(ex.id) ? muscleColors[cat] + "30" : undefined,
                      borderColor: selected.includes(ex.id) ? muscleColors[cat] : undefined,
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-2xl font-bold">{ex.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">{ex.equipment}</p>
                      </div>
                      {selected.includes(ex.id) && (
                        <span className="text-4xl text-white">Check</span>
                      )}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ))}

        {/* BOTÓN ENTRENAMIENTO */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
          <button
            onClick={goToWorkout}
            disabled={selected.length === 0}
            className={`w-full text-3xl font-bold py-10 rounded-full shadow-2xl transition-all ${
              selected.length > 0
                ? "bg-green-500 hover:bg-green-400 text-black"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            ENTRENAMIENTO ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
}