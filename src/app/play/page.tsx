"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { ChessGame } from "@/components/chess/ChessGame";
import { Bot, Users, Monitor, Sliders, Link, ChevronRight } from "lucide-react";
import type { GameMode } from "@/hooks/useChessGame";

const AI_LEVELS = [
  { value: 1, label: "Beginner", desc: "Perfect for learning" },
  { value: 3, label: "Easy", desc: "Makes occasional mistakes" },
  { value: 5, label: "Medium", desc: "Balanced challenge" },
  { value: 8, label: "Hard", desc: "Strong positional play" },
  { value: 15, label: "Expert", desc: "Near-perfect play" },
  { value: 20, label: "Grandmaster", desc: "Maximum difficulty" },
];

export default function PlayPage() {
  const params = useSearchParams();
  const [mode, setMode] = useState<GameMode | null>(null);
  const [aiLevel, setAiLevel] = useState(5);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const roomParam = params.get("room");
    const modeParam = params.get("mode");

    if (roomParam) {
      setRoomId(roomParam);
      setMode("multiplayer");
      setGameStarted(true);
    } else if (modeParam === "multiplayer") {
      setMode("multiplayer");
    }
  }, [params]);

  const startGame = () => {
    if (mode === "multiplayer" && !roomId) {
      const newRoomId = Math.random().toString(36).slice(2, 10).toUpperCase();
      setRoomId(newRoomId);
    }
    setGameStarted(true);
  };

  if (gameStarted && mode) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Navbar />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <span style={{ fontSize: 24 }}>
              {mode === "ai" ? "🤖" : mode === "multiplayer" ? "🔗" : "👥"}
            </span>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700 }}>
                {mode === "ai" ? `Playing vs AI (${AI_LEVELS.find(l => l.value === aiLevel)?.label})` :
                  mode === "multiplayer" ? "Online Multiplayer" : "Local 2-Player"}
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                {mode === "ai" ? "After the game, get AI coaching analysis" :
                  mode === "multiplayer" ? "Share the link with your friend" :
                  "Play on the same screen"}
              </p>
            </div>
            <button
              onClick={() => { setGameStarted(false); setRoomId(null); }}
              className="btn-ghost"
              style={{ marginLeft: "auto", padding: "8px 16px", fontSize: 13 }}
            >
              ← Back
            </button>
          </div>

          <ChessGame
            mode={mode}
            aiLevel={aiLevel}
            roomId={roomId || undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 42,
            fontWeight: 900,
            marginBottom: 12,
          }}>
            Choose Your Game
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 17 }}>
            Pick a mode and start playing
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
          <ModeCard
            icon={<Bot size={32} />}
            title="vs AI"
            desc="Play against Stockfish chess engine"
            color="#F59E0B"
            selected={mode === "ai"}
            onClick={() => setMode("ai")}
          />
          <ModeCard
            icon={<Link size={32} />}
            title="Online"
            desc="Play with a friend via share link"
            color="#3B82F6"
            selected={mode === "multiplayer"}
            onClick={() => setMode("multiplayer")}
          />
          <ModeCard
            icon={<Monitor size={32} />}
            title="Local"
            desc="Two players on one screen"
            color="#22C55E"
            selected={mode === "local"}
            onClick={() => setMode("local")}
          />
        </div>

        {/* AI level selector */}
        {mode === "ai" && (
          <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Sliders size={16} style={{ color: "var(--gold)" }} />
              AI Difficulty
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {AI_LEVELS.map(level => (
                <button
                  key={level.value}
                  onClick={() => setAiLevel(level.value)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: `1px solid ${aiLevel === level.value ? "rgba(245,158,11,0.4)" : "var(--border)"}`,
                    background: aiLevel === level.value ? "rgba(245,158,11,0.1)" : "var(--bg-elevated)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: aiLevel === level.value ? "var(--gold)" : "var(--text-primary)" }}>
                    {level.label}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{level.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {mode && (
          <div style={{ textAlign: "center" }}>
            <button
              className="btn-gold"
              onClick={startGame}
              style={{ padding: "14px 48px", fontSize: 16, display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              Start Game <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ModeCard({
  icon, title, desc, color, selected, onClick
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? `${color}10` : "var(--bg-card)",
        border: `1px solid ${selected ? color + "40" : "var(--border)"}`,
        borderRadius: 16,
        padding: 24,
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.2s",
        transform: selected ? "translateY(-2px)" : "none",
        boxShadow: selected ? `0 8px 24px ${color}20` : "none",
      }}
    >
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 14,
        background: `${color}15`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        marginBottom: 16,
      }}>
        {icon}
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{desc}</div>
    </button>
  );
}
