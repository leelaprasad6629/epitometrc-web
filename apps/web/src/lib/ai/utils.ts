export function sanitizePrompt(prompt: string): string {
  // Prevent basic injection patterns and strip harmful characters
  return prompt
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .trim();
}

export function parseMarkdownJson<T>(rawText: string): T {
  try {
    // If it's a code block, strip markdown wrapping
    let cleanText = rawText.trim();
    if (cleanText.includes("```")) {
      const match = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        cleanText = match[1];
      }
    }
    return JSON.parse(cleanText) as T;
  } catch (error: any) {
    console.error("Failed to parse JSON response from LLM:", error, rawText);
    throw new Error("Invalid structured JSON returned from AI provider.");
  }
}
