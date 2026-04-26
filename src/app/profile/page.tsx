"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/ui/Navbar";
import { useRouter } from "next/navigation";
import { Trophy, Target, TrendingUp, MapPin, Crown } from "lucide-react";
import Link from "next/link";

interface Profile {
  id: string;
  username: string;
  rating: number;
  games_played: number;
  games_won: number;
  city: string | null;
  is_pro: boolean;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/auth"); return; }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();;

      setProfile(data as Profile);
      setLoading(false);
    };
    load();
  }, [router]);

  if (loading) return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", justifyContent: "center", padding: 100 }}>
        <div className="chess-loader"><span /><span /><span /></div>
      </div>
    </div>
  );

  if (!profile) return null;

  const winRate = profile.games_played > 0
    ? Math.round((profile.games_won / profile.games_played) * 100) : 0;

  const ratingTitle = profile.rating >= 2000 ? "Master" :
    profile.rating >= 1500 ? "Expert" :
    profile.rating >= 1200 ? "Intermediate" :
    profile.rating >= 900 ? "Beginner" : "Newcomer";

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        {/* Profile header */}
        <div className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
            {/* Avatar */}
            <div style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: `hsl(${(profile.username.charCodeAt(0) * 20) % 360}, 50%, 35%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
              border: "3px solid var(--border-gold)",
            }}>
              {profile.username[0]?.toUpperCase()}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700 }}>
                  {profile.username}
                </h1>
                {profile.is_pro && <span className="pro-badge">PRO</span>}
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span className="rating-badge">♟ {profile.rating} · {ratingTitle}</span>
                {profile.city && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--text-muted)" }}>
                    <MapPin size={12} />
                    {profile.city}
                  </span>
                )}
              </div>

              <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 8 }}>
                Member since {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>

            {!profile.is_pro && (
              <Link href="/upgrade" style={{ textDecoration: "none" }}>
                <button style={{
                  background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(180,83,9,0.1))",
                  border: "1px solid rgba(245,158,11,0.3)",
                  borderRadius: 10,
                  padding: "10px 20px",
                  cursor: "pointer",
                  color: "var(--gold)",
                  fontSize: 14,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <Crown size={16} />
                  Upgrade to Pro
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 }}>
          <StatCard icon={<Trophy size={20} />} label="Games Played" value={profile.games_played.toString()} color="#F59E0B" />
          <StatCard icon={<Target size={20} />} label="Wins" value={profile.games_won.toString()} color="#22C55E" />
          <StatCard icon={<TrendingUp size={20} />} label="Win Rate" value={`${winRate}%`} color="#3B82F6" />
          <StatCard icon={<span style={{ fontSize: 20 }}>♟</span>} label="Rating" value={profile.rating.toString()} color="#A78BFA" />
        </div>

        {/* Quick actions */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
            Quick Actions
          </h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/play" style={{ textDecoration: "none" }}>
              <button className="btn-gold" style={{ padding: "10px 24px" }}>Play Now</button>
            </Link>
            <Link href="/leaderboard" style={{ textDecoration: "none" }}>
              <button className="btn-ghost" style={{ padding: "10px 24px" }}>View Leaderboard</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="glass-card" style={{ padding: 20 }}>
      <div style={{ color, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display', serif", lineHeight: 1, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
        {label}
      </div>
    </div>
  );
}
