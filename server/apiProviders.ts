import { GoogleGenAI } from "@google/genai";

export interface AIProviderResponse {
  prompt: string;
  title?: string;
  provider: string;
}

// 1. Gemini API Provider (Multi-model fallback)
export async function generateWithGemini(
  userPrompt: string,
  systemInstruction: string,
  apiKey?: string
): Promise<AIProviderResponse> {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("Gemini API Key is not set.");
  }

  const ai = new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  const modelsToTry = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.9,
        },
      });

      if (response.text && response.text.trim()) {
        const text = response.text.trim();
        
        // Try generating a poetic title with Gemini
        let title = "Artistic Inspiration";
        try {
          const titleResponse = await ai.models.generateContent({
            model,
            contents: `Given this drawing prompt: "${text}", give it a short 2-5 word poetic title. Return ONLY the title, no quotes or markdown.`,
            config: { temperature: 0.7 },
          });
          if (titleResponse.text) {
            title = titleResponse.text.trim().replace(/^["'`]|["'`]$/g, "");
          }
        } catch {
          // Ignore title error, use fallback title
        }

        return {
          prompt: text,
          title,
          provider: `Gemini (${model})`,
        };
      }
    } catch (err: any) {
      lastError = err;
      console.info(`Gemini model ${model} failed, trying next fallback...`);
    }
  }

  throw lastError || new Error("All Gemini models failed.");
}

// 2. Pollinations AI Free Text Generation API (100% free, no API key required)
export async function generateWithPollinations(
  userPrompt: string,
  systemInstruction: string
): Promise<AIProviderResponse> {
  const models = ["mistral", "openai", "qwen", "llama"];

  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userPrompt },
          ],
          model,
          seed: Math.floor(Math.random() * 1000000),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        let text = await response.text();
        text = text.trim();
        if (text && text.length > 20) {
          // Clean up formatting
          text = text.replace(/^(Prompt|Drawing Prompt|Result):\s*/i, "");
          text = text.replace(/^["'`]|["'`]$/g, "").trim();

          return {
            prompt: text,
            title: "Creative Inspiration",
            provider: `Pollinations Free AI (${model.toUpperCase()})`,
          };
        }
      }
    } catch (err) {
      console.info(`Pollinations AI model ${model} unavailable, trying next provider...`);
    }
  }

  throw new Error("Pollinations Free AI API is currently unavailable.");
}

// 3. Hugging Face Free Serverless Inference API
export async function generateWithHuggingFace(
  userPrompt: string,
  systemInstruction: string
): Promise<AIProviderResponse> {
  const hfModels = [
    "Qwen/Qwen2.5-Coder-32B-Instruct",
    "mistralai/Mistral-7B-Instruct-v0.2",
    "HuggingFaceTB/SmolLM2-1.7B-Instruct",
  ];

  for (const modelPath of hfModels) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const url = `https://api-inference.huggingface.co/models/${modelPath}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `<|im_start|>system\n${systemInstruction}<|im_end|>\n<|im_start|>user\n${userPrompt}<|im_end|>\n<|im_start|>assistant\n`,
          parameters: {
            max_new_tokens: 180,
            temperature: 0.85,
            return_full_text: false,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        let text = "";
        if (Array.isArray(data) && data[0]?.generated_text) {
          text = data[0].generated_text;
        } else if (typeof data === "object" && data?.generated_text) {
          text = data.generated_text;
        }

        if (text) {
          text = text.replace(/<\|im_end\|>/g, "").trim();
          text = text.replace(/^(Prompt|Drawing Prompt|Result):\s*/i, "");
          text = text.replace(/^["'`]|["'`]$/g, "").trim();

          if (text.length > 20) {
            const shortName = modelPath.split("/")[1] || "HF Model";
            return {
              prompt: text,
              title: "Free AI Concept",
              provider: `Hugging Face (${shortName})`,
            };
          }
        }
      }
    } catch (err) {
      console.info(`HuggingFace model ${modelPath} request skipped.`);
    }
  }

  throw new Error("Hugging Face Free Inference API unavailable.");
}

// Master Provider Orchestrator
export async function generatePromptWithMultiProvider(
  userPrompt: string,
  systemInstruction: string
): Promise<AIProviderResponse> {
  // Tier 1: Gemini API (if key present and operational)
  if (process.env.GEMINI_API_KEY) {
    try {
      return await generateWithGemini(userPrompt, systemInstruction);
    } catch (err: any) {
      console.info("Notice: Gemini API offline or rate-limited. Falling back to free public AI APIs...");
    }
  }

  // Tier 2: Pollinations AI Free Text Endpoint (No key required)
  try {
    return await generateWithPollinations(userPrompt, systemInstruction);
  } catch (err: any) {
    console.info("Notice: Pollinations Free AI API offline. Falling back to HuggingFace Free Inference...");
  }

  // Tier 3: HuggingFace Free Serverless Endpoint (No key required)
  try {
    return await generateWithHuggingFace(userPrompt, systemInstruction);
  } catch (err: any) {
    console.info("Notice: External Free APIs un-reachable. Using DrawMuse Smart Offline Prompt Engine.");
  }

  throw new Error("All online providers exhausted; fallback to offline engine.");
}
