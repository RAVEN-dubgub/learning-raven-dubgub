"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail, registerWithEmail } from "@/lib/firebase-client";
import { GlitchHeading } from "@/components/glitch-heading";
import { NexusPanel } from "@/components/nexus-panel";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
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
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4">
      <NexusPanel className="space-y-4 p-6">
        <p className="font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-widest text-[var(--dedsec-blue)]">
          AUTH :: pitch-rise.firebase
        </p>
        <GlitchHeading as="h1" className="text-2xl">
          Sign in
        </GlitchHeading>
        <p className="dedsec-muted text-sm">
          Uses the PitchRise Firebase project (<code>pitch-rise</code>). Create an account here or sign in if you already use Ludwitt.
        </p>
        <label className="block space-y-1 text-sm">
          <span className="font-[family-name:var(--font-geist-mono)] text-xs uppercase">email</span>
          <input
            className="nexus-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-[family-name:var(--font-geist-mono)] text-xs uppercase">password</span>
          <input
            className="nexus-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error ? <p className="text-sm text-[var(--dedsec-error)]">{error}</p> : null}
        <button type="submit" className="nexus-btn w-full" disabled={busy}>
          {busy ? "Working…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
        <button
          type="button"
          className="dedsec-muted w-full text-sm underline"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Need an account? Register" : "Already registered? Sign in"}
        </button>
      </NexusPanel>
    </form>
  );
}
