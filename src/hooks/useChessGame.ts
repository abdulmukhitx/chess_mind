"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Chess, Move } from "chess.js";
import { supabase } from "@/lib/supabase";

export type GameMode = "ai" | "multiplayer" | "local";
export type GameStatus = "waiting" | "playing" | "ended";

interface UseChessGameProps {
  mode: GameMode;
  aiLevel?: number;
  roomId?: string;
  userId?: string;
}

export function useChessGame({ mode, aiLevel = 5, roomId, userId }: UseChessGameProps) {
  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [history, setHistory] = useState<Move[]>([]);
  const [status, setStatus] = useState<GameStatus>(mode === "multiplayer" ? "waiting" : "playing");
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [pgn, setPgn] = useState("");
  const stockfishRef = useRef<Worker | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.realtime.channel> | null>(null);

  // Initialize Stockfish
  useEffect(() => {
    if (mode !== "ai") return;
    try {
      stockfishRef.current = new Worker("/stockfish.js");
      stockfishRef.current.postMessage("uci");
      stockfishRef.current.postMessage(`setoption name Skill Level value ${aiLevel}`);
      stockfishRef.current.onmessage = (e: MessageEvent) => {
        const msg = e.data as string;
        if (msg.startsWith("bestmove")) {
          const move = msg.split(" ")[1];
          if (move && move !== "(none)") {
            makeMove({ from: move.slice(0, 2), to: move.slice(2, 4), promotion: move[4] as "q" | undefined });
          }
          setIsAIThinking(false);
        }
      };
    } catch {
      console.log("Stockfish not available, using random moves");
    }

    return () => stockfishRef.current?.terminate();
  }, [mode, aiLevel]);

  // Multiplayer realtime
  useEffect(() => {
    if (mode !== "multiplayer" || !roomId) return;

    const channel = supabase.channel(`game:${roomId}`);
    channelRef.current = channel;

    channel
      .on("broadcast", { event: "move" }, ({ payload }: { payload: { fen: string; from: string; to: string; pgn: string } }) => {
        chess.load(payload.fen);
        setFen(payload.fen);
        setLastMove({ from: payload.from, to: payload.to });
        setPgn(payload.pgn);
        updateHistory();
        checkGameEnd();
      })
      .on("broadcast", { event: "join" }, ({ payload }: { payload: { color: "white" | "black" } }) => {
        setPlayerColor(payload.color === "white" ? "black" : "white");
        setStatus("playing");
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          channel.send({ type: "broadcast", event: "join", payload: { color: "white" } });
          setPlayerColor("white");
          setStatus("playing");
        }
      });

    return () => { channel.unsubscribe(); };
  }, [mode, roomId]);

  const updateHistory = useCallback(() => {
    setHistory([...chess.history({ verbose: true })]);
    setPgn(chess.pgn());

    // Update captured pieces
    const board = chess.board();
    const allPieces = board.flat().filter(Boolean);
    const wCap: string[] = [];
    const bCap: string[] = [];
    const pieceCount: Record<string, number> = { p: 8, n: 2, b: 2, r: 2, q: 1 };
    const counts: Record<string, number> = {};
    allPieces.forEach(p => {
      if (!p) return;
      const key = p.color + p.type;
      counts[key] = (counts[key] || 0) + 1;
    });
    Object.entries(pieceCount).forEach(([type, total]) => {
      const whiteMissing = total - (counts["w" + type] || 0);
      const blackMissing = total - (counts["b" + type] || 0);
      for (let i = 0; i < whiteMissing; i++) bCap.push(type);
      for (let i = 0; i < blackMissing; i++) wCap.push(type);
    });
    setCapturedWhite(wCap);
    setCapturedBlack(bCap);
  }, [chess]);

  const checkGameEnd = useCallback(() => {
    if (chess.isGameOver()) {
      setStatus("ended");
      if (chess.isCheckmate()) {
        const winner = chess.turn() === "w" ? "Black" : "White";
        setGameResult(`${winner} wins by checkmate!`);
      } else if (chess.isDraw()) {
        if (chess.isStalemate()) setGameResult("Draw by stalemate");
        else if (chess.isThreefoldRepetition()) setGameResult("Draw by repetition");
        else if (chess.isInsufficientMaterial()) setGameResult("Draw — insufficient material");
        else setGameResult("Draw");
      }
    }
  }, [chess]);

  const makeMove = useCallback((move: { from: string; to: string; promotion?: string }) => {
    try {
      const result = chess.move(move);
      if (!result) return false;

      setFen(chess.fen());
      setLastMove({ from: move.from, to: move.to });
      updateHistory();
      checkGameEnd();

      // Broadcast in multiplayer
      if (mode === "multiplayer" && channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "move",
          payload: { fen: chess.fen(), from: move.from, to: move.to, pgn: chess.pgn() },
        });
      }

      // Trigger AI
      if (mode === "ai" && !chess.isGameOver()) {
        const isPlayerTurn =
          (playerColor === "white" && chess.turn() === "b") ||
          (playerColor === "black" && chess.turn() === "w");
        if (isPlayerTurn) {
          setIsAIThinking(true);
          setTimeout(() => {
            if (stockfishRef.current) {
              stockfishRef.current.postMessage(`position fen ${chess.fen()}`);
              const depth = Math.min(aiLevel * 2, 20);
              stockfishRef.current.postMessage(`go depth ${depth}`);
            } else {
              // Fallback: random move
              const moves = chess.moves({ verbose: true });
              if (moves.length > 0) {
                const randomMove = moves[Math.floor(Math.random() * moves.length)];
                makeMove({ from: randomMove.from, to: randomMove.to, promotion: "q" });
              }
              setIsAIThinking(false);
            }
          }, 300);
        }
      }

      return true;
    } catch {
      return false;
    }
  }, [chess, mode, playerColor, aiLevel, updateHistory, checkGameEnd]);

  const resetGame = useCallback(() => {
    chess.reset();
    setFen(chess.fen());
    setHistory([]);
    setStatus("playing");
    setLastMove(null);
    setIsAIThinking(false);
    setGameResult(null);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setPgn("");
  }, [chess]);

  return {
    fen,
    history,
    status,
    playerColor,
    capturedWhite,
    capturedBlack,
    lastMove,
    isAIThinking,
    gameResult,
    pgn,
    makeMove,
    resetGame,
    isCheck: chess.inCheck(),
    turn: chess.turn(),
  };
}
