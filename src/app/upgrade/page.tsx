"use client";
import { Navbar } from "@/components/ui/Navbar";
import { Crown, Check, Zap, Brain, Trophy, Palette } from "lucide-react";

export default function UpgradePage() {
  const handleUpgrade = () => {
    alert("Stripe integration coming soon! This is a demo of the upgrade flow.");
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <Crown size={48} style={{ color: "var(--gold)", marginBottom: 16 }} />
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 48,
            fontWeight: 900,
            marginBottom: 12,
          }}>
            Upgrade to{" "}
            <span style={{
              background: "linear-gradient(135deg, #FCD34D, #F59E0B, #B45309)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Pro</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 18, maxWidth: 480, margin: "0 auto" }}>
            Unlock the full power of ChessMind and take your game to the next level.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
          {/* Free */}
          <div className="glass-card" style={{ padding: 32 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                Free
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, marginBottom: 4 }}>
                $0
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 14 }}>Forever free</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {[
                "Play vs AI (all levels)",
                "Online multiplayer",
                "3 AI analyses per day",
                "Standard piece sets",
                "Global leaderboard",
              ].map(f => (
                <FeatureRow key={f} text={f} included />
              ))}
              {[
                "Unlimited AI analysis",
                "Custom piece themes",
                "Advanced game stats",
                "Priority matchmaking",
              ].map(f => (
                <FeatureRow key={f} text={f} included={false} />
              ))}
            </div>

            <button className="btn-ghost" style={{ width: "100%", padding: 12 }}>
              Current Plan
            </button>
          </div>

          {/* Pro */}
          <div className="glass-card-gold" style={{
            padding: 32,
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)",
            }} />

            <div style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "linear-gradient(135deg, #F59E0B, #B45309)",
              color: "white",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 20,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Most Popular
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                Pro
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, marginBottom: 4 }}>
                $9
                <span style={{ fontSize: 18, color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>
                  /month
                </span>
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 14 }}>Cancel anytime</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {[
                "Everything in Free",
                "Unlimited AI analysis",
                "Custom piece themes (10+)",
                "Detailed game statistics",
                "Priority matchmaking",
                "Export games as PDF",
                "Early access to features",
              ].map(f => (
                <FeatureRow key={f} text={f} included gold />
              ))}
            </div>

            <button
              className="btn-gold"
              onClick={handleUpgrade}
              style={{ width: "100%", padding: 14, fontSize: 16 }}
            >
              Upgrade to Pro
            </button>
          </div>
        </div>

        {/* Feature highlights */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { icon: <Brain size={24} />, title: "Unlimited Analysis", desc: "Get AI coaching after every game, no limits" },
            { icon: <Palette size={24} />, title: "Custom Themes", desc: "10+ piece sets including classic and modern" },
            { icon: <Zap size={24} />, title: "Priority Queue", desc: "Find matches faster with priority matchmaking" },
            { icon: <Trophy size={24} />, title: "Pro Badge", desc: "Stand out on the leaderboard with Pro badge" },
          ].map(f => (
            <div key={f.title} className="glass-card" style={{ padding: 20, textAlign: "center" }}>
              <div style={{ color: "var(--gold)", marginBottom: 10, display: "flex", justifyContent: "center" }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ text, included, gold = false }: { text: string; included: boolean; gold?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 18,
        height: 18,
        borderRadius: 4,
        background: included ? (gold ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)") : "rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {included ? (
          <Check size={12} style={{ color: gold ? "var(--gold)" : "#22C55E" }} />
        ) : (
          <span style={{ color: "var(--text-muted)", fontSize: 10 }}>—</span>
        )}
      </div>
      <span style={{
        fontSize: 14,
        color: included ? "var(--text-primary)" : "var(--text-muted)",
        textDecoration: included ? "none" : "none",
      }}>
        {text}
      </span>
    </div>
  );
}
