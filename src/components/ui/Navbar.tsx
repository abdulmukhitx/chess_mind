"use client";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { Moon, Sun, Crown, Trophy, User as UserIcon, LogOut, Menu, X } from "lucide-react";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav style={{
      background: "var(--bg-secondary)",
      borderBottom: "1px solid var(--border)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      backdropFilter: "blur(12px)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 24 }}>♟</span>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              fontWeight: 700,
              background: "linear-gradient(135deg, #FCD34D, #F59E0B)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>ChessMind</span>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="hidden-mobile">
            <NavLink href="/play">Play</NavLink>
            <NavLink href="/leaderboard">Leaderboard</NavLink>
            {user && <NavLink href="/profile">Profile</NavLink>}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={toggleTheme}
              className="btn-ghost"
              style={{ padding: "8px", borderRadius: 8, display: "flex", alignItems: "center" }}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <>
                <Link href="/profile" style={{ textDecoration: "none" }}>
                  <button className="btn-ghost" style={{ padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                    <UserIcon size={16} />
                    <span style={{ fontSize: 14 }}>Profile</span>
                  </button>
                </Link>
                <button onClick={signOut} className="btn-ghost" style={{ padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" style={{ textDecoration: "none" }}>
                  <button className="btn-ghost" style={{ padding: "6px 16px", fontSize: 14 }}>Sign In</button>
                </Link>
                <Link href="/auth?tab=signup" style={{ textDecoration: "none" }}>
                  <button className="btn-gold" style={{ padding: "6px 16px", fontSize: 14 }}>Get Started</button>
                </Link>
              </>
            )}

            {/* Pro upgrade */}
            <Link href="/upgrade" style={{ textDecoration: "none" }}>
              <button style={{
                background: "linear-gradient(135deg, #F59E0B22, #B4530922)",
                border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: 8,
                padding: "6px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#F59E0B",
                fontSize: 13,
                fontWeight: 600,
              }}>
                <Crown size={14} />
                Pro
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <span style={{
        color: "var(--text-secondary)",
        fontSize: 14,
        fontWeight: 500,
        padding: "6px 12px",
        borderRadius: 8,
        cursor: "pointer",
        transition: "color 0.2s",
      }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
      >
        {children}
      </span>
    </Link>
  );
}
