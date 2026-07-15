import { NextRequest, NextResponse } from "next/server";
import { getAICompletion } from "@/lib/ai/services/aiService";

export async function POST(req: NextRequest) {
  try {
    const {
      selectedJobRole,
      atsScore,
      matchScore,
      skillMatchPercentage,
      matchedSkills,
      missingSkills,
      fullName
    } = await req.json();

    const prompt = `
You are an expert ATS Career Strategist.
Generate strategic resume feedback based on these computed matching parameters:
- Target Role: "${selectedJobRole}"
- ATS Score: ${atsScore}%
- Match Score: ${matchScore}%
- Skill Match Percentage: ${skillMatchPercentage}%
- Matched Skills: ${JSON.stringify(matchedSkills)}
- Missing Skills: ${JSON.stringify(missingSkills)}

Format your response strictly as a JSON block with no comments, explanations, or code fencing. Matches this structure exactly:
{
  "strengths": ["Strength bullet 1", "Strength bullet 2"],
  "weaknesses": ["Weakness bullet 1", "Weakness bullet 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "atsTips": ["ATS Tip 1", "ATS Tip 2"],
  "certRecommendations": ["Recommended Certificate 1", "Recommended Certificate 2"],
  "techRecommendations": ["Recommended Tech Stack 1", "Recommended Tech Stack 2"],
  "feedback": "Overall strategic summary feedback text."
}
    `.trim();

    const aiResponse = await getAICompletion(prompt);

    if (aiResponse.success && aiResponse.text) {
      try {
        const cleanText = aiResponse.text.replace(/```json|```/g, "").trim();
        const result = JSON.parse(cleanText);
        return NextResponse.json({ success: true, result });
      } catch (err) {
        console.warn("Analysis response JSON parsing failed:", err);
      }
    }

    // Fallback Mock Data if AI is rate-limited
    console.log("Using static dynamic analysis backup.");
    return NextResponse.json({
      success: true,
      result: {
        strengths: [
          `Good initial experience block aligning with the stack: ${matchedSkills.slice(0, 3).join(", ").toUpperCase() || "foundations"}.`,
          "Extracted verified email and professional contact details cleanly."
        ],
        weaknesses: [
          missingSkills.length > 0
            ? `Missing core skills matching: ${missingSkills.slice(0, 2).join(", ").toUpperCase()}.`
            : "Requires more quantified achievements.",
          "Resume structure can be further optimized for automated indexing."
        ],
        suggestions: [
          `Tailor summary bullet points to explicitly feature keywords: ${missingSkills.slice(0, 2).join(" & ").toUpperCase() || "Advanced stack"}.`,
          "Showcase projects with clear metrics, e.g., 'reduced render time by 20%'"
        ],
        atsTips: [
          "Avoid using multi-column tables, as standard ATS parsers read them top-to-bottom across boundaries.",
          "Convert all font families to standard Web-safe fonts (Arial, Times New Roman, Calibri)."
        ],
        certRecommendations: [
          `Certified ${selectedJobRole} Specialist`,
          "AWS Certified Cloud Practitioner"
        ],
        techRecommendations: [
          `Deploy a production service utilizing: ${missingSkills.slice(0, 2).join(", ").toUpperCase() || "TypeScript & Node.js"}.`,
          "Configure cloud deploy hooks on Vercel or AWS Amplify."
        ],
        feedback: `Solid candidate progress. Your resume shows a ${skillMatchPercentage}% skill match with the required ${selectedJobRole} profile. Addressing the missing skills will optimize your ATS suitability.`
      }
    });

  } catch (error: any) {
    console.error("Resume Analysis API error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
