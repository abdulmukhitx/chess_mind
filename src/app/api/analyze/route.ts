import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { pgn, playerColor } = await req.json();

    if (!pgn) {
      return NextResponse.json({ error: "PGN required" }, { status: 400 });
    }

    const prompt = `You are ChessMind AI Coach — a friendly chess coach. Analyze this chess game and respond ONLY with a JSON object, no extra text, no markdown backticks.

The player was playing as ${playerColor}.

PGN:
${pgn}

Respond with ONLY this JSON structure:
{
  "summary": "2-3 sentence overall game summary",
  "playerPerformance": "brief assessment of the player performance",
  "keyMoments": [
    {"move": "move notation", "moveNumber": 5, "type": "mistake", "explanation": "what happened and why"}
  ],
  "openingUsed": "name of opening played",
  "mainLessons": ["lesson 1", "lesson 2", "lesson 3"],
  "rating": 65
}

Rules:
- keyMoments: up to 4 items, type must be one of: mistake, blunder, brilliant, good
- rating: 0-100 how well the player played
- Be encouraging but honest
- Keep explanations simple and clear`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API error: ${response.status} — ${err}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    const cleaned = text.replace(/```json|```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON from response");

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ analysis });

  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}