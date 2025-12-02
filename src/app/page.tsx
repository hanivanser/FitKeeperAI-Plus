"use client";

import { createClient } from "@/utils/supabase/client";
import { FcGoogle } from "react-icons/fc";

export default function Home() {
  const supabase = createClient();

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-12 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white tracking-tight">
            FitKeeper<span className="text-cyan-300">AI</span>+
          </h1>
          <p className="text-xl text-teal-100">
            Simple. Poderoso. Tuyo.
          </p>
        </div>

        <button
          onClick={loginWithGoogle}
          className="w-full max-w-xs bg-white hover:bg-gray-100 text-gray-900 font-semibold py-7 px-10 text-lg rounded-2xl shadow-2xl flex items-center justify-center gap-4 transition-all hover:scale-105"
        >
          <FcGoogle className="text-3xl" />
          Continuar con Google
        </button>

        <p className="text-sm text-teal-200">
          Sin anuncios · Sin complicaciones · Solo progreso
        </p>
      </div>
    </main>
  );
}