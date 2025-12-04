
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from "next/link";

export default async function ExercisesPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: exercises } = await supabase
    .from("exercises")
    .select("*")
    .order("name");

  const categories = [...new Set(exercises?.map(e => e.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-cyan-400">Ejercicios</h1>
        
        {categories.map(cat => (
          <div key={cat} className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-300 mb-4">{cat}</h2>
            <div className="grid gap-3">
              {exercises
                ?.filter(e => e.category === cat)
                .map(ex => (
                  <div key={ex.id} className="bg-gray-800 rounded-xl p-4 flex justify-between items-center hover:bg-gray-700 transition">
                    <span className="text-lg">{ex.name}</span>
                    <span className="text-gray-400 text-sm">{ex.equipment}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
        
        <Link href="/dashboard/exercises/add" className="fixed bottom-8 right-8 bg-cyan-500 text-black rounded-full w-16 h-16 flex items-center justify-center text-4xl shadow-2xl hover:bg-cyan-400 transition">
          +
        </Link>
      </div>
    </div>
  );
}
