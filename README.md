# ♟ ChessMind — Chess Platform with AI Coaching

> Play chess, get smarter. AI-powered coaching after every game.

**Live Demo:** https://chess-mind-three.vercel.app/  
**Tech Stack:** Next.js 14 · TypeScript · Supabase · Claude AI · Stockfish

---

## What is ChessMind?

ChessMind is a modern chess platform built for players who want to **actually improve** — not just play games and forget them. After every game, our AI Coach (powered by Claude) analyzes your moves, finds your mistakes, explains why they were mistakes, and gives you concrete lessons to improve.

### Who is it for?

- Chess beginners who want to learn faster
- Intermediate players stuck at a plateau
- Anyone who wants personalized feedback without paying for a coach

### Why is it valuable?

Traditional chess apps let you play. ChessMind makes you **grow**. The AI Coach feature turns every game into a learning session.

---

## Features

### Level: GREAT ✨

| Feature | Status |
|---------|--------|
| Full chess rules (castling, en passant, checkmate, stalemate) | ✅ |
| Play vs AI (Stockfish, 6 difficulty levels) | ✅ |
| Live multiplayer via share link (WebSockets / Supabase Realtime) | ✅ |
| **AI Coach** — post-game analysis with Claude | ✅ |
| User authentication (sign up / sign in) | ✅ |
| Game history saved to database | ✅ |
| Global leaderboard with city filter | ✅ |
| Dark / Light theme | ✅ |
| Mobile responsive design | ✅ |
| **Upgrade to Pro** monetization page | ✅ |
| Rating system (ELO-based) | ✅ |

### AI Coach Features
- **Performance score** (0–100) for each game
- **Key moment detection** — brilliant moves, mistakes, blunders
- **Opening identification** — learn what opening you played
- **3 personalized lessons** — specific things to practice
- Powered by Claude (Anthropic)

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom CSS variables
- **Chess Logic:** chess.js (full rule validation)
- **Chess Board:** react-chessboard
- **AI Engine:** Stockfish 16 (via Web Worker)
- **AI Coach:** Claude (Anthropic API)
- **Database & Auth:** Supabase (PostgreSQL + Auth + Realtime)
- **Deployment:** Vercel
- **Fonts:** Playfair Display + DM Sans

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
4. Copy your **Project URL** and **anon key** from Settings → API

### 3. Get your API keys

- **Supabase:** Settings → API → copy URL and anon key
- **Anthropic:** [console.anthropic.com](https://console.anthropic.com) → API Keys

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=sk-ant-...
```

### 5. Add Stockfish

Download `stockfish.js` from [stockfishchess.org](https://stockfishchess.org/download/) and place it in `/public/stockfish.js`.

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

Add the same environment variables in Vercel project settings.

---

## Monetization Strategy

ChessMind has a built-in **freemium model**:

- **Free tier:** 3 AI analyses per day, standard pieces, all game modes
- **Pro — $9/month:** Unlimited AI analysis, 10+ custom piece themes, advanced stats, priority matchmaking

The upgrade page is fully designed and ready to connect to Stripe.

---

## Business Potential

| Metric | Estimate |
|--------|----------|
| Target users | Chess learners (500M+ worldwide) |
| Conversion rate | 3-5% free → Pro |
| Revenue at 1,000 MAU | ~$270-450/mo |
| Revenue at 10,000 MAU | ~$2,700-4,500/mo |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── play/             # Game page (mode selection + board)
│   ├── leaderboard/      # Global rankings
│   ├── profile/          # User profile & stats
│   ├── upgrade/          # Pro subscription page
│   ├── auth/             # Sign in / Sign up
│   └── api/
│       └── analyze/      # AI Coach endpoint
├── components/
│   ├── chess/
│   │   ├── ChessGame.tsx # Main game component
│   │   └── AICoach.tsx   # Post-game analysis UI
│   └── ui/
│       ├── Navbar.tsx
│       └── ThemeProvider.tsx
├── hooks/
│   └── useChessGame.ts   # Game logic + Stockfish + Multiplayer
└── lib/
    └── supabase.ts        # DB client + types
```

---

*Built for the Summer Incubator 2025 application*
