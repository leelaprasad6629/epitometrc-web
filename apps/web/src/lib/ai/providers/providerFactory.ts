import { AIResponse, ProviderOptions } from "../types";
import { callGeminiProvider } from "./gemini";
import { callGroqProvider } from "./groq";

export async function callProvider(
  providerName: "gemini" | "groq",
  prompt: string,
  options?: ProviderOptions
): Promise<AIResponse> {
  if (providerName === "gemini") {
    return callGeminiProvider(prompt, options);
  } else {
    return callGroqProvider(prompt, options);
  }
}
