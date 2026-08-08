"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail, registerWithEmail } from "@/lib/firebase-client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("wolfscotland@gmail.com");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      router.push("/learn");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="holo-panel mx-auto max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-semibold">PitchRise sign-in</h1>
      <p className="holo-muted text-sm">
        Uses the PitchRise Firebase project (`pitch-rise`). Create an account here or sign in if you already use Ludwitt.
      </p>
      <label className="block space-y-1 text-sm">
        <span>Email</span>
        <input
          className="w-full rounded-lg border border-cyan-400/20 bg-black/30 px-3 py-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>Password</span>
        <input
          className="w-full rounded-lg border border-cyan-400/20 bg-black/30 px-3 py-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <button type="submit" className="holo-btn w-full" disabled={busy}>
        {busy ? "Working…" : mode === "login" ? "Sign in" : "Create account"}
      </button>
      <button
        type="button"
        className="holo-muted w-full text-sm underline"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "Need an account? Register" : "Already registered? Sign in"}
      </button>
    </form>
  );
}
