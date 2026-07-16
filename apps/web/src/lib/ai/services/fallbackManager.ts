import { AIResponse, ProviderOptions } from "../types";
import { callProvider } from "../providers/providerFactory";

export async function callProviderWithFallback(
  prompt: string,
  options?: ProviderOptions
): Promise<AIResponse> {
  console.log("Attempting call with Primary provider: Gemini");
  const primaryResponse = await callProvider("gemini", prompt, options);

  if (primaryResponse.success) {
    return primaryResponse;
  }

  console.warn("Primary provider (Gemini) failed. Error details:", primaryResponse.error);
  console.log("Initiating automatic fallback retry with Secondary provider: Groq");
  
  const secondaryResponse = await callProvider("groq", prompt, options);
  
  if (secondaryResponse.success) {
    console.log("Fallback retry succeeded using Groq.");
    return secondaryResponse;
  }

  console.error("Secondary provider (Groq) also failed. Error details:", secondaryResponse.error);
  return {
    success: false,
    error: "Both AI service providers failed to complete the request. Please try again later.",
  };
}
