"use client";
import { useState, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { useChessGame } from "@/hooks/useChessGame";
import { AICoach } from "./AICoach";
import { Brain, RotateCcw, Flag, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import type { GameMode } from "@/hooks/useChessGame";

const PIECE_SYMBOLS: Record<string, string> = {
  p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
};

interface ChessGameProps {
  mode: GameMode;
  aiLevel?: number;
  roomId?: string;
  userId?: string;
}

export function ChessGame({ mode, aiLevel = 5, roomId, userId }: ChessGameProps) {
  const {
    fen, history, status, playerColor, capturedWhite, capturedBlack,
    lastMove, isAIThinking, gameResult, pgn, makeMove, resetGame,
    isCheck, turn,
  } = useChessGame({ mode, aiLevel, roomId, userId });

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(playerColor);

  const handleMove = useCallback((from: string, to: string, piece: string) => {
    const promotion = piece[1].toLowerCase() === "p" &&
      ((to[1] === "8" && piece[0] === "w") || (to[1] === "1" && piece[0] === "b"))
      ? "q" : undefined;
    return makeMove({ from, to, promotion });
  }, [makeMove]);

  const customSquareStyles: Record<string, React.CSSProperties> = {};
  if (lastMove) {
    customSquareStyles[lastMove.from] = { backgroundColor: "rgba(173, 186, 89, 0.4)" };
    customSquareStyles[lastMove.to] = { backgroundColor: "rgba(173, 186, 89, 0.5)" };
  }

  const isMyTurn = mode === "local" || (
    (playerColor === "white" && turn === "w") ||
    (playerColor === "black" && turn === "b")
  );

  return (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
      {/* Board section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Black captures */}
        <CapturedPieces pieces={capturedBlack} label="Captured" />

        {/* Chess board */}
        <div className="chess-board-wrapper" style={{ width: "min(560px, 90vw)" }}>
          <Chessboard
            id="main-board"
            position={fen}
            onPieceDrop={handleMove}
            boardOrientation={boardOrientation}
            boardWidth={Math.min(560, typeof window !== "undefined" ? window.innerWidth * 0.9 : 560)}
            customBoardStyle={{ borderRadius: "12px", boxShadow: "none" }}
            customLightSquareStyle={{ backgroundColor: "#F0D9B5" }}
            customDarkSquareStyle={{ backgroundColor: "#B58863" }}
            customSquareStyles={customSquareStyles}
            arePiecesDraggable={status === "playing" && isMyTurn && !isAIThinking}
          />
        </div>

        {/* White captures */}
        <CapturedPieces pieces={capturedWhite} label="Captured" />
      </div>

      {/* Side panel */}
      <div style={{ width: 260, display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Status */}
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: status === "playing" ? "#22C55E" : status === "ended" ? "#EF4444" : "#F59E0B",
              animation: status === "playing" ? "pulse 2s infinite" : "none",
            }} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {status === "waiting" ? "Waiting for opponent..." :
                status === "ended" ? "Game Over" :
                isAIThinking ? "AI is thinking..." :
                isMyTurn ? "Your turn" : "Opponent's turn"}
            </span>
          </div>

          {gameResult && (
            <div style={{
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: 14,
              color: "var(--gold)",
              fontWeight: 500,
              marginBottom: 12,
            }}>
              🏆 {gameResult}
            </div>
          )}

          {isCheck && status === "playing" && (
            <div style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 13,
              color: "#EF4444",
              marginBottom: 12,
            }}>
              ⚠️ King is in check!
            </div>
          )}

          {/* Turn indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: turn === "w" ? "#F8F8F8" : "#1A1A1A",
              border: "2px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}>
              {turn === "w" ? "♔" : "♚"}
            </div>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {turn === "w" ? "White" : "Black"} to move
            </span>
          </div>
        </div>

        {/* Move history */}
        <div className="glass-card" style={{ padding: 16, flex: 1 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Move History
          </h3>
          <div style={{ maxHeight: 240, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {history.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No moves yet</p>
            ) : (
              Array.from({ length: Math.ceil(history.length / 2) }, (_, i) => (
                <div key={i} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: 12, width: 20, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>
                    {i + 1}.
                  </span>
                  <span className="move-item" style={{ flex: 1 }}>
                    {history[i * 2]?.san}
                  </span>
                  {history[i * 2 + 1] && (
                    <span className="move-item" style={{ flex: 1 }}>
                      {history[i * 2 + 1]?.san}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {status === "ended" && pgn && (
            <button
              className="btn-gold"
              onClick={() => setShowAnalysis(true)}
              style={{ padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              <Brain size={16} />
              Analyze with AI Coach
            </button>
          )}

          <button
            className="btn-ghost"
            onClick={resetGame}
            style={{ padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <RotateCcw size={16} />
            New Game
          </button>

          <button
            className="btn-ghost"
            onClick={() => setBoardOrientation(prev => prev === "white" ? "black" : "white")}
            style={{ padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13 }}
          >
            ↕ Flip Board
          </button>
        </div>

        {/* Mode info */}
        {mode === "multiplayer" && roomId && (
          <div className="glass-card" style={{ padding: 12 }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Share this link to play:</p>
            <div style={{
              background: "var(--bg-elevated)",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              color: "var(--gold)",
              wordBreak: "break-all",
            }}>
              {typeof window !== "undefined" ? `${window.location.origin}/play?room=${roomId}` : ""}
            </div>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard.writeText(`${window.location.origin}/play?room=${roomId}`);
                }
              }}
              className="btn-ghost"
              style={{ width: "100%", marginTop: 8, fontSize: 12, padding: "6px" }}
            >
              Copy Link
            </button>
          </div>
        )}
      </div>

      {showAnalysis && (
        <AICoach
          pgn={pgn}
          playerColor={playerColor}
          onClose={() => setShowAnalysis(false)}
        />
      )}
    </div>
  );
}

function CapturedPieces({ pieces, label }: { pieces: string[]; label: string }) {
  if (pieces.length === 0) return <div style={{ height: 28 }} />;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, height: 28 }}>
      {pieces.map((p, i) => (
        <span key={i} style={{ fontSize: 16, opacity: 0.7 }}>{PIECE_SYMBOLS[p] || p}</span>
      ))}
    </div>
  );
}
