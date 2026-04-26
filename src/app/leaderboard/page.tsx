"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/ui/Navbar";
import { Trophy, MapPin, TrendingUp } from "lucide-react";

interface PlayerRow {
  id: string;
  username: string;
  rating: number;
  games_played: number;
  games_won: number;
  city: string | null;
  is_pro: boolean;
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [cityFilter, setCityFilter] = useState("all");
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [cityFilter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    let query = supabase
      .from("profiles")
      .select("*")
      .order("rating", { ascending: false })
      .limit(50);

    if (cityFilter !== "all") {
      query = query.eq("city", cityFilter);
    }

    const { data } = await query;
    if (data) {
      setPlayers(data as PlayerRow[]);
      const uniqueCities = [...new Set(data.map((p: PlayerRow) => p.city).filter(Boolean))] as string[];
      setCities(uniqueCities);
    }
    setLoading(false);
  };

  const winRate = (p: PlayerRow) =>
    p.games_played > 0 ? Math.round((p.games_won / p.games_played) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Trophy size={40} style={{ color: "var(--gold)", marginBottom: 12 }} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, marginBottom: 8 }}>
            Global Leaderboard
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>Top players from around the world</p>
        </div>

        {/* City filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}>
          {["all", ...cities].map(city => (
            <button
              key={city}
              onClick={() => setCityFilter(city)}
              className={cityFilter === city ? "btn-gold" : "btn-ghost"}
              style={{
                padding: "6px 16px",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {city !== "all" && <MapPin size={12} />}
              {city === "all" ? "🌍 Global" : city}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div className="chess-loader" style={{ justifyContent: "center" }}>
              <span /><span /><span />
            </div>
          </div>
        ) : players.length === 0 ? (
          <div className="glass-card" style={{ padding: 60, textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", fontSize: 16 }}>
              No players yet. Be the first! 🏆
            </p>
          </div>
        ) : (
          <div className="glass-card" style={{ overflow: "hidden" }}>
            {/* Header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "52px 1fr 100px 80px 80px",
              gap: 16,
              padding: "12px 20px",
              borderBottom: "1px solid var(--border)",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              <span>#</span>
              <span>Player</span>
              <span style={{ textAlign: "center" }}>Rating</span>
              <span style={{ textAlign: "center" }}>Games</span>
              <span style={{ textAlign: "center" }}>Win %</span>
            </div>

            {players.map((player, i) => (
              <div
                key={player.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "52px 1fr 100px 80px 80px",
                  gap: 16,
                  padding: "14px 20px",
                  borderBottom: i < players.length - 1 ? "1px solid var(--border)" : "none",
                  alignItems: "center",
                  transition: "background 0.15s",
                  background: i < 3 ? `rgba(245,158,11,${0.04 - i * 0.01})` : "transparent",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
                onMouseLeave={e => (e.currentTarget.style.background = i < 3 ? `rgba(245,158,11,${0.04 - i * 0.01})` : "transparent")}
              >
                {/* Rank */}
                <div style={{ textAlign: "center" }}>
                  {i === 0 ? <span style={{ fontSize: 22 }}>🥇</span> :
                    i === 1 ? <span style={{ fontSize: 22 }}>🥈</span> :
                    i === 2 ? <span style={{ fontSize: 22 }}>🥉</span> :
                    <span style={{ fontSize: 14, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                      {i + 1}
                    </span>}
                </div>

                {/* Player */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `hsl(${(player.username.charCodeAt(0) * 20) % 360}, 50%, 35%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "white",
                    flexShrink: 0,
                  }}>
                    {player.username[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500 }}>
                      {player.username}
                      {player.is_pro && <span className="pro-badge">PRO</span>}
                    </div>
                    {player.city && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)" }}>
                        <MapPin size={10} />
                        {player.city}
                      </div>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div style={{ textAlign: "center" }}>
                  <span className="rating-badge">♟ {player.rating}</span>
                </div>

                {/* Games */}
                <div style={{ textAlign: "center", fontSize: 14, color: "var(--text-secondary)" }}>
                  {player.games_played}
                </div>

                {/* Win rate */}
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: winRate(player) >= 60 ? "#22C55E" : winRate(player) >= 40 ? "var(--text-primary)" : "#EF4444",
                  }}>
                    {winRate(player)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
