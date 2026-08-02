import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { FallbackDatabase } from "./server/fallbackPrompts";
import { generatePromptWithMultiProvider } from "./server/apiProviders";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// System instruction for concept art prompt generator
const BASE_SYSTEM_INSTRUCTION = `You are an imaginative art teacher and creative director. Your mission is to write inspiring, clear, and vivid drawing prompts for digital and traditional artists.

Core Rules for Prompts:
1. Every prompt must be creative, visual, easy to picture, and immediately inspiring.
2. Language: Use clear, simple, natural, and easily understandable words. DO NOT use overly complicated, pretentious, academic, or obscure words (e.g. avoid terms like "chiaroscuro", "horologist", "alembic", "luminescent flora"). Write in clean, descriptive English that anyone can picture instantly.
3. Structure: Weave together a main character or subject, setting, clear lighting/color, and an interesting storytelling detail.
4. Length: Keep it tightly focused (35 to 60 words for standard, 15 to 25 for micro, 60 to 90 for detailed).
5. Absolute Output Formatting: Return ONLY the drawing prompt text itself. Do NOT include markdown code blocks, quotes, numbering, introductory phrases like "Here is your prompt:", or any conversational filler.`;

// Cache for daily prompt per date string
const dailyPromptCache: Record<string, { prompt: string; title: string; category: string; provider?: string }> = {};

// Helper to sanitize prompt string
function cleanPromptText(raw: string): string {
  if (!raw) return "";
  let text = raw.trim();
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith('`') && text.endsWith('`'))) {
    text = text.slice(1, -1).trim();
  }
  text = text.replace(/^(Prompt|Drawing Prompt|Result):\s*/i, "");
  return text;
}

// 1. Generate Prompt Endpoint (Multi-Provider Chain)
app.post("/api/generate-prompt", async (req, res) => {
  const { category, filters, customKeywords, lengthPreference, wheelState } = req.body;

  let userPrompt = `Generate a unique drawing prompt.`;
  if (category && category !== "random" && category !== "General Inspiration") {
    userPrompt += ` STRICT CATEGORY THEME: "${category}". The drawing prompt MUST be directly, explicitly, and unmistakably focused on this specific category topic ("${category}").`;
  }
  if (wheelState) {
    userPrompt += ` Incorporate these random wheel elements: Subject: "${wheelState.subject}", Mood: "${wheelState.mood}", Weather: "${wheelState.weather}", Lighting: "${wheelState.lighting}", Location: "${wheelState.location}", Twist: "${wheelState.twist}".`;
  }
  if (filters) {
    const activeFilters: string[] = [];
    if (filters.difficulty && filters.difficulty !== "Any") activeFilters.push(`Difficulty/Detail level: ${filters.difficulty}`);
    if (filters.mood && filters.mood !== "Any") activeFilters.push(`Mood: ${filters.mood}`);
    if (filters.lighting && filters.lighting !== "Any") activeFilters.push(`Lighting condition: ${filters.lighting}`);
    if (filters.perspective && filters.perspective !== "Any") activeFilters.push(`Camera Perspective: ${filters.perspective}`);
    if (filters.colorPalette && filters.colorPalette !== "Any") activeFilters.push(`Color Palette suggestion: ${filters.colorPalette}`);
    if (filters.action && filters.action !== "Any") activeFilters.push(`Action/Movement: ${filters.action}`);
    if (filters.emotion && filters.emotion !== "Any") activeFilters.push(`Emotion: ${filters.emotion}`);
    if (filters.constraints && filters.constraints !== "Any") activeFilters.push(`Artistic Constraint: ${filters.constraints}`);

    if (activeFilters.length > 0) {
      userPrompt += ` Specific constraints to weave naturally: ${activeFilters.join(", ")}.`;
    }
  }
  if (customKeywords) {
    userPrompt += ` Custom artist keywords: ${customKeywords}.`;
  }

  let lengthInstruction = "Aim for roughly 45-70 words.";
  if (lengthPreference === "micro") lengthInstruction = "Aim for concise 20-30 words.";
  if (lengthPreference === "detailed") lengthInstruction = "Aim for expansive 75-110 words with extra environmental depth.";

  userPrompt += ` ${lengthInstruction}`;

  try {
    const aiResult = await generatePromptWithMultiProvider(userPrompt, BASE_SYSTEM_INSTRUCTION);
    const generatedText = cleanPromptText(aiResult.prompt);

    res.json({
      prompt: generatedText,
      title: aiResult.title || "Artistic Inspiration",
      category: category || "General Inspiration",
      provider: aiResult.provider,
    });
  } catch (error: any) {
    console.info("Notice: Online AI APIs offline or un-reachable. Using DrawMuse Smart Offline Engine.");
    const fallback = FallbackDatabase.getRandomPrompt(category, filters, lengthPreference, wheelState);
    res.json({
      prompt: fallback.prompt,
      title: fallback.title,
      category: fallback.category || category || "General Inspiration",
      provider: "DrawMuse Smart Offline Engine",
    });
  }
});

// 2. Remix Prompt Endpoint
app.post("/api/remix-prompt", async (req, res) => {
  const { existingPrompt, category, filters } = req.body;
  const userPrompt = `Here is an existing drawing prompt: "${existingPrompt}". 
Please create a fresh creative REMIX of this prompt. Keep the core spirit or underlying idea, but transform the setting, lighting, artistic perspective, or unexpected twist to offer a completely new angle for the artist to paint.`;

  try {
    const aiResult = await generatePromptWithMultiProvider(userPrompt, BASE_SYSTEM_INSTRUCTION);
    res.json({
      prompt: cleanPromptText(aiResult.prompt),
      title: aiResult.title || "Remixed Concept",
      provider: aiResult.provider,
    });
  } catch (error: any) {
    console.info("Notice: Using Smart Prompt Engine remix fallback.");
    const fallback = FallbackDatabase.getRemix(existingPrompt || "An artistic portrait in dramatic light");
    res.json({
      prompt: fallback.prompt,
      title: fallback.title,
      provider: "DrawMuse Smart Offline Engine",
    });
  }
});

// 3. Expand Prompt Endpoint
app.post("/api/expand-prompt", async (req, res) => {
  const { existingPrompt } = req.body;
  const userPrompt = `Here is a concise drawing prompt: "${existingPrompt}".
Please EXPAND this concept into a richer, multi-layered visual scenario. Add details about atmospheric textures, environmental storytelling elements, secondary background details, and focal lighting highlights that an artist can explore in their artwork.`;

  try {
    const aiResult = await generatePromptWithMultiProvider(userPrompt, BASE_SYSTEM_INSTRUCTION);
    res.json({
      prompt: cleanPromptText(aiResult.prompt),
      provider: aiResult.provider,
    });
  } catch (error: any) {
    console.info("Notice: Using Smart Prompt Engine expansion fallback.");
    const fallback = FallbackDatabase.getExpand(existingPrompt || "A solitary figure in the fog");
    res.json({
      prompt: fallback.prompt,
      provider: "DrawMuse Smart Offline Engine",
    });
  }
});

// 4. Daily Featured Prompt Endpoint
app.get("/api/daily-prompt", async (req, res) => {
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  if (dailyPromptCache[todayStr]) {
    return res.json({ date: todayStr, ...dailyPromptCache[todayStr] });
  }

  const promptReq = `Generate today's featured daily drawing prompt for date ${todayStr}. Make it a captivating, universally inspiring scene suitable for all skill levels with beautiful lighting and memorable atmosphere.`;

  try {
    const aiResult = await generatePromptWithMultiProvider(promptReq, BASE_SYSTEM_INSTRUCTION);
    const dailyText = cleanPromptText(aiResult.prompt);

    dailyPromptCache[todayStr] = {
      prompt: dailyText,
      title: aiResult.title || "Daily Spotlight",
      category: "Daily Spotlight",
      provider: aiResult.provider,
    };

    res.json({
      date: todayStr,
      ...dailyPromptCache[todayStr],
    });
  } catch (error: any) {
    console.info("Notice: Using Smart Prompt Engine daily spotlight fallback.");
    const fallback = FallbackDatabase.getDailyPrompt(todayStr);
    dailyPromptCache[todayStr] = {
      prompt: fallback.prompt,
      title: fallback.title,
      category: "Daily Spotlight",
      provider: "DrawMuse Smart Offline Engine",
    };
    res.json({
      date: todayStr,
      ...dailyPromptCache[todayStr],
    });
  }
});

async function startServer() {
  const publicPath = path.join(process.cwd(), "public");
  app.use(express.static(publicPath));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DrawMuse server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
