export function sanitizePrompt(prompt: string): string {
  // Prevent basic injection patterns and strip harmful characters
  return prompt
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .trim();
}

export function parseMarkdownJson<T>(rawText: string): T {
  try {
    let cleanText = rawText.trim();
    
    // Extract JSON block starting from first '{' to last '}'
    const startCurly = cleanText.indexOf('{');
    const endCurly = cleanText.lastIndexOf('}');
    if (startCurly !== -1 && endCurly !== -1 && endCurly > startCurly) {
      cleanText = cleanText.substring(startCurly, endCurly + 1);
    } else {
      // Try array brackets if curly braces are absent
      const startBracket = cleanText.indexOf('[');
      const endBracket = cleanText.lastIndexOf(']');
      if (startBracket !== -1 && endBracket !== -1 && endBracket > startBracket) {
        cleanText = cleanText.substring(startBracket, endBracket + 1);
      }
    }
    
    // Strip markdown formatting if any remains
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
