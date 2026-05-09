import { Navigate } from "react-router-dom";

// ── Supabase: replace body of isAuthenticated() ───────────────────────────────
// import { supabase } from "../lib/supabaseClient";
// const { data: { session } } = await supabase.auth.getSession();
// return !!session;
// (also convert ProtectedRoute to async / use a useEffect+useState pattern)
// ─────────────────────────────────────────────────────────────────────────────
function isAuthenticated(): boolean {
  return localStorage.getItem("tab_authed") === "true";
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
