"use client";
import { useState } from "react";
import { Brain, TrendingUp, Star, AlertTriangle, Zap, BookOpen } from "lucide-react";

interface KeyMoment {
  move: string;
  moveNumber: number;
  type: "mistake" | "blunder" | "brilliant" | "good";
  explanation: string;
}

interface Analysis {
  summary: string;
  playerPerformance: string;
  keyMoments: KeyMoment[];
  openingUsed: string;
  mainLessons: string[];
  rating: number;
}

interface AICoachProps {
  pgn: string;
  playerColor: "white" | "black";
  onClose: () => void;
}

export function AICoach({ pgn, playerColor, onClose }: AICoachProps) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pgn, playerColor }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data.analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const momentColor = (type: string) => {
    switch (type) {
      case "brilliant": return "#F59E0B";
      case "good": return "#22C55E";
      case "mistake": return "#F97316";
      case "blunder": return "#EF4444";
      default: return "var(--text-secondary)";
    }
  };

  const momentIcon = (type: string) => {
    switch (type) {
      case "brilliant": return "★";
      case "good": return "✓";
      case "mistake": return "?";
      case "blunder": return "✗";
      default: return "·";
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      padding: 24,
    }}>
      <div className="glass-card" style={{
        width: "100%",
        maxWidth: 600,
        maxHeight: "90vh",
        overflow: "auto",
        padding: 32,
        position: "relative",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            fontSize: 20,
          }}
        >×</button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "rgba(245,158,11,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--gold)",
          }}>
            <Brain size={22} />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700 }}>
              AI Coach Analysis
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Powered by Claude</p>
          </div>
        </div>

        {!analysis && !loading && !error && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
            <p style={{ color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>
              Let the AI analyze your game and find your key mistakes, brilliant moves, and lessons to improve.
            </p>
            <button className="btn-gold" onClick={analyze} style={{ padding: "12px 32px", fontSize: 15 }}>
              Analyze My Game
            </button>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div className="chess-loader" style={{ justifyContent: "center", marginBottom: 16 }}>
              <span /><span /><span />
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              Analyzing your moves...
            </p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <AlertTriangle size={40} style={{ color: "var(--error)", marginBottom: 16 }} />
            <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>{error}</p>
            <button className="btn-ghost" onClick={analyze}>Try Again</button>
          </div>
        )}

        {analysis && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Performance score */}
            <div style={{
              background: "var(--bg-elevated)",
              borderRadius: 12,
              padding: 20,
              textAlign: "center",
            }}>
              <div style={{
                fontSize: 56,
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                color: analysis.rating >= 70 ? "#22C55E" : analysis.rating >= 50 ? "#F59E0B" : "#EF4444",
                lineHeight: 1,
                marginBottom: 4,
              }}>
                {analysis.rating}
              </div>
              <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>Performance Score</div>
              <div style={{
                height: 6,
                background: "var(--border)",
                borderRadius: 3,
                marginTop: 12,
                overflow: "hidden",
              }}>
                <div style={{
                  width: `${analysis.rating}%`,
                  height: "100%",
                  background: analysis.rating >= 70 ? "#22C55E" : analysis.rating >= 50 ? "#F59E0B" : "#EF4444",
                  borderRadius: 3,
                  transition: "width 1s ease",
                }} />
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card-gold" style={{ padding: 16 }}>
              <p style={{ lineHeight: 1.7, color: "var(--text-secondary)", fontSize: 14 }}>
                {analysis.summary}
              </p>
            </div>

            {/* Opening */}
            {analysis.openingUsed && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <BookOpen size={16} style={{ color: "var(--gold)", flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                  Opening: <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{analysis.openingUsed}</span>
                </span>
              </div>
            )}

            {/* Key moments */}
            {analysis.keyMoments?.length > 0 && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <Zap size={16} style={{ color: "var(--gold)" }} />
                  Key Moments
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {analysis.keyMoments.map((m, i) => (
                    <div key={i} style={{
                      background: "var(--bg-elevated)",
                      borderLeft: `3px solid ${momentColor(m.type)}`,
                      borderRadius: "0 8px 8px 0",
                      padding: "10px 14px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ color: momentColor(m.type), fontSize: 16 }}>{momentIcon(m.type)}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600 }}>
                          Move {m.moveNumber}: {m.move}
                        </span>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: momentColor(m.type),
                          textTransform: "capitalize",
                          background: `${momentColor(m.type)}15`,
                          padding: "2px 8px",
                          borderRadius: 10,
                        }}>
                          {m.type}
                        </span>
                      </div>
                      <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                        {m.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lessons */}
            {analysis.mainLessons?.length > 0 && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <TrendingUp size={16} style={{ color: "#22C55E" }} />
                  Lessons to Improve
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {analysis.mainLessons.map((lesson, i) => (
                    <div key={i} style={{
                      display: "flex",
                      gap: 10,
                      padding: "8px 12px",
                      background: "var(--bg-elevated)",
                      borderRadius: 8,
                      fontSize: 14,
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                    }}>
                      <span style={{ color: "#22C55E", flexShrink: 0, marginTop: 2 }}>→</span>
                      {lesson}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className="btn-ghost" onClick={onClose} style={{ marginTop: 8 }}>
              Back to Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
