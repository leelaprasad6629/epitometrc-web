const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Clean database
  await prisma.enquiry.deleteMany();
  await prisma.application.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.job.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Create hashed password
  const passwordHash = await bcrypt.hash("Password123", 10);

  // Seed Users
  const student = await prisma.user.create({
    data: {
      name: "Alex Thompson",
      email: "alex.t@epitometrc.com",
      passwordHash,
      role: "Student",
    },
  });

  const employee = await prisma.user.create({
    data: {
      name: "Marcus Thorne",
      email: "m.thorne@epitometrc.com",
      passwordHash,
      role: "Employee",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Sarah Jennings",
      email: "s.jennings@epitometrc.com",
      passwordHash,
      role: "Admin",
    },
  });

  console.log("Users seeded successfully.");

  // Seed Courses
  const c1 = await prisma.course.create({
    data: {
      title: "Strategic Business Analyst",
      category: "Technical Courses",
      description: "Learn modern enterprise analysis models, UML diagrams, and fintech strategy formulation.",
      duration: "3 Months",
      modules: 10,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop",
    },
  });

  const c2 = await prisma.course.create({
    data: {
      title: "Advanced Execution & Strategy",
      category: "Workshops",
      description: "Assemble operational roadmaps, run agile sprint plans, and implement KPIs for scaling startups.",
      duration: "6 Weeks",
      modules: 6,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
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

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: c2.id,
      progress: 15,
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
      jobId: j2.id,
      status: "Reviewing",
    },
  });

  await prisma.application.create({
    data: {
      userId: student.id,
      jobId: j1.id,
      status: "Interviewing",
    },
  });

  console.log("Applications seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
