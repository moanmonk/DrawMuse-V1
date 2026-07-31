import { SmartPromptEngine, SmartPromptOptions } from "../src/utils/smartPromptEngine";

export interface FallbackPromptItem {
  title: string;
  prompt: string;
  category: string;
  mood?: string;
  lighting?: string;
}

export class FallbackDatabase {
  public static getRandomPrompt(category?: string, filters?: any, lengthPreference?: string, wheelState?: any): FallbackPromptItem {
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

  public static getDailyPrompt(dateStr: string): FallbackPromptItem {
    const result = SmartPromptEngine.getDaily(dateStr);
    return {
      title: result.title,
      prompt: result.prompt,
      category: result.category,
    };
  }

  public static getRemix(existingPrompt: string, category?: string): { title: string; prompt: string } {
    const result = SmartPromptEngine.remix(existingPrompt, category);
    return {
      title: result.title,
      prompt: result.prompt,
    };
  }

  public static getExpand(existingPrompt: string): { prompt: string } {
    return SmartPromptEngine.expand(existingPrompt);
  }
}
