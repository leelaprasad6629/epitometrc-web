const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
try { require("dotenv").config(); } catch (e) {}

const prisma = new PrismaClient();

async function main() {
  // Clean database
  await prisma.enquiry.deleteMany();
  await prisma.application.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.job.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Create hashed passwords for standardized demo access
  const adminPasswordHash = await bcrypt.hash("AdminPass123!", 10);
  const employeePasswordHash = await bcrypt.hash("EmployeeTemp123!", 10);
  const internPasswordHash = await bcrypt.hash("InternTemp123!", 10);
  const studentPasswordHash = await bcrypt.hash("StudentTemp123!", 10);

  // Seed Standardized Users
  const admin = await prisma.user.create({
    data: {
      name: "Epitome Admin",
      email: "admin@epitometrc.com",
      passwordHash: adminPasswordHash,
      role: "Admin",
    },
  });

  const employee = await prisma.user.create({
    data: {
      name: "Epitome Staff",
      email: "employee@epitometrc.com",
      passwordHash: employeePasswordHash,
      role: "Employee",
    },
  });

  const intern = await prisma.user.create({
    data: {
      name: "Epitome Intern",
      email: "intern@epitometrc.com",
      passwordHash: internPasswordHash,
      role: "Intern",
    },
  });

  const student = await prisma.user.create({
    data: {
      name: "Alex Thompson (Demo Student)",
      email: "alex.student@gmail.com",
      passwordHash: studentPasswordHash,
      role: "Student",
    },
  });

  console.log("Standardized demo users seeded successfully.");

  // Seed Courses
  const c1 = await prisma.course.create({
    data: {
      title: "Strategic Business Analyst (TESTING / SAMPLE COURSE)",
      category: "Technical Courses",
      description: "Learn modern enterprise analysis models, UML diagrams, and fintech strategy formulation.",
      duration: "3 Months",
      modules: 10,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop",
    },
  });

  console.log("Courses seeded successfully.");

  // Seed Enrollments
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: c1.id,
      progress: 60,
    },
  });

  console.log("Enrollments seeded successfully.");

  // Seed Jobs
  const j1 = await prisma.job.create({
    data: {
      title: "Senior Full Stack Developer",
      category: "Engineering",
      location: "Indore, India",
      type: "Full Time",
      description: "Lead the development of high-performance enterprise applications using React, Node.js, and AWS.",
    },
  });

  const j2 = await prisma.job.create({
    data: {
      title: "Strategy Consultant",
      category: "Consulting",
      location: "Indore, India",
      type: "Full Time",
      description: "Advise Fortune 500 executives on digital transformation and market entry strategies. Requires strong analytical skills.",
    },
  });

  const j3 = await prisma.job.create({
    data: {
      title: "Technical Recruiter",
      category: "Staffing",
      location: "Indore, India",
      type: "Full Time",
      description: "Shape our engineering teams by identifying, attracting, and onboarding top talent for our clients in the technology sector.",
    },
  });

  console.log("Jobs seeded successfully.");

  // Seed Applications
  await prisma.application.create({
    data: {
      userId: student.id,
      jobId: j1.id,
      status: "Interviewing",
    },
  });

  console.log("Applications seeded successfully.");

  // Clean the new content management tables
  await prisma.companyInfo.deleteMany();
  await prisma.companyStat.deleteMany();
  await prisma.companyService.deleteMany();
  await prisma.companyTestimonial.deleteMany();
  await prisma.successStory.deleteMany();
  await prisma.refresherSession.deleteMany();
  await prisma.membershipPlan.deleteMany();
  await prisma.aIFeatureConfig.deleteMany();

  // 1. Seed CompanyInfo
  await prisma.companyInfo.create({
    data: {
      phone: "+91-626-596-6705",
      email: "careers@epitometrc.com",
      address: "Headquartered in Indore, Madhya Pradesh | Serving PAN India",
      mapQuery: "Epitome Training & Recruitment Consultants, Indore"
    }
  });

  // 2. Seed CompanyStats
  await prisma.companyStat.createMany({
    data: [
      { key: "trainingsInternships", label: "Internships Facilitated", value: "7000+", desc: "Careers upskilled & certified", iconName: "GraduationCap", persona: "student", order: 1 },
      { key: "clients", label: "Corporate Clients", value: "340+", desc: "Partners globally served", iconName: "Building2", persona: "corporate", order: 2 },
      { key: "projects", label: "Projects Completed", value: "160+", desc: "Enterprise tech deliverables", iconName: "Layers", persona: "corporate", order: 3 },
      { key: "collegeTieUps", label: "College Partners", value: "200+", desc: "Institutional collaboration nodes", iconName: "Award", persona: "student", order: 4 }
    ]
  });

  // 3. Seed CompanyServices
  await prisma.companyService.createMany({
    data: [
      {
        title: "IT Development & Technology Solutions",
        subtitle: "Enterprise Engineering & Product Delivery",
        slug: "it-services",
        description: "We engineer cloud native software systems, optimize legacy applications, and automate release pipelines under strict SLAs.",
        iconName: "Code2",
        category: "Technology Solutions",
        features: JSON.stringify(["Cloud native architecture", "DevOps orchestration", "Security hardening"]),
        persona: "corporate"
      },
      {
        title: "Corporate Technical Upskilling",
        subtitle: "High-Fidelity Engineering Cohorts",
        slug: "training",
        description: "Transform your development teams into productive cloud-native developers using mentored hands-on code bootcamps.",
        iconName: "GraduationCap",
        category: "Corporate Training",
        features: JSON.stringify(["Custom enterprise stack bootcamps", "Agile workspace workflows", "UML architecture modeling"]),
        persona: "corporate"
      },
      {
        title: "Strategic Advisory & Consulting",
        subtitle: "Digital Advisory & Enterprise Strategy",
        slug: "consulting",
        description: "We help C-suite teams map out digital transformations, build integration strategies, and secure IT governance architectures.",
        iconName: "Globe",
        category: "Consulting Services",
        features: JSON.stringify(["IT architecture governance", "Security posture assessments", "FinTech strategic formulation"]),
        persona: "corporate"
      }
    ]
  });

  // 4. Seed SuccessStories (Case Studies)
  await prisma.successStory.createMany({
    data: [
      {
        title: "Enterprise Systems Re-engineering & Digital Transformation",
        clientType: "Healthcare Enterprise Client A",
        industry: "Healthcare Technology",
        challenge: "Legacy architecture hindered operational scalability and caused latency bottlenecks across hospital diagnostic pipelines.",
        solution: "Implemented cloud microservices architecture and set up fully automated deployment cycles.",
        results: JSON.stringify(["Zero downtime migration phase", "4.2x increase in daily data throughput", "100% compliance with ISO privacy standards"]),
        primaryMetricVal: "4.2x",
        primaryMetricLabel: "System Throughput",
        secondaryMetricVal: "0",
        secondaryMetricLabel: "Outage Days",
        trustBadge: "Verified Enterprise Project",
        category: "consulting"
      },
      {
        title: "Automated Tech Recruiting & Senior Developer Staffing",
        clientType: "Global FinTech Enterprise B",
        industry: "Financial Services",
        challenge: "Struggled with 90-day time-to-hire delays for specialized React & Next.js engineers.",
        solution: "Leveraged pre-vetted technical pipelines and automated screening to match top-tier candidate matches.",
        results: JSON.stringify(["Reduced hiring cycle from 90 to 18 days", "18 senior developers placed", "98.4% 12-month retention rate"]),
        primaryMetricVal: "65%",
        primaryMetricLabel: "Faster Time-to-Hire",
        secondaryMetricVal: "98.4%",
        secondaryMetricLabel: "Candidate Retention",
        trustBadge: "Pan-India Recruitment Node",
        category: "recruitment"
      }
    ]
  });

  // 5. Seed RefresherSessions
  await prisma.refresherSession.createMany({
    data: [
      {
        title: "Bridge Session: Transitioning from Fundamentals to Advanced DSA",
        description: "Interactive live workshop breaking down algorithmic complexities and memory management principles.",
        duration: "90 mins",
        skills: JSON.stringify(["Complexity Analysis", "Memory Allocation", "Arrays & Pointers"])
      },
      {
        title: "SQL Masterclass: Query Optimization & Real-World Schema Design",
        description: "Learn how to profile slow SQL queries, design database indexes, and fix performance bottlenecks.",
        duration: "90 mins",
        skills: JSON.stringify(["Database Indexing", "Query Optimization", "ER Schemas"])
      }
    ]
  });

  // 6. Seed MembershipPlans
  await prisma.membershipPlan.createMany({
    data: [
      {
        name: "Free Plan",
        price: "₹0",
        interval: "Forever",
        features: JSON.stringify(["1 Resume & 1 ATS Scan", "Career Roadmap", "1 Free AI Mock Interview"]),
        maxInterviews: 1,
        maxResumes: 1
      },
      {
        name: "Career Premium",
        price: "₹999",
        interval: "month",
        features: JSON.stringify(["Unlimited Resume Checks", "Resume Score Improvement", "10 AI Mock Interviews/mo"]),
        maxInterviews: 10,
        maxResumes: -1
      },
      {
        name: "Career Professional",
        price: "₹2,499",
        interval: "month",
        features: JSON.stringify(["Everything in Premium", "30 AI Mock Interviews/mo", "JD-based Resume Customization"]),
        maxInterviews: 30,
        maxResumes: -1
      }
    ]
  });

  // 7. Seed AIFeatureConfigs
  await prisma.aIFeatureConfig.createMany({
    data: [
      {
        featureName: "Mock Interviews",
        description: "Graded simulator assessing fluency, grammar, and technical depth.",
        capabilities: JSON.stringify(["Filler word filtering", "STAR evaluation", "Custom follow-ups"])
      },
      {
        featureName: "Resume Optimization",
        description: "ATS scanner matching candidate keywords to job description schemas.",
        capabilities: JSON.stringify(["Keyword overlap scoring", "Missing skills suggestions", "Explainability feedback"])
      }
    ]
  });

  console.log("Content management default records seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
