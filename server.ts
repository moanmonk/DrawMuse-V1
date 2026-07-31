import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { FallbackDatabase } from "./server/fallbackPrompts";
import { ensureIconsExist } from "./src/server/generateIcons";

dotenv.config();

// Ensure iOS Safari Apple Touch icons & manifest exist on startup
ensureIconsExist();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// System instruction for concept art prompt generator
const BASE_SYSTEM_INSTRUCTION = `You are an imaginative art teacher and creative director. Your mission is to write inspiring, clear, and vivid drawing prompts for digital and traditional artists.

Core Rules for Prompts:
1. Every prompt must be creative, visual, easy to picture, and immediately inspiring.
2. Language: Use clear, simple, natural, and easily understandable words. DO NOT use overly complicated, pretentious, academic, or obscure words (e.g. avoid terms like "chiaroscuro", "horologist", "alembic", "luminescent flora"). Write in clean, descriptive English that anyone can picture instantly.
3. Structure: Weave together a main character or subject, setting, clear lighting/color, and an interesting storytelling detail.
4. Length: Keep it tightly focused (35 to 60 words for standard, 15 to 25 for micro, 60 to 90 for detailed).
5. Absolute Output Formatting: Return ONLY the drawing prompt text itself. Do NOT include markdown code blocks, quotes, numbering, introductory phrases like "Here is your prompt:", or any conversational filler.`;

// Cache for daily prompt per date string
const dailyPromptCache: Record<string, { prompt: string; title: string; category: string }> = {};

// Helper to sanitize prompt string
function cleanPromptText(raw: string): string {
  if (!raw) return "";
  let text = raw.trim();
  // Strip surrounding quotes if any
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith('`') && text.endsWith('`'))) {
    text = text.slice(1, -1).trim();
  }
  // Strip markdown prefixes or "Prompt:"
  text = text.replace(/^(Prompt|Drawing Prompt|Result):\s*/i, "");
  return text;
}

// 1. Generate Prompt Endpoint
app.post("/api/generate-prompt", async (req, res) => {
  try {
    const { category, filters, customKeywords, lengthPreference, wheelState } = req.body;
    const ai = getGeminiClient();

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

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION,
        temperature: 0.9,
      },
    });

    const generatedText = cleanPromptText(response.text || "");

    // Also generate a short 2-5 word artistic title for the prompt
    const titleResponse = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Given this drawing prompt: "${generatedText}", give it a short 2-5 word poetic title. Return ONLY the title, no quotes or punctuation.`,
      config: {
        temperature: 0.7,
      },
    });

    const generatedTitle = cleanPromptText(titleResponse.text || "Artistic Inspiration");

    res.json({
      prompt: generatedText,
      title: generatedTitle,
      category: category || "General Inspiration",
    });
  } catch (error: any) {
    console.info("Gemini API quota or network limit reached (using fallback prompt engine):", error?.status || error?.message || "Quota limit");
    const fallback = FallbackDatabase.getRandomPrompt(req.body.category, req.body.filters);
    res.json({
      prompt: fallback.prompt,
      title: fallback.title,
      category: fallback.category || req.body.category || "General Inspiration",
    });
  }
});

// 2. Remix Prompt Endpoint
app.post("/api/remix-prompt", async (req, res) => {
  try {
    const { existingPrompt, category, filters } = req.body;
    const ai = getGeminiClient();

    const userPrompt = `Here is an existing drawing prompt: "${existingPrompt}". 
Please create a fresh creative REMIX of this prompt. Keep the core spirit or underlying idea, but transform the setting, lighting, artistic perspective, or unexpected twist to offer a completely new angle for the artist to paint.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION,
        temperature: 0.95,
      },
    });

    const remixedText = cleanPromptText(response.text || "");

    const titleResponse = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Give a short 2-5 word poetic title for this remixed drawing prompt: "${remixedText}". Return ONLY the title.`,
    });

    res.json({
      prompt: remixedText,
      title: cleanPromptText(titleResponse.text || "Remixed Concept"),
    });
  } catch (error: any) {
    console.warn("Gemini API error (using fallback remix):", error?.message || error);
    const fallback = FallbackDatabase.getRemix(req.body.existingPrompt || "An artistic portrait in dramatic light");
    res.json({
      prompt: fallback.prompt,
      title: fallback.title,
    });
  }
});

// 3. Expand Prompt Endpoint
app.post("/api/expand-prompt", async (req, res) => {
  try {
    const { existingPrompt } = req.body;
    const ai = getGeminiClient();

    const userPrompt = `Here is a concise drawing prompt: "${existingPrompt}".
Please EXPAND this concept into a richer, multi-layered visual scenario. Add details about atmospheric textures, environmental storytelling elements, secondary background details, and focal lighting highlights that an artist can explore in their artwork.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION,
        temperature: 0.85,
      },
    });

    const expandedText = cleanPromptText(response.text || "");

    res.json({
      prompt: expandedText,
    });
  } catch (error: any) {
    console.warn("Gemini API error (using fallback expansion):", error?.message || error);
    const fallback = FallbackDatabase.getExpand(req.body.existingPrompt || "A solitary figure in the fog");
    res.json({
      prompt: fallback.prompt,
    });
  }
});

// 4. Daily Featured Prompt Endpoint
app.get("/api/daily-prompt", async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    if (dailyPromptCache[todayStr]) {
      return res.json({ date: todayStr, ...dailyPromptCache[todayStr] });
    }

    const ai = getGeminiClient();
    const promptReq = `Generate today's featured daily drawing prompt for date ${todayStr}. Make it a captivating, universally inspiring scene suitable for all skill levels with beautiful lighting and memorable atmosphere.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptReq,
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION,
        temperature: 0.85,
      },
    });

    const dailyText = cleanPromptText(response.text || "");

    const titleResponse = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Given this daily drawing prompt: "${dailyText}", give it a short 2-4 word poetic title. Return ONLY the title.`,
    });

    const dailyTitle = cleanPromptText(titleResponse.text || "Daily Inspiration");

    dailyPromptCache[todayStr] = {
      prompt: dailyText,
      title: dailyTitle,
      category: "Daily Spotlight",
    };

    res.json({
      date: todayStr,
      ...dailyPromptCache[todayStr],
    });
  } catch (error: any) {
    console.warn("Gemini API error (using fallback daily prompt):", error?.message || error);
    const todayStr = new Date().toISOString().split("T")[0];
    const fallback = FallbackDatabase.getDailyPrompt(todayStr);
    dailyPromptCache[todayStr] = {
      prompt: fallback.prompt,
      title: fallback.title,
      category: "Daily Spotlight",
    };
    res.json({
      date: todayStr,
      ...dailyPromptCache[todayStr],
    });
  }
});

async function startServer() {
  // Ensure icon PNG files and manifest are generated on server start
  ensureIconsExist();

  const publicPath = path.join(process.cwd(), "public");

  // Explicit handlers for iOS Safari and Home Screen bookmarks
  app.get(["/apple-touch-icon.png", "/apple-touch-icon-precomposed.png", "/icon-192.png", "/icon-512.png", "/favicon.png"], (req, res) => {
    const filename = req.path.replace("/", "") || "apple-touch-icon.png";
    const filePath = path.join(publicPath, filename);
    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.sendFile(filePath);
    } else {
      res.status(404).end();
    }
  });

  app.get("/icon.svg", (req, res) => {
    const filePath = path.join(publicPath, "icon.svg");
    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.sendFile(filePath);
    } else {
      res.status(404).end();
    }
  });

  app.get("/manifest.json", (req, res) => {
    const filePath = path.join(publicPath, "manifest.json");
    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Type", "application/json");
      res.sendFile(filePath);
    } else {
      res.status(404).end();
    }
  });

  // Always serve public directory assets
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
