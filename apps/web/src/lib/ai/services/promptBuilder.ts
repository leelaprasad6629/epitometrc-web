import { Message, PageContext } from "../types";
import { SYSTEM_PROMPT } from "../constants";
import { EPITOME_KNOWLEDGE_BASE } from "./knowledgeBase";
import { buildPageContextString } from "./contextBuilder";

export function buildChatPrompt(messages: Message[], context: PageContext): string {
  const contextStr = buildPageContextString(context);
  const conversationHistory = messages
    .map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
    .join("\n");

  return `
${SYSTEM_PROMPT}

${EPITOME_KNOWLEDGE_BASE}

${contextStr}

Conversation History:
${conversationHistory}

AI Assistant:
  `.trim();
}

export function buildBusinessConsultantPrompt(requirements: string): string {
  return `
${SYSTEM_PROMPT}

${EPITOME_KNOWLEDGE_BASE}

You are acting as an AI Business Consultant. Understand the client's business requirements, detect their industry sector, recommend Epitome's matching IT services, and suggest an implementation roadmap.

Client Requirements:
"${requirements}"

Respond strictly with a JSON object. Do not include markdown code block formatting in your actual generation (or wrap it in standard \`\`\`json blocks). The JSON structure must match this layout exactly:
{
  "industry": "Detected Industry Sector",
  "recommendedServices": ["Service A", "Service B"],
  "roadmap": [
    {"week": "Week 1-2", "title": "Phase 1 Title", "focus": "Details about phase 1"},
    {"week": "Week 3-4", "title": "Phase 2 Title", "focus": "Details about phase 2"}
  ],
  "explanation": "Detailed explanation of recommendations and suggestion for a live consultation call."
}
  `.trim();
}

export function buildTalentMatchPrompt(jobRequirements: string, candidates: any[]): string {
  return `
${SYSTEM_PROMPT}

${EPITOME_KNOWLEDGE_BASE}

Compare the target job requirements below with the list of candidates.

Job Requirements:
"${jobRequirements}"

Candidates List:
${JSON.stringify(candidates)}

Calculate matching scores, rank the candidates, list strengths, weaknesses, and a final recommendation.
Respond strictly in JSON format. The response must match this structure exactly:
{
  "candidates": [
    {
      "name": "Candidate Name",
      "score": 85,
      "rank": 1,
      "strengths": ["Skill A", "Experience B"],
      "weaknesses": ["Gap C"],
      "recommendation": "Final recommendation summary"
    }
  ]
}
  `.trim();
}

export function buildCandidateSummaryPrompt(candidateData: any): string {
  return `
${SYSTEM_PROMPT}

${EPITOME_KNOWLEDGE_BASE}

Analyze the candidate profile details below and generate a summary, key strengths, weaknesses, suitability evaluation, and target focus areas for their interview.

Candidate Data:
${JSON.stringify(candidateData)}

Respond strictly in JSON format. The response must match this structure exactly:
{
  "summary": "Professional fit summary",
  "strengths": ["Strength A", "Strength B"],
  "weaknesses": ["Gap C"],
  "suitability": "Final fit verdict",
  "interviewFocus": ["Topic D", "Question E"]
}
  `.trim();
}

export function buildResumeMatchPrompt(resumeText: string, jobTitle: string, jobDescription: string): string {
  return `
${SYSTEM_PROMPT}

${EPITOME_KNOWLEDGE_BASE}

Compare the candidate's resume text with the selected job details to perform an ATS-style keyword check and generate a match score, missing skills list, strengths, resume rewrite suggestions, and a learning roadmap.

Job Title: ${jobTitle}
Job Description:
"${jobDescription}"

Candidate Resume Text:
"${resumeText}"

Respond strictly in JSON format. The response must match this structure exactly:
{
  "matchPercentage": 75,
  "atsScore": 68,
  "missingSkills": ["TypeScript", "CI/CD"],
  "strengths": ["Strong Next.js background", "UI styling"],
  "suggestions": ["Add keywords for DevOps", "Highlight database optimizations"],
  "roadmap": ["Step 1: Complete Postgres Certification", "Step 2: Practice Docker integration"]
}
  `.trim();
}

export function buildCohortPlannerPrompt(objectives: string, departments: string, skills: string): string {
  return `
${SYSTEM_PROMPT}

${EPITOME_KNOWLEDGE_BASE}

Create a corporate cohort syllabus plan matching the department training needs, target skills, and learning objectives below.

Objectives: ${objectives}
Departments: ${departments}
Skills Required: ${skills}

Respond strictly in JSON format. The response must match this structure exactly:
{
  "groups": [
    {"name": "Engineering Team A", "members": ["Developer 1", "Developer 2"]}
  ],
  "roadmap": ["Week 1: Foundations", "Week 2: Advanced integrations"],
  "gapAnalysis": ["Lack of cloud experience", "Need basic API patterns"],
  "duration": "8 Weeks"
}
  `.trim();
}

export function buildInterviewQuestionsPrompt(courseTitle: string): string {
  return `
${SYSTEM_PROMPT}

${EPITOME_KNOWLEDGE_BASE}

Generate 5 high-impact technical interview questions and sample answers specifically based on the course: "${courseTitle}".

Respond strictly in JSON format. The response must match this structure exactly:
{
  "questions": [
    {
      "id": 1,
      "question": "What is ...?",
      "answer": "A detailed sample answer guide..."
    }
  ]
}
  `.trim();
}

export function buildResumeBuilderPrompt(jobRole: string, rawExperience: string): string {
  return `
${SYSTEM_PROMPT}

${EPITOME_KNOWLEDGE_BASE}

You are a professional resume writer. Rewrite the raw experience bullets into polished, professional, and high-impact descriptions suitable for the job role: "${jobRole}".

Raw Experience Notes:
"${rawExperience}"

Respond strictly in JSON format. The response must match this structure exactly:
{
  "polishedBio": "A refined professional summary paragraph...",
  "bullets": [
    "Polished experience accomplishment bullet point 1...",
    "Polished experience accomplishment bullet point 2..."
  ]
}
  `.trim();
}

export function buildEmailGeneratorPrompt(candidateName: string, targetJob: string, emailTone: string): string {
  return `
${SYSTEM_PROMPT}

${EPITOME_KNOWLEDGE_BASE}

Generate a professional candidate outreach email.
Candidate Name: ${candidateName}
Target Job: ${targetJob}
Email Tone/Type: ${emailTone} (e.g. "Invite for interview", "Offer pitch", "Follow-up")

Respond strictly in JSON format. The response must match this structure exactly:
{
  "subject": "Email Subject Line...",
  "body": "Dear ${candidateName},\n\n[Polished professional email body matching the requested tone...]\n\nBest regards,\nEpitome Recruitment Team"
}
  `.trim();
}

export function buildLeadQualifyPrompt(leadName: string, email: string, requirements: string): string {
  return `
${SYSTEM_PROMPT}

${EPITOME_KNOWLEDGE_BASE}

You are an AI Lead Qualification Assistant. Qualify this B2B consulting lead:
Lead Name: ${leadName}
Email: ${email}
Requirements: "${requirements}"

Calculate a qualification score from 1 to 100, identify key corporate pain points, and recommend matching Epitome service categories.

Respond strictly in JSON format. The response must match this structure exactly:
{
  "leadScore": 85,
  "painPoints": ["Legacy database locks", "Slow deployment speed"],
  "recommendedServices": ["IT Services & Development", "Corporate Consulting"],
  "verdict": "Hot Lead. High budget potential."
}
  `.trim();
}

export function buildMockInterviewPrompt(jobTitle: string, chatHistory: any[], studentAnswer: string): string {
  return `
${SYSTEM_PROMPT}

${EPITOME_KNOWLEDGE_BASE}

You are an AI Interview Simulator. Grade the student's answer and formulate the next question for a mock interview for the role: "${jobTitle}".

Chat History:
${JSON.stringify(chatHistory)}

Latest Student Answer:
"${studentAnswer}"

Respond strictly in JSON format. The response must match this structure exactly:
{
  "feedback": "Constructive feedback on student's response...",
  "score": 85, // Score for the student's answer (1-100)
  "nextQuestion": "The next interview question to ask the candidate..."
}
  `.trim();
}

export function buildCourseAssistantPrompt(courseTitle: string, studentQuestion: string): string {
  return `
${SYSTEM_PROMPT}

${EPITOME_KNOWLEDGE_BASE}

You are an AI Course Assistant tutor. Answer this student query regarding the course "${courseTitle}":
Student Question: "${studentQuestion}"

Provide a clean, tutorial-like markdown answer.

Respond strictly in JSON format. The response must match this structure exactly:
{
  "explanation": "Detailed tutorial explanation with code blocks if relevant...",
  "suggestedTopic": "Topic for further reading..."
}
  `.trim();
}
