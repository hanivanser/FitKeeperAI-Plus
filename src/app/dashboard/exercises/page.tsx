import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export const revalidate = 0

export default async function ExercisesPage() {
  const supabase = createClient()
  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .order('name')

  const categories = [...new Set(exercises?.map(e => e.category) || [])]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold text-cyan-400">Ejercicios</h1>
          <Link href="/dashboard" className="text-cyan-300 hover:underline">
            ← Volver
          </Link>
        </div>

        {exercises?.length ? (
          categories.map(cat => (
            <div key={cat} className="mb-10">
              <h2 className="text-3xl font-bold text-cyan-300 mb-4">{cat}</h2>
              <div className="space-y-3">
                {exercises
                  .filter(ex => ex.category === cat)
                  .map(ex => (
                    <div
                      key={ex.id}
                      className="bg-gray-800 rounded-xl p-4 flex justify-between items-center hover:bg-gray-700 transition"
                    >
                      <span className="text-xl">{ex.name}</span>
                      {ex.equipment && (
                        <span className="text-sm text-gray-400">{ex.equipment}</span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-2xl text-gray-400">
            No hay ejercicios aún
          </div>
        )}

        <Link
          href="/dashboard/exercises/add"
          className="fixed bottom-8 right-8 bg-cyan-500 text-black w-16 h-16 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl hover:bg-cyan-400 transition"
        >
          +
        </Link>
      </div>
    </div>
  )
}