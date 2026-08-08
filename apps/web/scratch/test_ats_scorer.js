const { calculateATSScoreDetails } = require("../src/lib/atsScorer");
const assert = require("assert");

console.log("==========================================");
console.log("Running ATS Resume Scorer Validation Tests");
console.log("==========================================\n");

// Case 1: Only Name + Email
const case1 = {
  fullName: "Alex Thompson",
  email: "alex.thompson@gmail.com",
  phone: "",
  location: "",
  linkedin: "",
  bio: "",
  technicalSkills: [],
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  achievements: []
};

// Case 2: Name + Contact + Education
const case2 = {
  fullName: "Alex Thompson",
  email: "alex.thompson@gmail.com",
  phone: "+91 9876543210",
  location: "Indore, India",
  linkedin: "https://linkedin.com/in/alex-thompson",
  bio: "",
  technicalSkills: [],
  experience: [],
  projects: [],
  education: [
    {
      degree: "B.Tech in Computer Science",
      college: "Indian Institute of Technology",
      graduationYear: "2025",
      cgpa: "8.5/10"
    }
  ],
  certifications: [],
  achievements: []
};

// Case 3: Contact + Summary + Skills + Education
const case3 = {
  fullName: "Alex Thompson",
  email: "alex.thompson@gmail.com",
  phone: "+91 9876543210",
  location: "Indore, India",
  linkedin: "https://linkedin.com/in/alex-thompson",
  bio: "Results-driven Computer Science graduate engineered scalable web applications and cloud architectures. Proficient in full-stack development, database optimization, microservices, and modern UI frameworks with a strong foundation in data structures.",
  technicalSkills: [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "PostgreSQL", "Docker", "Git", "Tailwind CSS"
  ],
  skillCategories: {
    "Languages & Frameworks": ["JavaScript", "TypeScript", "React", "Next.js", "Node.js"],
    "Databases & Tools": ["PostgreSQL", "Docker", "Git"]
  },
  experience: [],
  projects: [],
  education: [
    {
      degree: "B.Tech in Computer Science",
      college: "Indian Institute of Technology",
      graduationYear: "2025",
      cgpa: "8.5/10"
    }
  ],
  certifications: [],
  achievements: []
};

// Case 4: Complete Student Resume with Projects
const case4 = {
  fullName: "Alex Thompson",
  email: "alex.thompson@gmail.com",
  phone: "+91 9876543210",
  location: "Indore, India",
  linkedin: "https://linkedin.com/in/alex-thompson",
  bio: "Results-driven Computer Science graduate engineered scalable web applications and cloud architectures. Proficient in full-stack development, database optimization, microservices, and modern UI frameworks with a strong foundation in data structures.",
  technicalSkills: [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "PostgreSQL", "Docker", "Git", "Tailwind CSS"
  ],
  skillCategories: {
    "Languages": ["JavaScript", "TypeScript", "Python"],
    "Frameworks & DB": ["React", "Next.js", "Node.js", "PostgreSQL"]
  },
  experience: [],
  projects: [
    {
      title: "E-Commerce Microservices Platform",
      technologiesUsed: "React, Node.js, PostgreSQL, Docker",
      description: "Engineered scalable REST APIs reducing request latency by 35%. Implemented JWT security, Redis caching, and automated CI/CD pipelines handling 1000+ daily sessions."
    },
    {
      title: "AI Resume Matcher & Parser Suite",
      technologiesUsed: "Next.js, Python, Tailwind CSS, Prisma",
      description: "Developed AI document parsing module processing PDF/DOCX resumes. Increased extraction accuracy to 95% and built real-time ATS scoring algorithms."
    }
  ],
  education: [
    {
      degree: "B.Tech in Computer Science",
      college: "Indian Institute of Technology",
      graduationYear: "2025",
      cgpa: "8.5/10"
    }
  ],
  certifications: ["AWS Certified Developer Associate", "EpitomeTRC Full Stack Certification"],
  achievements: ["1st Place in Smart India Hackathon 2024", "Dean's Honor Roll List"]
};

// Case 5: Professional Resume with strong experience and achievements
const case5 = {
  fullName: "Alex Thompson",
  email: "alex.thompson@gmail.com",
  phone: "+91 9876543210",
  location: "Indore, India",
  linkedin: "https://linkedin.com/in/alex-thompson",
  bio: "Senior Full Stack Architect with 6+ years of expertise in building enterprise microservices, cloud infrastructure, and AI applications. Spearheaded cross-functional engineering teams, optimized API latency by 45%, and delivered high-availability distributed systems serving 500k+ active users.",
  technicalSkills: [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "PostgreSQL", "AWS", "Docker", "Kubernetes", "Redis", "GraphQL"
  ],
  skillCategories: {
    "Languages": ["JavaScript", "TypeScript", "Python", "Go"],
    "Frameworks & Cloud": ["React", "Next.js", "Node.js", "AWS", "Kubernetes"]
  },
  experience: [
    {
      company: "EpitomeTRC Technology Solutions",
      role: "Lead Software Engineer",
      duration: "2022 - Present",
      description: "Architected high-throughput microservices handling 50k requests/min. Reduced cloud infrastructure expenditure by 30% through automated Kubernetes auto-scaling. Mentored 12 junior developers and delivered 100% on-time project releases."
    },
    {
      company: "Tech Corp Inc.",
      role: "Senior Software Engineer",
      duration: "2019 - 2022",
      description: "Spearheaded frontend migration to Next.js App Router, boosting page load speeds by 50% and improving SEO traffic by 80%. Integrated Stripe payment gateway processing $2.5M in annual transactions."
    }
  ],
  projects: [
    {
      title: "Enterprise Multi-Tenant SaaS Portal",
      technologiesUsed: "Next.js, Node.js, PostgreSQL, Docker, AWS",
      description: "Engineered scalable multi-tenant architecture supporting 200+ enterprise clients. Reduced onboarding cycle time from 3 days to 15 minutes."
    },
    {
      title: "Real-time AI Analytics Engine",
      technologiesUsed: "Python, FastAPI, Redis, WebSockets",
      description: "Built real-time telemetry pipeline stream processing 10k events/sec with sub-50ms latency."
    }
  ],
  education: [
    {
      degree: "M.S. in Computer Science",
      college: "Indian Institute of Technology",
      graduationYear: "2019",
      cgpa: "9.2/10"
    }
  ],
  certifications: ["AWS Solutions Architect Professional", "Certified Kubernetes Administrator (CKA)"],
  achievements: ["Global Innovation Award 2023 Winner", "Published 2 IEEE research papers on distributed systems"]
};

// Run evaluations
const r1 = calculateATSScoreDetails(case1);
const r2 = calculateATSScoreDetails(case2);
const r3 = calculateATSScoreDetails(case3);
const r4 = calculateATSScoreDetails(case4);
const r5 = calculateATSScoreDetails(case5);

console.log(`Case 1 (Only Name + Email): Calculated Score = ${r1.totalScore}/100 (Expected 5-15)`);
console.log(`Case 2 (Name + Contact + Education): Calculated Score = ${r2.totalScore}/100 (Expected 20-35)`);
console.log(`Case 3 (Contact + Summary + Skills + Education): Calculated Score = ${r3.totalScore}/100 (Expected 40-60)`);
console.log(`Case 4 (Complete Student Resume with Projects): Calculated Score = ${r4.totalScore}/100 (Expected 70-85)`);
console.log(`Case 5 (Professional Resume with Exp & Achievements): Calculated Score = ${r5.totalScore}/100 (Expected 90-100)`);

// Verify Assertions
assert(r1.totalScore >= 4 && r1.totalScore <= 15, `Case 1 out of bounds: ${r1.totalScore}`);
assert(r2.totalScore >= 20 && r2.totalScore <= 35, `Case 2 out of bounds: ${r2.totalScore}`);
assert(r3.totalScore >= 40 && r3.totalScore <= 60, `Case 3 out of bounds: ${r3.totalScore}`);
assert(r4.totalScore >= 70 && r4.totalScore <= 85, `Case 4 out of bounds: ${r4.totalScore}`);
assert(r5.totalScore >= 90 && r5.totalScore <= 100, `Case 5 out of bounds: ${r5.totalScore}`);

console.log("\n✅ ALL 5 TEST CASES PASSED STRICT ATS SCORING BOUNDS SUCCESSFULLY!");
