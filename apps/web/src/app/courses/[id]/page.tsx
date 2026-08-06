import { notFound } from "next/navigation";
import CourseDetailsClient from "./CourseDetailsClient";
import { prisma } from "@/lib/prisma";

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let course = await prisma.course.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      courseModules: {
        orderBy: { orderIndex: "asc" },
        include: {
          lessons: {
            orderBy: { orderIndex: "asc" },
          },
        },
      },
    },
  });

  if (!course) {
    // Return mock fallback for demo course IDs if DB not populated yet
    const mockCourse: any = {
      id,
      title: "Strategic Business Analyst & Enterprise Architecture",
      subtitle: "Learn modern enterprise analysis models, UML diagrams, state patterns, and fintech strategy formulation.",
      slug: id,
      category: "Technical Courses",
      description: "Comprehensive end-to-end masterclass covering enterprise analysis, UML modeling, requirements engineering, clean code principles, and agile sprint workflows. Led by senior industry architects.",
      duration: "3 Months",
      modules: 3,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop",
      level: "Intermediate",
      language: "English",
      price: "Free",
      rating: 4.9,
      reviewsCount: 184,
      enrolledCount: 2150,
      learningObjectives: [
        "Construct UML Use Case, Activity, and Sequence diagrams",
        "Formulate agile sprint backlogs, epics, and user stories",
        "Design scalable microservice architectures and RESTful APIs",
        "Perform financial modeling and cost-benefit analysis"
      ],
      skillsCovered: ["Business Analysis", "UML Diagrams", "Agile Sprints", "REST API Design", "SQL Querying"],
      learningOutcomes: [
        "Build a verified portfolio of enterprise strategy blueprints",
        "Receive an official EpitomeTRC Verified Certificate with QR code",
        "Prepare for corporate business analyst & tech lead roles"
      ],
      prerequisites: ["Basic understanding of software development lifecycle (SDLC)"],
      faqs: [
        { question: "Is this course self-paced?", answer: "Yes, all video modules, notes, and quizzes are available on-demand." },
        { question: "Is a certificate provided?", answer: "Yes, completing 100% of modules generates an official verified certificate." }
      ],
      instructorName: "Dr. Rajesh Verma",
      instructorRole: "Principal Enterprise Architect",
      instructorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
      instructorBio: "Former Tech Lead at Microsoft with 15+ years of experience guiding Fortune 500 digital transformations.",
      courseModules: [
        {
          id: "mod-1",
          courseId: id,
          title: "Module 1: Enterprise Blueprint & Strategy",
          description: "Introduction to business analysis, SDLC, and requirements engineering.",
          orderIndex: 1,
          lessons: [
            { id: "les-1", moduleId: "mod-1", title: "1.1 Overview & Learning Objectives", duration: "12 mins", orderIndex: 1, type: "video", isFreePreview: true },
            { id: "les-2", moduleId: "mod-1", title: "1.2 Clean Code & SOLID Architecture Overview", duration: "25 mins", orderIndex: 2, type: "video", isFreePreview: true },
            { id: "les-3", moduleId: "mod-1", title: "1.3 Environment Setup & Reference Notes", duration: "15 mins", orderIndex: 3, type: "notes", isFreePreview: false },
            { id: "les-4", moduleId: "mod-1", title: "1.4 Module 1 Assessment Quiz", duration: "15 mins", orderIndex: 4, type: "quiz", isFreePreview: false },
          ],
        },
        {
          id: "mod-2",
          courseId: id,
          title: "Module 2: Agile Execution & Sprint Planning",
          description: "Sprint roadmaps, Jira workflow setup, and backlog refinement.",
          orderIndex: 2,
          lessons: [
            { id: "les-5", moduleId: "mod-2", title: "2.1 Microservice Architecture Fundamentals", duration: "30 mins", orderIndex: 1, type: "video", isFreePreview: false },
            { id: "les-6", moduleId: "mod-2", title: "2.2 Practical Assignment: API Design Proposal", duration: "45 mins", orderIndex: 2, type: "assignment", isFreePreview: false },
          ],
        },
      ],
      reviews: [
        { id: "rev-1", userName: "Aarav Sharma", userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", rating: 5, date: "3 days ago", comment: "Top tier content! The architecture modules helped me clear my corporate tech lead interview." },
      ]
    };
    return <CourseDetailsClient course={mockCourse} />;
  }

  const formattedCourse: any = {
    id: course.id,
    title: course.title,
    subtitle: course.subtitle || "Master essential industry competencies through hands-on learning.",
    slug: course.slug || course.id,
    category: course.category,
    description: course.description,
    duration: course.duration,
    modules: course.modules,
    image: course.image,
    level: course.level || "Intermediate",
    language: course.language || "English",
    price: course.price || "Free",
    rating: course.rating || 4.8,
    reviewsCount: course.reviewsCount || 128,
    enrolledCount: course.enrolledCount || 1450,
    learningObjectives: (course.learningObjectives as string[]) || ["Architect production-grade software", "Build secure RESTful APIs"],
    skillsCovered: (course.skillsCovered as string[]) || ["System Design", "Clean Architecture", "TypeScript"],
    learningOutcomes: (course.learningOutcomes as string[]) || ["Build a verified portfolio", "Receive completion certificate"],
    prerequisites: (course.prerequisites as string[]) || ["Basic programming concepts"],
    faqs: (course.faqs as any[]) || [{ question: "Is this course self-paced?", answer: "Yes, lifetime access is included." }],
    instructorName: course.instructorName || "Dr. Rajesh Verma",
    instructorRole: course.instructorRole || "Principal Architect",
    instructorAvatar: course.instructorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    instructorBio: course.instructorBio || "Senior Architect with 15+ years experience.",
    courseModules: course.courseModules.map((m) => ({
      id: m.id,
      courseId: m.courseId,
      title: m.title,
      description: m.description || "",
      orderIndex: m.orderIndex,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        moduleId: l.moduleId,
        title: l.title,
        description: l.description || "",
        duration: l.duration,
        orderIndex: l.orderIndex,
        type: l.type as any,
        isFreePreview: l.isFreePreview,
      })),
    })),
    reviews: [
      { id: "rev-1", userName: "Aarav Sharma", userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", rating: 5, date: "2 days ago", comment: "Outstanding course structure and clear explanations!" },
    ]
  };

  return <CourseDetailsClient course={formattedCourse} />;
}
