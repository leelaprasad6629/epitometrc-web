"use client";

import { useState, useEffect, useCallback } from "react";
import SubscriptionModal from "@/components/courses/SubscriptionModal";
import {
  Clock,
  Star,
  Users,
  Award,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  HelpCircle,
  FileText,
  Video,
  PlayCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { LMSCourse, LMSLesson } from "@/types/lms";
import { cn } from "@/lib/utils";

interface CourseDetailsClientProps {
  course: LMSCourse;
}

export default function CourseDetailsClient({ course }: CourseDetailsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"about" | "syllabus" | "instructor" | "reviews" | "faqs">("about");
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(course.courseModules?.[0]?.id || "mod-1");
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Free Preview States
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Partial<LMSLesson> | null>(null);
  const [lessons, setLessons] = useState<LMSLesson[]>([]);

  const fetchLessons = useCallback(async () => {
    try {
      const res = await fetch(`/api/courses/${course.id}/lessons`);
      const data = await res.json();
      if (data.success) {
        setLessons(data.lessons);
        const firstPreview = data.lessons.find((l: LMSLesson) => l.isFreePreview);
        if (firstPreview) {
          setActiveLesson(firstPreview);
        }
      }
    } catch (e) {
      console.error("Failed to fetch lessons:", e);
    }
  }, [course.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLessons();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchLessons]);

  const handleEnrollClick = async () => {
    setEnrolling(true);
    try {
      const res = await fetch(`/api/courses/${course.id}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.status === 401) {
        setShowLockedModal(true);
        return;
      }
      if (data.success) {
        router.push(`/student/courses/${course.id}/learn`);
      }
    } catch (e) {
      console.error("Enroll click error:", e);
    } finally {
      setEnrolling(false);
    }
  };

  const handleLessonClick = (lessonTitle: string, isFreePreview: boolean, videoUrl?: string, lessonId?: string) => {
    if (course.enrolled) {
      router.push(`/student/courses/${course.id}/learn`);
      return;
    }

    if (!isFreePreview) {
      setShowLockedModal(true);
    } else {
      setIsPlaying(true);
      setActiveLesson({
        id: lessonId || "les-1",
        title: lessonTitle,
        videoUrl: videoUrl || "https://www.youtube.com/embed/6ynwj_h-DJ8",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 font-sans bg-slate-50 min-h-screen pb-24">
        {/* Course Hero Banner */}
        <section className="relative bg-gradient-to-r from-[#0b172a] via-[#112240] to-[#0b172a] text-white py-14 md:py-16">
          <Container className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-orange-500 text-white text-[11px] font-bold uppercase tracking-wider">
                  {course.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-semibold border border-slate-700">
                  {course.level}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  {course.language}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                {course.subtitle}
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="font-bold text-white text-sm">{course.rating}</span>
                  <span className="text-slate-400">({course.reviewsCount} reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-orange-400" />
                  <span>{course.enrolledCount} enrolled students</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>{course.duration} ({course.modules} Modules)</span>
                </div>
              </div>

              {/* Instructor Pill */}
              <div className="flex items-center gap-3 pt-2">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-orange-400/50 bg-slate-800 shrink-0">
                  <Image
                    src={course.instructorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                    alt={course.instructorName || "Instructor"}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Created by</p>
                  <p className="text-xs font-bold text-white">{course.instructorName}</p>
                </div>
              </div>
            </div>

            {/* Sticky Right CTA Box */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl text-slate-900 space-y-5">
                <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900">
                  {isPlaying && activeLesson?.videoUrl ? (
                    <iframe
                      src={activeLesson.videoUrl}
                      title={activeLesson.title}
                      className="w-full h-full border-0 absolute inset-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover"
                        sizes="350px"
                      />
                      <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                        <button
                          onClick={() => {
                            const firstPreview = course.courseModules
                              ?.flatMap((m) => m.lessons)
                              .find((l) => l.isFreePreview);
                            if (firstPreview) {
                              handleLessonClick(firstPreview.title, true, firstPreview.videoUrl, firstPreview.id);
                            } else {
                              handleLessonClick("Overview Preview Video", true, "https://www.youtube.com/embed/6ynwj_h-DJ8", "les-intro");
                            }
                          }}
                          className="p-3 bg-orange-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                          <PlayCircle className="w-8 h-8 fill-current" />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {isPlaying && activeLesson && (
                  <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-white space-y-1.5 text-left">
                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest font-sans">Now Playing Free Preview</p>
                    <h4 className="text-xs font-bold truncate font-sans">{activeLesson.title}</h4>
                    <button
                      onClick={() => {
                        const allLessons = course.courseModules?.flatMap((m) => m.lessons) || [];
                        const currentIndex = allLessons.findIndex((l) => l.title === activeLesson.title);
                        if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
                          const next = allLessons[currentIndex + 1];
                          handleLessonClick(next.title, next.isFreePreview, next.videoUrl, next.id);
                        } else {
                          setShowLockedModal(true);
                        }
                      }}
                      className="w-full mt-1 h-8 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-all rounded-xl"
                    >
                      Next Lesson
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold font-display text-slate-900">
                      {course.price === "Free" ? "Free Enrollment" : course.price}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Certificate Included
                    </span>
                  </div>

                  <button
                    onClick={handleEnrollClick}
                    disabled={enrolling}
                    className="w-full py-3.5 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{course.enrolled ? "Continue Learning" : "Enroll Now"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="space-y-2 text-xs text-slate-600 pt-2 font-sans">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>Full lifetime access to notes &amp; video lectures</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>Verified Certificate of Completion with QR code</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>Instructor Q&amp;A discussion support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Tabbed Detail Section */}
        <section className="py-10">
          <Container className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              {/* Tabs Navigation */}
              <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 no-scrollbar">
                {[
                  { key: "about", label: "Overview" },
                  { key: "syllabus", label: "Syllabus & Modules" },
                  { key: "instructor", label: "Instructor" },
                  { key: "reviews", label: "Reviews" },
                  { key: "faqs", label: "FAQs" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as "about" | "syllabus" | "instructor" | "reviews" | "faqs")}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                      activeTab === tab.key
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === "about" && (
                <div className="space-y-8">
                  {/* Detailed Description */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-xl font-bold font-display text-slate-900">About This Course</h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-sans">{course.description}</p>
                  </div>

                  {/* Learning Objectives */}
                  {course.learningObjectives && course.learningObjectives.length > 0 && (
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
                      <h3 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-orange-500" />
                        What You Will Learn
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.learningObjectives.map((obj, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-sans">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Covered Tags */}
                  {course.skillsCovered && course.skillsCovered.length > 0 && (
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-3">
                      <h3 className="text-lg font-bold font-display text-slate-900">Skills You Will Acquire</h3>
                      <div className="flex flex-wrap gap-2">
                        {course.skillsCovered.map((skill, i) => (
                          <span key={i} className="px-3 py-1 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 text-xs font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {course.prerequisites && course.prerequisites.length > 0 && (
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-3">
                      <h3 className="text-lg font-bold font-display text-slate-900">Prerequisites</h3>
                      <ul className="space-y-2 text-xs text-slate-600 font-sans">
                        {course.prerequisites.map((req, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Syllabus Tab */}
              {activeTab === "syllabus" && (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold font-display text-slate-900">Course Syllabus &amp; Modules</h3>
                      <p className="text-xs text-slate-500 font-sans">Preview the curriculum structure below</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      {course.courseModules?.length || 0} Modules
                    </span>
                  </div>

                  <div className="space-y-4">
                    {course.courseModules?.map((mod, idx) => {
                      const isExpanded = expandedModuleId === mod.id;
                      return (
                        <div key={mod.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                          <button
                            onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                            className="w-full p-4 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-left"
                          >
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 font-display">
                                Module {idx + 1}: {mod.title}
                              </h4>
                              {mod.description && <p className="text-xs text-slate-500 mt-0.5">{mod.description}</p>}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-400 font-semibold">{mod.lessons.length} lessons</span>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="p-4 bg-white divide-y divide-slate-100 space-y-2">
                              {mod.lessons.map((les) => {
                                const matchingLesson = lessons.find((l) => l.id === les.id);
                                const videoUrl = matchingLesson ? matchingLesson.videoUrl : undefined;
                                return (
                                  <div
                                    key={les.id}
                                    onClick={() => handleLessonClick(les.title, les.isFreePreview, videoUrl, les.id)}
                                    className="pt-2 flex items-center justify-between text-xs cursor-pointer hover:text-orange-600 transition-colors"
                                  >
                                    <div className="flex items-center gap-2.5">
                                      {les.type === "video" ? (
                                        <Video className="w-4 h-4 text-blue-500 shrink-0" />
                                      ) : les.type === "quiz" ? (
                                        <HelpCircle className="w-4 h-4 text-purple-500 shrink-0" />
                                      ) : (
                                        <FileText className="w-4 h-4 text-orange-500 shrink-0" />
                                      )}
                                      <span className="font-semibold text-slate-800">{les.title}</span>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                      <span className="text-slate-400">{les.duration}</span>
                                      {les.isFreePreview ? (
                                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                          Free Preview
                                        </span>
                                      ) : (
                                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Instructor Tab */}
              {activeTab === "instructor" && (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-start gap-5">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-orange-200 shrink-0 bg-slate-100">
                      <Image
                        src={course.instructorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
                        alt={course.instructorName || "Instructor"}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-display text-slate-900">{course.instructorName}</h3>
                      <p className="text-xs text-slate-500 font-semibold">{course.instructorRole}</p>
                      <p className="text-xs text-slate-600 mt-3 leading-relaxed">{course.instructorBio}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
                  <h3 className="text-xl font-bold font-display text-slate-900">Student Reviews &amp; Ratings</h3>
                  <div className="space-y-4">
                    {course.reviews?.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                            <div className="flex text-amber-400">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                          </div>
                          <span className="text-[11px] text-slate-400">{rev.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 font-sans">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs Tab */}
              {activeTab === "faqs" && (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-xl font-bold font-display text-slate-900">Frequently Asked Questions</h3>
                  <div className="space-y-3">
                    {course.faqs?.map((faq, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 font-display">Q: {faq.question}</h4>
                        <p className="text-xs text-slate-600 font-sans">A: {faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Container>
        </section>

        {/* Guest Content Locked Modal */}
        <SubscriptionModal
          isOpen={showLockedModal}
          onClose={() => setShowLockedModal(false)}
          onSubscribe={() => {
            setShowLockedModal(false);
            router.push(`/register?redirect=/courses/${course.id}&action=enroll`);
          }}
          onSignIn={() => {
            setShowLockedModal(false);
            router.push(`/login?redirect=/courses/${course.id}`);
          }}
        />
      </main>
      <Footer />
    </>
  );
}
