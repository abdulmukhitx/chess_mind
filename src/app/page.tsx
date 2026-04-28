"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Trophy, Brain, Zap, Users, Crown, ChevronRight } from "lucide-react";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 24px 60px",
          textAlign: "center",
          position: "relative",
        }}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 400,
          background: "radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: 20,
            padding: "6px 16px",
            marginBottom: 24,
            fontSize: 13,
            color: "var(--gold)",
            fontWeight: 500,
          }}>
            <Zap size={14} />
            Powered by AI · Play anywhere · Free to start
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(48px, 8vw, 96px)",
            fontWeight: 900,
            lineHeight: 1.05,
            marginBottom: 24,
            letterSpacing: "-0.02em",
          }}>
            Chess, reinvented<br />
            <span style={{
              background: "linear-gradient(135deg, #FCD34D, #F59E0B, #B45309)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>with AI coaching</span>
          </h1>

          <p style={{
            fontSize: 20,
            color: "var(--text-secondary)",
            maxWidth: 560,
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}>
            Play against a smart AI, challenge friends online, and get personalized coaching after every game. Your chess evolution starts here.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/play" style={{ textDecoration: "none" }}>
              <button className="btn-gold" style={{ padding: "14px 32px", fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
                Start Playing <ChevronRight size={18} />
              </button>
            </Link>
            <Link href="/play?mode=multiplayer" style={{ textDecoration: "none" }}>
              <button className="btn-ghost" style={{ padding: "14px 32px", fontSize: 16 }}>
                Challenge a Friend
              </button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
        }}>
          <FeatureCard icon={<Brain size={28} />} title="AI Coach"
            desc="After every game, get a detailed breakdown of your mistakes and suggested improvements — like having a grandmaster in your pocket."
            color="#F59E0B" />
          <FeatureCard icon={<Users size={28} />} title="Live Multiplayer"
            desc="Challenge friends with a link. Real-time moves via WebSockets. No account needed for your opponent."
            color="#3B82F6" />
          <FeatureCard icon={<Zap size={28} />} title="Play vs AI"
            desc="Face Stockfish at any difficulty from beginner to grandmaster level. Improve at your own pace."
            color="#22C55E" />
          <FeatureCard icon={<Trophy size={28} />} title="Global Leaderboard"
            desc="Compete for the top spot. Rankings by city — see who the best player in Almaty, Astana, or Moscow is."
            color="#EF4444" />
        </div>
      </motion.section>

      {/* Pro upgrade CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div className="glass-card-gold" style={{ padding: "48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: -100, right: -100, width: 300, height: 300,
            background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
          }} />
          <Crown size={40} style={{ color: "var(--gold)", marginBottom: 16 }} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
            Upgrade to Pro
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 17, marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            Unlimited AI analysis, custom piece skins, advanced stats, and priority matchmaking.
          </p>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            {["Unlimited AI analysis", "Custom piece themes", "Advanced game stats", "Priority matchmaking"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", fontSize: 14 }}>
                <span style={{ color: "var(--gold)" }}>✓</span> {f}
              </div>
            ))}
          </div>
          <Link href="/upgrade" style={{ textDecoration: "none" }}>
            <button className="btn-gold" style={{ padding: "14px 40px", fontSize: 16 }}>
              Upgrade to Pro — $9/mo
            </button>
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "32px 24px",
        textAlign: "center",
        color: "var(--text-muted)",
        fontSize: 13,
      }}>
        <span style={{ fontFamily: "'Playfair Display', serif", color: "var(--gold)", fontWeight: 600 }}>ChessMind</span>
        {" "}&copy; 2025 · Made with ♟ and AI
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) {
  return (
    <motion.div
      className="glass-card"
      whileHover={{ translateY: -4, boxShadow: `0 12px 32px ${color}20` }}
      transition={{ duration: 0.2 }}
      style={{ padding: 28 }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: `${color}15`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16, color,
      }}>
        {icon}
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 14 }}>{desc}</p>
    </motion.div>
  );
}