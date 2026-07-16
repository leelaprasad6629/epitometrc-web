import { AIResponse, ProviderOptions } from "../types";
import { DEFAULT_GEMINI_MODEL } from "../constants";

// ===== PASTE YOUR GEMINI API KEY HERE =====
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export async function callGeminiProvider(
  prompt: string,
  options?: ProviderOptions
): Promise<AIResponse> {
  const apiKey = GEMINI_API_KEY;
  if (!apiKey) {
    return { success: false, error: "Gemini API key is not configured in environment." };
  }

  try {
    const parts: any[] = [
      { text: prompt }
    ];

    if (options?.fileBase64 && options?.fileMimeType) {
      parts.push({
        inlineData: {
          mimeType: options.fileMimeType,
          data: options.fileBase64
        }
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts,
          },
        ],
        generationConfig: {
          temperature: options?.temperature ?? 0.2,
          maxOutputTokens: options?.maxTokens ?? 1500,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        error: `Gemini API returned status ${response.status}: ${errText}`,
      };
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return { success: false, error: "Empty completion returned from Gemini API." };
    }

    return {
      success: true,
      text: generatedText,
      provider: "gemini",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to connect to Gemini API endpoint.",
    };
  }
}
