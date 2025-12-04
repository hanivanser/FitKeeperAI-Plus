import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export const revalidate = 0

export default async function ExercisesPage() {
  const supabase = await createClient()   // AQUÍ ESTÁ LA CLAVE: await

  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .order('name')

  const categories = [...new Set(exercises?.map(e => e.category || 'Otros') || [])]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold text-cyan-400">Ejercicios</h1>
          <Link href="/dashboard" className="text-cyan-300 hover:text-cyan-100 transition">
            ← Volver al Dashboard
          </Link>
        </div>

        {exercises && exercises.length > 0 ? (
          categories.map(cat => (
            <div key={cat} className="mb-12">
              <h2 className="text-3xl font-bold text-cyan-300 mb-6 border-b border-cyan-800 pb-2">
                {cat}
              </h2>
              <div className="grid gap-4">
                {exercises
                  .filter(ex => (ex.category || 'Otros') === cat)
                  .map(ex => (
                    <div
                      key={ex.id}
                      className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-5 flex justify-between items-center hover:bg-gray-700/80 transition-all border border-gray-700"
                    >
                      <div>
                        <span className="text-xl font-semibold">{ex.name}</span>
                        {ex.equipment && (
                          <span className="ml-4 text-sm text-gray-400">
                            ({ex.equipment})
                          </span>
                        )}
                      </div>
                      <span className="text-cyan-400 text-2xl">›</span>
                    </div>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">Aún no hay ejercicios cargados</p>
          </div>
        )}

        <Link
          href="/dashboard/exercises/add"
          className="fixed bottom-8 right-8 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-3xl rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transition-all hover:scale-110 z-50"
        >
          +
        </Link>
      </div>
    </div>
  )
}