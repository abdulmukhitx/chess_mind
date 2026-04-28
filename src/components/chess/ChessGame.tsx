"use client";
import { useState, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { useChessGame } from "@/hooks/useChessGame";
import { AICoach } from "./AICoach";
import { Brain, RotateCcw } from "lucide-react";
import type { GameMode } from "@/hooks/useChessGame";
import { Chess } from "chess.js";

const PIECE_SYMBOLS: Record<string, string> = {
  p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
};
const PIECE_VALUES: Record<string, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9, k: 0,
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
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [moveSquares, setMoveSquares] = useState<Record<string, React.CSSProperties>>({});

  const calcAdvantage = () => {
    const whiteVal = capturedBlack.reduce((sum, p) => sum + (PIECE_VALUES[p] || 0), 0);
    const blackVal = capturedWhite.reduce((sum, p) => sum + (PIECE_VALUES[p] || 0), 0);
    return { white: whiteVal - blackVal, black: blackVal - whiteVal };
  };
  const advantage = calcAdvantage();

  const isMyTurn = mode === "local" || (
    (playerColor === "white" && turn === "w") ||
    (playerColor === "black" && turn === "b")
  );

  // Get possible moves for a square
  const getMoveOptions = useCallback((square: string) => {
    const chess = new Chess(fen);
    const moves = chess.moves({ square: square as any, verbose: true });
    if (moves.length === 0) return {};

    const squares: Record<string, React.CSSProperties> = {};
    moves.forEach(move => {
      const isCapture = chess.get(move.to as any);
      squares[move.to] = {
        background: isCapture
            ? "radial-gradient(circle, rgba(255,255,255,0.35) 5%, transparent 5%)"
            : "radial-gradient(circle, rgba(255,255,255,0.25) 25%, transparent 15%)",
        borderRadius: "90%",
      };
    });
    return squares;
  }, [fen]);

  const handleMove = useCallback((from: string, to: string, piece: string) => {
    const promotion = piece[1]?.toLowerCase() === "p" &&
      ((to[1] === "8" && piece[0] === "w") || (to[1] === "1" && piece[0] === "b"))
      ? "q" : undefined;
    const result = makeMove({ from, to, promotion });
    if (result) {
      setSelectedSquare(null);
      setMoveSquares({});
    }
    return result;
  }, [makeMove]);

  const handleSquareClick = useCallback((square: string) => {
    if (!isMyTurn || status !== "playing") return;

    const chess = new Chess(fen);
    const piece = chess.get(square as any);

    // If square already selected — try to move
    if (selectedSquare) {
      const moved = handleMove(selectedSquare, square, "");
      if (moved) {
        setSelectedSquare(null);
        setMoveSquares({});
        return;
      }
    }

    // Only select own pieces
    const isMyPiece = piece &&
      ((playerColor === "white" && piece.color === "w") ||
       (playerColor === "black" && piece.color === "b") ||
       mode === "local");

    if (isMyPiece) {
      setSelectedSquare(square);
      setMoveSquares(getMoveOptions(square));
    } else {
      setSelectedSquare(null);
      setMoveSquares({});
    }
  }, [fen, selectedSquare, isMyTurn, status, playerColor, mode, handleMove, getMoveOptions]);

  const handlePieceDragBegin = useCallback((_: string, square: string) => {
    setSelectedSquare(square);
    setMoveSquares(getMoveOptions(square));
  }, [getMoveOptions]);

  const handlePieceDragEnd = useCallback(() => {
    setSelectedSquare(null);
    setMoveSquares({});
  }, []);

  // Build square styles
  const customSquareStyles: Record<string, React.CSSProperties> = { ...moveSquares };

  if (lastMove) {
    customSquareStyles[lastMove.from] = { backgroundColor: "rgba(173, 186, 89, 0.4)" };
    customSquareStyles[lastMove.to] = { backgroundColor: "rgba(173, 186, 89, 0.5)" };
  }

  if (selectedSquare) {
    customSquareStyles[selectedSquare] = {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              boxShadow: "inset 0 0 0 3px rgba(255, 255, 255, 0.7)",
      ...(moveSquares[selectedSquare] || {}),
    };
  }

  const isWin = gameResult?.includes(playerColor === "white" ? "White" : "Black");
  const isDraw = gameResult?.includes("Draw");

  return (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

        <CapturedPieces pieces={capturedBlack} advantage={advantage.white > 0 ? advantage.white : 0} />

        <div className="chess-board-wrapper" style={{ width: "min(560px, 90vw)" }}>
          <Chessboard
            id="main-board"
            position={fen}
            onPieceDrop={handleMove}
            onSquareClick={handleSquareClick}
            onPieceDragBegin={handlePieceDragBegin}
            onPieceDragEnd={handlePieceDragEnd}
            boardOrientation={boardOrientation}
            boardWidth={Math.min(560, typeof window !== "undefined" ? window.innerWidth * 0.9 : 560)}
            customBoardStyle={{ borderRadius: "12px", boxShadow: "none" }}
            customLightSquareStyle={{ backgroundColor: "#F0D9B5" }}
            customDarkSquareStyle={{ backgroundColor: "#B58863" }}
            customSquareStyles={customSquareStyles}
            arePiecesDraggable={status === "playing" && isMyTurn && !isAIThinking}
          />
        </div>

        <CapturedPieces pieces={capturedWhite} advantage={advantage.black > 0 ? advantage.black : 0} />
      </div>

      {/* Side panel */}
      <div style={{ width: 260, display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: status === "playing" ? "#22C55E" : status === "ended" ? "#EF4444" : "#F59E0B",
            }} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {status === "waiting" ? "Waiting..." :
                status === "ended" ? "Game Over" :
                isAIThinking ? "AI is thinking..." :
                isMyTurn ? "Your turn" : "Opponent's turn"}
            </span>
          </div>

          {isCheck && status === "playing" && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 8, padding: "6px 10px", fontSize: 13, color: "#EF4444", marginBottom: 8,
            }}>
              ⚠️ King is in check!
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: turn === "w" ? "#F8F8F8" : "#1A1A1A",
              border: "2px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
            }}>
              {turn === "w" ? "♔" : "♚"}
            </div>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {turn === "w" ? "White" : "Black"} to move
            </span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 16, flex: 1 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Move History
          </h3>
          <div style={{ maxHeight: 240, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {history.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No moves yet</p>
            ) : (
              Array.from({ length: Math.ceil(history.length / 2) }, (_, i) => (
                <div key={i} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: 11, width: 20, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>
                    {i + 1}.
                  </span>
                  <span className="move-item" style={{ flex: 1 }}>{history[i * 2]?.san}</span>
                  {history[i * 2 + 1] && (
                    <span className="move-item" style={{ flex: 1 }}>{history[i * 2 + 1]?.san}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="btn-ghost" onClick={resetGame}
            style={{ padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <RotateCcw size={16} /> New Game
          </button>
          <button className="btn-ghost"
            onClick={() => setBoardOrientation(prev => prev === "white" ? "black" : "white")}
            style={{ padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13 }}>
            ↕ Flip Board
          </button>
        </div>

        {mode === "multiplayer" && roomId && (
          <div className="glass-card" style={{ padding: 12 }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Share link:</p>
            <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/play?room=${roomId}`)}
              className="btn-ghost" style={{ width: "100%", fontSize: 12, padding: "6px" }}>
              Copy Invite Link
            </button>
          </div>
        )}
      </div>

      {/* Game Over Modal */}
      {status === "ended" && gameResult && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: 24,
        }}>
          <div className="glass-card" style={{
            width: "100%", maxWidth: 380,
            padding: "40px 32px", textAlign: "center",
            border: `1px solid ${isWin ? "rgba(245,158,11,0.3)" : isDraw ? "rgba(59,130,246,0.3)" : "rgba(239,68,68,0.3)"}`,
          }}>
            <div style={{ fontSize: 60, marginBottom: 12 }}>
              {isWin ? "🏆" : isDraw ? "🤝" : "😔"}
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 32, fontWeight: 900, marginBottom: 8,
              color: isWin ? "var(--gold)" : isDraw ? "#3B82F6" : "#EF4444",
            }}>
              {isWin ? "You Won!" : isDraw ? "Draw!" : "You Lost!"}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>
              {gameResult}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pgn && (
                <button className="btn-gold" onClick={() => setShowAnalysis(true)}
                  style={{ padding: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 15 }}>
                  <Brain size={18} /> Analyze with AI Coach
                </button>
              )}
              <button className="btn-ghost" onClick={resetGame}
                style={{ padding: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <RotateCcw size={16} /> New Game
              </button>
            </div>
          </div>
        </div>
      )}

      {showAnalysis && (
        <AICoach pgn={pgn} playerColor={playerColor} onClose={() => setShowAnalysis(false)} />
      )}
    </div>
  );
}

function CapturedPieces({ pieces, advantage }: { pieces: string[]; advantage: number }) {
  const symbols: Record<string, string> = { p: "♟", r: "♜", n: "♞", b: "♝", q: "♛" };
  const values: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };
  const sorted = [...pieces].sort((a, b) => (values[a] || 0) - (values[b] || 0));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 28 }}>
      {sorted.map((p, i) => (
        <span key={i} style={{ fontSize: 16, opacity: 0.85 }}>{symbols[p] || p}</span>
      ))}
      {advantage > 0 && (
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", marginLeft: 6, fontFamily: "'JetBrains Mono', monospace" }}>
          +{advantage}
        </span>
      )}
    </div>
  );
}