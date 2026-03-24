import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import type { Page } from "@/components/AppSidebar";

export type Role = "admin" | "vendedor" | "dev" | "cliente";

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  hasAccess: (page: Page) => boolean;
  isLoggedIn: boolean;
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const ACCESS_MAP: Record<Role, Page[]> = {
  admin: ["dashboard", "proyectos", "pagos", "metricas", "ai-studio", "settings"],
  vendedor: ["dashboard", "proyectos", "pagos", "metricas", "ai-studio"],
  dev: ["dashboard", "proyectos", "ai-studio", "settings"],
  cliente: ["dashboard", "proyectos"],
};

const AuthContext = createContext<AuthContextType>({
  role: "admin",
  setRole: () => {},
  hasAccess: () => true,
  isLoggedIn: false,
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>("admin");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const hasAccess = (page: Page): boolean => {
    return ACCESS_MAP[role]?.includes(page) ?? false;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isLoggedIn = !!session;

  return (
    <AuthContext.Provider value={{ role, setRole, hasAccess, isLoggedIn, user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
