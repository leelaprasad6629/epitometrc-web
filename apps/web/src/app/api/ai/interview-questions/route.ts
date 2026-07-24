import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // 60s Vercel serverless function timeout

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, company, jobDescription, skills, experience, courseTitle } = body;

    let prompt = "";

    if (courseTitle) {
      prompt = `You are an expert technical instructor. Generate 4 high-quality, targeted interview questions with answers for a candidate who has completed the course: "${courseTitle}".
Format the response strictly as a JSON block with no markdown wrappers or comments. Match this structure exactly:
{
  "questions": [
    {
      "question": "The technical interview question text",
      "category": "Course Specific",
      "difficulty": "Medium",
      "explanation": "Focuses on core concepts covered in the course."
    }
  ]
}`;
    } else {
      prompt = `Act as an expert Technical Recruiter and Career Coach. Generate a list of 5 targeted interview questions tailored strictly to:
- Target Job Role: ${role || "Software Developer"}
- Target Company: ${company || "Target Company"}
- Job Description: ${jobDescription || "Not provided"}
- Candidate's Skills: ${JSON.stringify(skills || [])}
- Experience Level: ${JSON.stringify(experience || [])}

Ensure the questions are highly relevant. For each question, explain "why this question" is selected based on either the company's well-known interview patterns (e.g. Amazon's leadership principles, Google's algorithmic bar) or the candidate's resume details.

Format the response strictly as a JSON block matching this structure:
{
  "questions": [
    {
      "question": "Why did you choose PostgreSQL over MySQL for the database layer in your e-commerce project?",
      "category": "Project", // "Technical", "Behavioral", "Coding", "Project"
      "difficulty": "Medium", // "Easy", "Medium", "Hard"
      "explanation": "Microsoft tests database system design decisions to gauge candidate architecture knowledge."
    }
  ]
}`;
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json({ success: false, error: "Groq API Key is not configured." }, { status: 500 });
    }

    const url = "https://api.groq.com/openai/v1/chat/completions";
    const groqResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        response_format: { type: "json_object" }, // JSON Mode
        messages: [
          { role: "system", content: "You are a professional hiring manager and interview evaluator." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
      })
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      return NextResponse.json({ success: false, error: `Groq error: ${errText}` }, { status: 500 });
    }

    const groqData = await groqResponse.json();
    const generatedText = groqData.choices?.[0]?.message?.content;

    if (!generatedText) {
      return NextResponse.json({ success: false, error: "Empty response from Groq." }, { status: 500 });
    }

    const parsedResult = JSON.parse(generatedText);
    
    return NextResponse.json({
      success: true,
      questions: parsedResult.questions || []
    });
  } catch (error: any) {
    console.error("AI Interview Questions API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate structured interview questions: " + error.message },
      { status: 500 }
    );
  }
}
