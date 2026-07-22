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

export function buildEmailGeneratorPrompt(
  recipientName: string,
  targetRoleOrJob: string,
  emailTone: string,
  templateType: string,
  additionalContext: string
): string {
  return `
${SYSTEM_PROMPT}

${EPITOME_KNOWLEDGE_BASE}

You are an elite Business Email Copywriter. Write a highly polished, professional, and contextually rich email.
Recipient: ${recipientName}
Target Role/Job/Topic: ${targetRoleOrJob}
Email Tone: ${emailTone} (Formal, Professional, Friendly)
Template Type: ${templateType} (Recruitment, Client Communication, Sales, Follow-up, Interview Invitation, Training Invitation, Proposal Sharing, General)
Additional Context/Details to include: "${additionalContext}"

Guidelines:
- Incorporate the recipient's name, target job or topic, and any additional context naturally.
- Adopt the requested tone perfectly.
- Ensure the email has clear calls to action, an engaging subject line, and standard business formatting.

Respond strictly in JSON format. The response must match this structure exactly:
{
  "subject": "Email Subject Line...",
  "body": "Dear ${recipientName},\n\n[Polished body text matching the template and tone...]\n\nBest regards,\nEpitome Team"
}
  `.trim();
}

export function buildLeadQualifyPrompt(leadName: string, email: string, requirements: string): string {
  return `
${SYSTEM_PROMPT}

${EPITOME_KNOWLEDGE_BASE}

You are an elite B2B Sales & Lead Qualification Engine. Qualify the following business lead:
Lead Entity Name: ${leadName}
Email: ${email}
Project Requirements: "${requirements}"

Analyze the lead and extract:
- leadScore: 0 to 100 based on budget strength, urgency, and alignment with EpitomeTRC services.
- priority: "Hot" (urgent + high budget), "Warm" (moderate budget or timeline), or "Cold" (unclear requirements/low interest).
- industry: The detected vertical (e.g. Healthcare, Fintech, Logistics, Retail, E-Commerce, etc.).
- companySize: Estimated company size based on project scale ("Startup", "Mid-Market", "Enterprise").
- businessNeed: Concise description of their primary business pain point or technological need.
- conversionProbability: Estimated probability of successful conversion (percentage as number, e.g. 75).
- explanation: A concise summary explaining the lead assessment criteria.
- opportunities: Top 2 opportunities or upsell tracks for this client.
- risks: Top 2 potential risks or blockers in closing this deal.
- recommendedNextAction: The next best action ("Schedule Discovery Call", "Send Proposal", "Follow-up", "Assign Representative", "Send Invoice").

Respond strictly in JSON format. The response must match this structure exactly:
{
  "leadScore": 85,
  "priority": "Hot",
  "industry": "Fintech",
  "companySize": "Mid-Market",
  "businessNeed": "Cloud migration and secure API gateway scaling",
  "conversionProbability": 75,
  "explanation": "Brief explanation summarizing why this lead is Hot/Warm/Cold...",
  "painPoints": ["Legacy database locks", "Slow deployment speed"],
  "opportunities": ["Cross-sell React/TypeScript staff training program", "Introduce corporate infrastructure audit package"],
  "risks": ["Tight execution timeline", "Multi-cloud authentication compliance rules"],
  "recommendedServices": ["IT Services & Development", "Corporate Consulting"],
  "recommendedNextAction": "Send Proposal"
}
  `.trim();
}

export function buildCRMAssistantPrompt(clientName: string, interactionHistory: string): string {
  return `
${SYSTEM_PROMPT}

${EPITOME_KNOWLEDGE_BASE}

You are an expert CRM Intelligence Assistant. Process the client interaction history below to extract key relationship metrics and generate a structured executive dashboard summary.
Client Entity Name: ${clientName}
Interaction Log:
\"\"\"
${interactionHistory}
\"\"\"

Generate a JSON object containing:
- timelineSummary: A timeline array of the last 3-4 interactions, each with date, type ("Email", "Meeting", "Call", "Support Ticket"), description, and participant.
- clientHealth: "Active" (recent contact, positive updates) or "Inactive" (no contact > 30 days, unresolved complaints).
- relationshipSummary: A 2-sentence executive brief of the account status.
- pendingActions: A list of immediate actions that need resolution, including priority ("High", "Medium", "Low") and description.
- reminders: Suggested reminders for follow-ups (dates or intervals).
- upsellingOpportunities: Specific cross-selling or upselling suggestions aligned with their history (e.g. proposing staff training or system security audits).

Respond strictly in JSON format matching this structure:
{
  "timelineSummary": [
    { "date": "2026-07-15", "type": "Meeting", "description": "Discussed dashboard scale limits and AWS architecture.", "participant": "Sales Lead" }
  ],
  "clientHealth": "Active",
  "relationshipSummary": "Summary of current relationship status...",
  "pendingActions": [
    { "description": "Send technical blueprint draft.", "priority": "High" }
  ],
  "reminders": [
    "Schedule 2-week check-in meeting regarding AWS migration budget."
  ],
  "upsellingOpportunities": [
    "Introduce React/Next.js corporate training cohort for their frontend team."
  ]
}
  `.trim();
}

export function buildProposalPrompt(clientName: string, requirements: string): string {
  return `
${SYSTEM_PROMPT}

${EPITOME_KNOWLEDGE_BASE}

You are a senior Business Architect and Consultant. Generate a structured B2B business proposal for a prospective client.
Client Entity Name: ${clientName}
Client Requirements: "${requirements}"

Generate a comprehensive proposal with the following sections:
- companyOverview: EpitomeTRC's profile as an industry-leading placement and IT consultancy.
- projectScope: Summary of the client's problem statement and our proposed technical solution.
- services: A list of 2-3 specific services (e.g. Cloud Migrations, Next.js Development, Training Cohorts) with descriptions.
- timeline: Timeline roadmap detailing milestones (e.g., Week 1-2 Discovery, Week 3-4 Setup, etc.).
- deliverables: A list of 4 concrete deliverables we will hand over.
- estimatedPricing: A professional pricing breakdown (flat fees, modular rates, or retainer terms) total estimating between $20k to $150k depending on complexity.
- termsAndConditions: Brief standard service level agreement terms.

Respond strictly in JSON format matching this structure:
{
  "companyOverview": "EpitomeTRC overview text...",
  "projectScope": "Scope details...",
  "services": [
    { "name": "Service Name", "description": "Service description..." }
  ],
  "timeline": [
    { "milestone": "Phase 1: Architecture Review", "duration": "Weeks 1-2", "description": "Detailing database design models." }
  ],
  "deliverables": [
    "Production-ready Next.js Dashboard codebase hosted on Vercel"
  ],
  "estimatedPricing": {
    "total": "$45,000",
    "breakdown": [
      { "item": "Cloud Provisioning & Database Setup", "cost": "$15,000" },
      { "item": "Frontend Tailwind Dashboard & App router integration", "cost": "$30,000" }
    ]
  },
  "termsAndConditions": "Payment terms are 50% upfront, 50% upon successful verification and handover..."
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

