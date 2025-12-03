"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Login anónimo instantáneo → entras directo sin Google ni nada
    const supabase = createClient();
    supabase.auth.signInAnonymously().then(({ data }) => {
      if (data.user) {
        router.push("/dashboard");
      }
    });
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-900">
      <div className="text-center space-y-8">
        <h1 className="text-6xl md:text-7xl font-bold text-white">
          FitKeeper<span className="text-cyan-300">AI</span>+
        </h1>
        <p className="text-xl text-teal-100">Entrando a tu gimnasio personal...</p>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-300 mx-auto"></div>
      </div>
    </main>
  );
}