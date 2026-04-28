# ♟ ChessMind — Chess Platform with AI Coaching

> Play chess, get smarter. AI-powered coaching after every game.

**Live Demo:** [chess-mind-three.vercel.app](https://chess-mind-three.vercel.app/)

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel)

---

## What is ChessMind?

ChessMind is a modern chess platform built for players who want to actually **improve** — not just play games and forget them.

After every game, the **AI Coach** (powered by Claude) analyzes your moves, identifies key mistakes, explains *why* they were mistakes, and gives you concrete lessons to work on. Traditional chess apps let you play. ChessMind makes you grow.

---

## Features

### Gameplay
| Feature | Status |
|---|---|
| Full chess rules (castling, en passant, checkmate, stalemate) | ✅ |
| Play vs AI — Stockfish engine, 6 difficulty levels | ✅ |
| Time controls — Bullet (1+0), Blitz (3+0, 5+0), Rapid (10+0, 10+5), Unlimited | ✅ |
| Live multiplayer via share link (Supabase Realtime) | ✅ |
| Local 2-player mode | ✅ |

### AI Coach (post-game analysis)
| Feature | Status |
|---|---|
| Performance score 0–100 | ✅ |
| Key moment detection — brilliant moves, mistakes, blunders | ✅ |
| Opening identification | ✅ |
| 3 personalized lessons to practice | ✅ |
| Powered by Claude (Anthropic) | ✅ |

### Platform
| Feature | Status |
|---|---|
| User authentication (sign up / sign in) | ✅ |
| ELO-based rating system | ✅ |
| Game history saved to database | ✅ |
| Global leaderboard with city filter | ✅ |
| User profiles & stats | ✅ |
| Dark / Light theme | ✅ |
| Mobile responsive design | ✅ |
| Freemium monetization (Pro tier) | ✅ |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS variables |
| Chess Logic | chess.js |
| Chess Board | react-chessboard |
| AI Engine | Stockfish 16 (Web Worker) |
| AI Coach | Claude API (Anthropic) |
| Database & Auth | Supabase (PostgreSQL + Auth + Realtime) |
| Deployment | Vercel |
| Fonts | Playfair Display + DM Sans |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/chessmind
cd chessmind
npm install
```

### 2. Set up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** → paste and run `supabase-schema.sql`
4. Copy your Project URL and anon key from **Settings → API**

### 3. Get API keys

- **Supabase:** Settings → API → Project URL + anon key
- **Anthropic:** [console.anthropic.com](https://console.anthropic.com) → API Keys

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=sk-ant-...
```

### 5. Add Stockfish

Download `stockfish.js` from [stockfishchess.org](https://stockfishchess.org) and place it in `/public/stockfish.js`.

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add the same environment variables in your Vercel project settings.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── play/             # Game page — mode selection + board
│   ├── leaderboard/      # Global rankings
│   ├── profile/          # User profile & stats
│   ├── upgrade/          # Pro subscription page
│   ├── auth/             # Sign in / Sign up
│   └── api/
│       └── analyze/      # AI Coach endpoint (Claude)
├── components/
│   ├── chess/
│   │   ├── ChessGame.tsx # Main game component + clocks
│   │   └── AICoach.tsx   # Post-game analysis UI
│   └── ui/
│       ├── Navbar.tsx
│       └── ThemeProvider.tsx
├── hooks/
│   └── useChessGame.ts   # Game logic + Stockfish + Multiplayer + Timers
└── lib/
    └── supabase.ts       # DB client + types
```

---

## Monetization

ChessMind uses a freemium model:

| | Free | Pro — $9/mo |
|---|---|---|
| AI analyses | 3 per day | Unlimited |
| Game modes | All | All |
| Piece themes | Standard | 10+ custom |
| Game statistics | Basic | Detailed |
| Matchmaking | Standard | Priority |
| Leaderboard | ✅ | ✅ + Pro badge |

### Business Potential

| Metric | Estimate |
|---|---|
| Target market | 500M+ chess players worldwide |
| Conversion rate | 3–5% free → Pro |
| Revenue at 1,000 MAU | ~$270–450/mo |
| Revenue at 10,000 MAU | ~$2,700–4,500/mo |

---

## Roadmap

- [ ] Payment integration
- [ ] Puzzle trainer mode
- [ ] Opening explorer
- [ ] Game review with engine lines
- [ ] Tournament brackets
- [ ] Mobile app (React Native)

---

*Built for the Summer Incubator 2026 application*
