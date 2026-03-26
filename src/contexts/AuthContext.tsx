import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import type { Page } from "@/components/AppSidebar";

export type Role = "admin" | "vendedor" | "dev" | "cliente";

interface Profile {
  full_name: string;
  avatar_url: string;
  email: string;
}

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  hasAccess: (page: Page) => boolean;
  isLoggedIn: boolean;
  user: User | null;
  session: Session | null;
  profile: Profile | null;
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
  profile: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>("cliente");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, email")
      .eq("id", userId)
      .single();
    
    if (profileData) {
      setProfile(profileData as Profile);
    }

    // Fetch role using RPC
    const { data: roleData } = await supabase.rpc("get_user_role", { _user_id: userId });
    if (roleData) {
      setRole(roleData as Role);
    } else {
      setRole("cliente");
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          // Defer data fetching to avoid deadlock with auth state
          setTimeout(() => fetchUserData(session.user.id), 0);
        } else {
          setProfile(null);
          setRole("cliente");
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
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
    <AuthContext.Provider value={{ role, setRole, hasAccess, isLoggedIn, user, session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
