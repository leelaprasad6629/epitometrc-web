import { AIResponse, ProviderOptions } from "../types";
import { callProviderWithFallback } from "./fallbackManager";
import { getCachedAIResponse, setCachedAIResponse } from "./cacheManager";
import { sanitizePrompt } from "../utils";

export async function getAICompletion(
  rawPrompt: string,
  options?: ProviderOptions
): Promise<AIResponse> {
  const prompt = sanitizePrompt(rawPrompt);
  
  if (!prompt) {
    return { success: false, error: "Prompt cannot be empty." };
  }

  // Create unique cache key based on prompt and options
  const cacheKey = `${prompt}_${options?.temperature ?? 0.2}_${options?.responseFormat ?? "text"}`;
  
  const cachedResponse = getCachedAIResponse(cacheKey);
  if (cachedResponse) {
    console.log("Serving prompt from local cache.");
    return {
      success: true,
      text: cachedResponse,
      provider: "gemini", // Simulated fallback mapping info
    };
  }

  const response = await callProviderWithFallback(prompt, options);

  if (response.success && response.text) {
    setCachedAIResponse(cacheKey, response.text);
  }

  return response;
}
