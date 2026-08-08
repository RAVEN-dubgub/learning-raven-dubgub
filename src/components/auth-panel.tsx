"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { getIdToken, logoutFirebase, watchAuth } from "@/lib/firebase-client";

export function useFirebaseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return watchAuth((next) => {
      setUser(next);
      setLoading(false);
    });
  }, []);

  return { user, loading, getIdToken, logout: logoutFirebase };
}

export function AuthPanel() {
  const { user, loading, logout } = useFirebaseUser();

  if (loading) return <p className="holo-muted text-sm">Checking PitchRise session…</p>;
  if (!user) {
    return (
      <p className="holo-muted text-sm">
        Sign in with your PitchRise/Ludwitt Firebase account to sync learning events.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className="rounded-full border border-cyan-400/30 px-3 py-1">
        {user.email}
      </span>
      <button type="button" className="holo-btn text-sm" onClick={() => logout()}>
        Sign out
      </button>
    </div>
  );
}
