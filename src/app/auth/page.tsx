"use client";
import { useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

function AuthPageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">(
    params.get("tab") === "signup" ? "signup" : "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tab === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            username: username || email.split("@")[0],
            rating: 800,
            games_played: 0,
            games_won: 0,
            city: city || null,
            is_pro: false,
            avatar_url: null,
          });
          toast.success("Account created! Welcome to ChessMind 🎉");
          router.push("/play");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        router.push("/play");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}>
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div className="glass-card" style={{ width: 420, padding: "40px", position: "relative" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>♟</div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 28,
                fontWeight: 700,
                marginBottom: 8,
              }}>
                {tab === "signin" ? "Welcome back" : "Join ChessMind"}
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                {tab === "signin" ? "Sign in to continue your journey" : "Start your chess journey today"}
              </p>
            </div>

            <div style={{
              display: "flex",
              background: "var(--bg-elevated)",
              borderRadius: 10,
              padding: 4,
              marginBottom: 28,
            }}>
              {(["signin", "signup"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 500,
                    transition: "all 0.2s",
                    background: tab === t ? "var(--bg-card)" : "transparent",
                    color: tab === t ? "var(--text-primary)" : "var(--text-muted)",
                    boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.2)" : "none",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {t === "signin" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {tab === "signup" && (
                <>
                  <InputField
                    icon={<User size={16} />}
                    placeholder="Username"
                    value={username}
                    onChange={setUsername}
                    required
                  />
                  <InputField
                    icon={<span style={{ fontSize: 16 }}>🏙</span>}
                    placeholder="City (e.g. Almaty)"
                    value={city}
                    onChange={setCity}
                  />
                </>
              )}

              <InputField
                icon={<Mail size={16} />}
                placeholder="Email"
                type="email"
                value={email}
                onChange={setEmail}
                required
              />

              <div style={{ position: "relative" }}>
                <InputField
                  icon={<Lock size={16} />}
                  placeholder="Password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={setPassword}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
                type="submit"
                className="btn-gold"
                disabled={loading}
                style={{ padding: "12px", fontSize: 15, marginTop: 8 }}
              >
                {loading ? "..." : tab === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  icon, placeholder, value, onChange, type = "text", required = false
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: "var(--bg-elevated)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      padding: "10px 14px",
    }}>
      <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          fontSize: 14,
          color: "var(--text-primary)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg-primary)" }} />}>
      <AuthPageContent />
    </Suspense>
  );
}