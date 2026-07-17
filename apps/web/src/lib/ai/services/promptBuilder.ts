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

export function buildParsePersonalPrompt(personalText: string, bioText: string): string {
  return `
Act as an ATS resume parser. Extract full name, professional headline, location (city, state/country), and summary biography from this text.
Do not guess or hallucinate. Return strictly JSON:
{
  "fullName": "Extracted name or empty",
  "headline": "Title or empty",
  "location": "City, Country or empty",
  "bio": "Summary bio or empty"
}
Text:
${personalText}
${bioText}
  `.trim();
}

export function buildParseEducationPrompt(educationText: string, certText: string): string {
  return `
Act as an ATS resume parser. Extract education and certifications records from this text.
Return strictly JSON:
{
  "education": [
    { 
      "degree": "e.g. B.Sc.", 
      "branch": "e.g. Computer Science", 
      "institution": "University Name", 
      "university": "Affiliated University Name", 
      "startYear": "Year", 
      "endYear": "Year", 
      "cgpa": "e.g. 3.8/4.0",
      "relevantCoursework": "Course titles list"
    }
  ],
  "certifications": [
    { "certificationName": "Name", "organization": "Issuer Name", "date": "Date/Year", "credentialId": "ID or empty" }
  ]
}
Text:
${educationText}
${certText}
  `.trim();
}

export function buildParseExperiencePrompt(
  experienceText: string,
  projectsText: string,
  internshipsText: string,
  achievementsText: string
): string {
  return `
Act as an ATS resume parser. Extract experiences, projects, internships, achievements, extra activities, and soft skills lists.
Return strictly JSON:
{
  "experience": [
    { 
      "companyName": "Company", 
      "role": "Role", 
      "employmentType": "Full-time/Part-time/Apprentice", 
      "startDate": "Date", 
      "endDate": "Date", 
      "duration": "Duration", 
      "responsibilities": "Bullet points summary text",
      "technologiesUsed": ["React", "CSS"],
      "achievements": ["Delivered features on-time", "Improved rendering speed by 20%"]
    }
  ],
  "projects": [
    { 
      "projectTitle": "Title", 
      "description": "Details", 
      "technologiesUsed": ["React", "TypeScript"], 
      "githubLink": "URL", 
      "liveUrl": "URL", 
      "duration": "Duration",
      "teamSize": "e.g. 3 Members",
      "contributions": "Designed database architecture",
      "outcomes": "Deployed live to production"
    }
  ],
  "internships": [
    { 
      "company": "Company", 
      "role": "Role", 
      "duration": "Duration", 
      "description": "Responsibilities text",
      "technologies": ["Node.js", "Express"]
    }
  ],
  "achievements": [
    { "title": "Achievement title", "description": "Description detail" }
  ],
  "publications": [
    { "title": "Paper Title", "publisher": "ACM/IEEE", "date": "Date/Year", "url": "URL" }
  ],
  "workshops": [
    { "name": "Workshop Title", "organizer": "Organizer Name", "date": "Date/Year" }
  ],
  "hackathons": [
    { "name": "Hackathon Name", "role": "e.g. Lead Developer", "date": "Date/Year", "prize": "e.g. 1st Place" }
  ],
  "leadershipRoles": [
    { "role": "Role Name", "organization": "Club Name", "duration": "Duration" }
  ],
  "volunteerExperience": [
    { "role": "Volunteer Title", "organization": "Nonprofit Name", "description": "Helper responsibilities" }
  ],
  "languagesKnown": ["English", "Spanish"],
  "professionalInterests": ["Web Development", "AI Agents"],
  "softSkills": ["Leadership", "Communication"]
}
Text:
${experienceText}
${projectsText}
${internshipsText}
${achievementsText}
  `.trim();
}

export function buildParseCareerDomainPrompt(fullText: string): string {
  return `
Act as an ATS recruiting assistant. Generate a semantic candidate profile summary sentence, target domain, experience level classification, and recommended career roles / technologies.
Domains: Frontend Development, Backend, AI/ML, Full Stack, Cybersecurity, Data Science, Cloud.
Experience Levels: Fresher, Junior, Mid-Level, Senior.
Return strictly JSON:
{
  "candidateProfile": "Semantic candidate summary sentence",
  "careerDomain": "Selected Domain",
  "experienceLevel": "Fresher/Junior/Mid-Level/Senior",
  "suggestedRoles": ["Frontend Developer", "UI Designer"],
  "suggestedTech": ["Docker", "Kubernetes"]
}
Text:
${fullText}
  `.trim();
}

export function buildUnifiedParsePrompt(fullText: string): string {
  return `
Act as an expert ATS resume parser. Analyze the resume text below and extract every professional detail into a structured JSON response.

High-Fidelity Extraction Guidelines:
1. Extract ALL information present in the resume text. Do not truncate, summarize, or ignore any sections.
2. Link Resolution:
   - If a profile/social link is represented only as a username or handle (e.g. "GitHub: LalithaSreya" or "LinkedIn: MudigondaLalithaSreya" or "LeetCode: lalithasreya"), intelligently construct the complete profile URL (e.g. "https://github.com/LalithaSreya", "https://www.linkedin.com/in/MudigondaLalithaSreya", "https://leetcode.com/lalithasreya").
   - Populate "linkedin", "github", "portfolioWebsite", "personalWebsite", "leetcode", "hackerrank", "codechef", "codeforces", "kaggle", "medium", "stackoverflow", "behance", "dribbble" if present.
3. Positions of Responsibility / Leadership:
   - Map headers like "Positions of Responsibility", "Campus Engagement & Leadership", "Leadership", "Extra-Curricular Roles" to the "leadershipRoles" array.
   - Map roles where the candidate organized events, led clubs, coordinated placements, or acted as secretary.
4. Experience & Internships:
   - Extract all entries from "Experience", "Work History", "Internships", "Virtual Internships", "Social Internships" sections.
   - Map virtual/social internships to the "internships" or "experience" array.
   - For "experience", populate "companyName", "role", "employmentType" (Apprentice/Internship/Full-time), "duration" (e.g., "Jan 2023 - Present"), "responsibilities", "technologiesUsed", and "achievements".
5. Projects:
   - Extract all projects. Populate "projectTitle", "description", "technologiesUsed", "githubLink", "liveUrl", "duration", "teamSize", "contributions", and "outcomes".
6. Certifications & Achievements:
   - Extract all listed credentials into "certifications".
   - Extract awards, ranks, or accomplishments into "achievements".
7. Education:
   - Extract all educational records (including University B.Tech, Junior College, Higher Secondary, and Class X High School).
   - Populate "degree", "branch", "institution", "university", "startYear", "endYear", "cgpa", and "relevantCoursework".

Strict JSON format requirements:
- Do not include markdown code block formatting (or wrap it in standard \`\`\`json blocks).
- Output must match this JSON schema exactly:
{
  "fullName": "Full Name",
  "headline": "Headline (e.g. Frontend Developer)",
  "email": "Email Address",
  "phone": "Phone Number",
  "location": "City, Country",
  "bio": "Summary biography",
  "linkedin": "LinkedIn profile URL",
  "github": "GitHub profile URL",
  "portfolioWebsite": "Portfolio website URL",
  "personalWebsite": "Personal website URL",
  "leetcode": "LeetCode profile URL",
  "hackerrank": "HackerRank profile URL",
  "codechef": "CodeChef profile URL",
  "codeforces": "Codeforces profile URL",
  "kaggle": "Kaggle profile URL",
  "medium": "Medium blog URL",
  "stackoverflow": "Stack Overflow profile URL",
  "behance": "Behance profile URL",
  "dribbble": "Dribbble profile URL",
  
  "education": [
    {
      "degree": "Degree (e.g. Bachelor of Technology)",
      "branch": "Branch/Specialization (e.g. Computer Science)",
      "institution": "Institution Name",
      "university": "Affiliated University Name",
      "startYear": "Start Year",
      "endYear": "End Year/Expected",
      "cgpa": "CGPA / Percentage",
      "relevantCoursework": "Coursework or empty"
    }
  ],
  "experience": [
    {
      "companyName": "Company Name",
      "role": "Role Title",
      "employmentType": "Full-time / Part-time / Internship / Apprentice",
      "startDate": "Start Date",
      "endDate": "End Date",
      "duration": "Duration (e.g. Jan 2023 - Present)",
      "responsibilities": "Description of responsibilities",
      "technologiesUsed": ["React", "Node.js"],
      "achievements": ["Key accomplishment A", "Key accomplishment B"]
    }
  ],
  "projects": [
    {
      "projectTitle": "Project Title",
      "description": "Project details description",
      "technologiesUsed": ["Next.js", "PostgreSQL"],
      "githubLink": "GitHub code link",
      "liveUrl": "Live demo website link",
      "duration": "Project duration",
      "teamSize": "Team size (e.g. 4 Members)",
      "contributions": "Specific developer contributions",
      "outcomes": "Project outcomes or empty"
    }
  ],
  "internships": [
    {
      "company": "Company Name",
      "role": "Role Title",
      "duration": "Duration",
      "description": "Responsibilities description",
      "technologies": ["React Native"]
    }
  ],
  "certifications": [
    {
      "certificationName": "Certification Name",
      "organization": "Issuing Organization",
      "date": "Issue Date",
      "credentialId": "Credential ID if present"
    }
  ],
  "achievements": [
    {
      "title": "Achievement Title",
      "description": "Description of achievement"
    }
  ],
  "publications": [
    {
      "title": "Paper/Article Title",
      "publisher": "Publisher Name",
      "date": "Date",
      "url": "URL if present"
    }
  ],
  "workshops": [
    {
      "name": "Workshop/Training Name",
      "organizer": "Organizing Entity",
      "date": "Date"
    }
  ],
  "hackathons": [
    {
      "name": "Hackathon Name",
      "role": "Developer/Lead/Participant",
      "date": "Date",
      "prize": "Prize won or empty"
    }
  ],
  "leadershipRoles": [
    {
      "role": "Role Name (e.g. President)",
      "organization": "Club/Organization",
      "duration": "Duration"
    }
  ],
  "volunteerExperience": [
    {
      "role": "Volunteer Role",
      "organization": "Organization Name",
      "description": "Work description"
    }
  ],
  "languagesKnown": ["English", "Hindi"],
  "professionalInterests": ["Artificial Intelligence", "Web Development"],
  "softSkills": ["Leadership", "Teamwork"],
  "technicalSkills": ["React", "Python", "Docker"],
  
  "candidateProfile": "Semantic candidate summary sentence",
  "careerDomain": "Frontend Development / Backend / AI/ML / Full Stack / Cybersecurity / Data Science / Cloud",
  "experienceLevel": "Fresher / Junior / Mid-Level / Senior",
  "suggestedRoles": ["Suggested Role 1", "Suggested Role 2"],
  "suggestedTech": ["Suggested Tech 1", "Suggested Tech 2"]
}

Resume Text:
${fullText}
  `.trim();
}

