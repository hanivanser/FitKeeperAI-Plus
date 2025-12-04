"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.signInAnonymously().then(({ data }) => {
      if (data.user) {
        router.push("/dashboard");
      }
    });
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-900">
      <div className="w-full max-w-md space-y-12 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white tracking-tight">
            FitKeeper<span className="text-cyan-300">AI</span>+
          </h1>
          <p className="text-xl text-teal-100">
            Simple. Poderoso. Tuyo.
          </p>
          <p className="text-lg text-teal-200">Entrando a tu gimnasio...</p>
        </div>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto"></div>
        <p className="text-sm text-teal-200">
          Sin anuncios · Sin complicaciones · Solo progreso
        </p>
      </div>
    </main>
  );
}