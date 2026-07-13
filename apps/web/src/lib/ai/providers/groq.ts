import { AIResponse, ProviderOptions } from "../types";
import { DEFAULT_GROQ_MODEL } from "../constants";

// ===== PASTE YOUR GROQ API KEY HERE =====
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

export async function callGroqProvider(
  prompt: string,
  options?: ProviderOptions
): Promise<AIResponse> {
  const apiKey = GROQ_API_KEY;
  if (!apiKey) {
    return { success: false, error: "Groq API key is not configured in environment." };
  }

  try {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEFAULT_GROQ_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: options?.temperature ?? 0.2,
        max_tokens: options?.maxTokens ?? 1500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        error: `Groq API returned status ${response.status}: ${errText}`,
      };
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content;

    if (!generatedText) {
      return { success: false, error: "Empty completion returned from Groq API." };
    }

    return {
      success: true,
      text: generatedText,
      provider: "groq",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to connect to Groq API endpoint.",
    };
  }
}
