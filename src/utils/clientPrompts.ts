import { SmartPromptEngine, SmartPromptOptions } from "./smartPromptEngine";

export interface ClientPromptItem {
  title: string;
  prompt: string;
  category: string;
}

export function generateClientPrompt(
  category?: string,
  filters?: any,
  lengthPreference?: string,
  wheelState?: any
): { title: string; prompt: string; category: string } {
  const options: SmartPromptOptions = {
    category,
    filters,
    lengthPreference,
    wheelState,
  };
  const result = SmartPromptEngine.generate(options);
  return {
    title: result.title,
    prompt: result.prompt,
    category: result.category,
  };
}

export function getClientDailyPrompt(): { title: string; prompt: string; category: string; date: string } {
  const dateStr = new Date().toISOString().split("T")[0];
  const result = SmartPromptEngine.getDaily(dateStr);
  return {
    title: result.title,
    prompt: result.prompt,
    category: result.category,
    date: dateStr,
  };
}
