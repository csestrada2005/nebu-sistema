import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const { lang } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const tt = {
    es: { email: "Email", password: "Contraseña", enter: "Entrar", forgot: "¿Olvidaste tu contraseña?" },
    en: { email: "Email", password: "Password", enter: "Sign in", forgot: "Forgot your password?" },
  }[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0D0D0D" }}>
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-[32px] font-bold tracking-tight" style={{ color: "#FFFFFF" }}>
            NEBU
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "#71717A" }}>{tt.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
              style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)", color: "#FFFFFF" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#E63946")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
              placeholder="email@nebu.studio"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "#71717A" }}>{tt.password}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-lg text-sm outline-none transition-colors"
                style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)", color: "#FFFFFF" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#E63946")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: "#71717A" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{ backgroundColor: "#E63946", color: "#FFFFFF" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C62828")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E63946")}
          >
            {tt.enter}
          </button>
        </form>

        <div className="text-center">
          <button className="text-xs transition-colors" style={{ color: "#71717A" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#71717A")}
          >
            {tt.forgot}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
