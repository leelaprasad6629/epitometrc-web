import { NextRequest, NextResponse } from "next/server";
import { getAICompletion } from "@/lib/ai/services/aiService";

export async function POST(req: NextRequest) {
  try {
    const { 
      jobTitle, 
      companyName, 
      jobDescription, 
      bio, 
      experience, 
      projects, 
      skills, 
      certifications, 
      education 
    } = await req.json();

    const prompt = `
Act as an expert ATS Resume Optimizer & Professional Career Coach. Your goal is to analyze the candidate's current resume sections and provide section-by-section optimizations tailored specifically to the target Job Title, Company, and Job Description.

Target Job Title: "${jobTitle || "Software Engineer"}"
Target Company: "${companyName || "Target Company"}"
Target Job Description:
"${jobDescription || "Not provided"}"

Current Candidate Details:
- Professional Summary / Bio: "${bio || ""}"
- Work Experience: ${JSON.stringify(experience || [])}
- Technical Projects: ${JSON.stringify(projects || [])}
- Current Skills: ${JSON.stringify(skills || [])}
- Certifications: ${JSON.stringify(certifications || [])}
- Education: ${JSON.stringify(education || [])}

Instructions:
1. Generate specific, context-aware optimizations. 
2. Improve wording, grammar, action-verb usage, and keyword alignment based on the target Job Description.
3. NEVER invent fake credentials, qualifications, degrees, skills, or employment history. Keep optimizations factually grounded.
4. For Summary, rewrite a compelling, tailored 3-4 sentence professional summary.
5. For Work Experience and Projects, optimize the descriptions/responsibilities using the STAR format (Situation, Task, Action, Result) with metrics where possible, making them highly relevant to the target role.
6. Provide a clear, educational explanation for each recommendation detailing why it is optimized (e.g., "Incorporated key target skill 'Next.js' and action verb 'designed' to match the JD requirements").
7. Suggest relevant missing skills that the candidate likely possesses or should highlight based on their existing profile, explaining why.
8. If a section has no entries, skip it or return empty suggestion.

You must respond STRICTLY with a valid JSON object matching the following TypeScript schema:
{
  "summary": {
    "originalText": "current summary",
    "suggestedText": "suggested tailored summary",
    "explanation": "explanation of why it is optimized"
  },
  "experience": [
    {
      "index": number,
      "companyName": "company name",
      "originalRole": "original role",
      "originalText": "original responsibilities/text",
      "suggestedText": "suggested optimized responsibilities/text",
      "explanation": "explanation of rewrite"
    }
  ],
  "projects": [
    {
      "index": number,
      "projectTitle": "project title",
      "originalText": "original description/text",
      "suggestedText": "suggested optimized description/text",
      "explanation": "explanation of rewrite"
    }
  ],
  "skills": [
    {
      "skillName": "skill name",
      "explanation": "explanation of why this skill should be highlighted"
    }
  ],
  "certifications": [
    {
      "index": number,
      "certificationName": "certification name",
      "originalText": "original text",
      "suggestedText": "suggested optimized text",
      "explanation": "explanation of update"
    }
  ]
}

Ensure your response is valid JSON. Do not include markdown code block syntax (like \`\`\`json) inside the JSON string itself.
`.trim();

    const aiResponse = await getAICompletion(prompt);

    if (!aiResponse.success || !aiResponse.text) {
      return NextResponse.json(aiResponse);
    }

    const cleanJson = aiResponse.text.replace(/```json|```/g, "").trim();
    const parsedResult = JSON.parse(cleanJson);
    
    return NextResponse.json({
      success: true,
      result: parsedResult
    });
  } catch (error: any) {
    console.error("AI Resume Assistant API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate tailored resume suggestions." },
      { status: 500 }
    );
  }
}
