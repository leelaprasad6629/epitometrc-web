"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Award, Users, ArrowRight, Calendar, ExternalLink, Video, X, Mic, MicOff, VideoOff, PhoneOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/Button";
import AIMockInterviewWidget from "@/components/ai/AIMockInterviewWidget";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { cn } from "@/lib/utils";
import ProgressBar, { ProgressRing } from "@/components/dashboard/ProgressBar";
import PriorityAlert, { PriorityItem } from "@/components/dashboard/PriorityAlert";

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Calendar & Call modal state
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  
  // Call controls state
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Fetch current user
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success && payload.user) {
          setCurrentUser(payload.user);
        }
      })
      .catch(() => {});

    // Fetch dashboard data
    fetch("/api/student/dashboard")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setData(payload);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Call timer and WebRTC camera stream hook
  useEffect(() => {
    let timer: any;
    let streamInstance: MediaStream | null = null;

    if (showCallModal) {
      setCallDuration(0);
      setMicActive(true);
      setCameraActive(true);

      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      // Access camera and microphone
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          streamInstance = stream;
          setMediaStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn("Media devices access failed:", err);
        });
    }

    return () => {
      clearInterval(timer);
      if (streamInstance) {
        streamInstance.getTracks().forEach((track) => track.stop());
      }
      setMediaStream(null);
    };
  }, [showCallModal]);

  // Sync microphone track enablement
  useEffect(() => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = micActive;
      });
    }
  }, [micActive, mediaStream]);

  // Sync camera track enablement
  useEffect(() => {
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach((track) => {
        track.enabled = cameraActive;
      });
    }
  }, [cameraActive, mediaStream]);

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
  };

  const stats = [
    { label: "Active Courses", value: data?.stats?.activeCourses !== undefined ? String(data.stats.activeCourses).padStart(2, '0') : "00", icon: BookOpen, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { label: "Pending Assignments", value: data?.stats?.pendingAssignments !== undefined ? String(data.stats.pendingAssignments).padStart(2, '0') : "00", icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { label: "Certifications", value: data?.stats?.certifications !== undefined ? String(data.stats.certifications).padStart(2, '0') : "00", icon: Award, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Mentor Sessions", value: data?.stats?.mentorSessions !== undefined ? String(data.stats.mentorSessions).padStart(2, '0') : "00", icon: Users, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  ];

  const recommendedPrograms = data?.recommended?.length > 0
    ? data.recommended.map((r: any) => ({
        id: r.id,
        title: r.title,
        location: r.location,
        duration: r.duration,
        tags: ["Strategy", "Enterprise"],
        image: r.image,
      }))
    : [];

  const deadlines = [
    { title: "Market Research Draft", due: "Due Today, 11:59 PM", status: "URGENT" },
    { title: "Final Strategy Presentation", due: "Due in 3 days (10 Dec)", status: "NORMAL" },
    { title: "Internship Application: IT Dev", due: "Due in 5 days (12 Dec)", status: "NORMAL" },
  ];

  const recentActivity = [
    {
      type: "submission",
      title: "Assignment Submitted",
      details: "Advanced Strategy: Case Study 04 submitted for review.",
      time: "2 hours ago",
      color: "bg-blue-500",
    },
    {
      type: "grade",
      title: "Grade Published",
      details: "You received an 'A' for 'Introduction to Corporate Ethics'.",
      time: "Yesterday, 4:30 PM",
      color: "bg-emerald-500",
    },
  ];

  const priorityItems: PriorityItem[] = [
    {
      id: "skills-missing",
      title: "Add missing skills to your resume",
      type: "attention",
      description: "AWS and Docker are missing. Adding them will improve your ATS Score by 15%.",
      actionLabel: "Edit Profile",
      onAction: () => { window.location.href = "/student/profile"; }
    },
    {
      id: "mock-practice",
      title: "Practice AI Mock Interview",
      type: "today",
      description: "You have an upcoming Frontend interview simulated slot ready.",
      actionLabel: "Start Practice",
      onAction: () => {
        const widget = document.getElementById("mock-interview-widget");
        if (widget) widget.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      id: "course-due",
      title: "Submit Market Research Draft",
      type: "next",
      description: "Your course assignment is due today by 11:59 PM.",
      actionLabel: "Go to Course",
      onAction: () => { window.location.href = "/student/courses"; }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans text-xs"
    >
      {/* Top Banner section */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient opacity-10 pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <span className="px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 font-bold text-[9px] uppercase tracking-wider">
            AI WORKSPACE ACTIVE
          </span>
          <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
            Welcome back, {currentUser?.name || "Student"}.
          </h1>
          <p className="text-slate-500 text-[11px] font-medium leading-relaxed max-w-2xl">
            EpitomeTRC AI Advisor: "Your profile is 80% complete. We found 3 new matches matching your expertise. Practice mock interviews to boost matching."
          </p>
        </div>
        <Button href="/student/courses" variant="primary" className="h-10 rounded-xl px-5 font-bold shrink-0 self-start md:self-auto relative z-10 shadow-md shadow-orange-500/10">
          Continue Learning
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Action Center & Profile Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCard glowColor="blue">
            <PriorityAlert items={priorityItems} />
          </DashboardCard>
        </div>
        <div>
          <DashboardCard glowColor="indigo" title="AI Profile Health" subtitle="Summary checklist credentials status">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-3 bg-indigo-50/20 rounded-2xl border border-indigo-100/30">
                <ProgressRing percent={80} size={76} strokeWidth={6} variant="indigo" label="Profile" />
                <span className="text-[10px] font-bold text-indigo-600 mt-2">Completed</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-purple-50/20 rounded-2xl border border-purple-100/30">
                <ProgressRing percent={85} size={76} strokeWidth={6} variant="purple" label="ATS Score" />
                <span className="text-[10px] font-bold text-purple-600 mt-2">Resume Fit</span>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <DashboardCard key={idx} className="space-y-3" glowColor={idx === 0 ? "blue" : idx === 1 ? "orange" : idx === 2 ? "purple" : "indigo"}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                  {stat.label}
                </span>
                <span className={cn("p-1.5 rounded-lg border", stat.color)}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="text-3xl font-extrabold text-[#0b172a] leading-none tracking-tight">
                {stat.value}
              </p>
            </DashboardCard>
          );
        })}
      </div>

      {/* AI Mock Interview Simulator Container */}
      <div id="mock-interview-widget" className="scroll-mt-6">
        <AIMockInterviewWidget />
      </div>

      {/* Main Grid: Recommended Programs & Sidebar Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Programs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-base font-bold text-[#0b172a] uppercase tracking-wider">
              Recommended Programs
            </h2>
            <Link href="/courses" className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedPrograms.map((prog: any) => (
              <div key={prog.id} className="group rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={prog.image}
                    alt={prog.title}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {prog.tags.map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-[#0b172a]/80 backdrop-blur-sm text-[9px] font-bold text-white uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-display text-sm font-bold text-[#0b172a] leading-snug group-hover:text-orange-500 transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-400 font-sans">{prog.location}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                    <span className="text-[11px] font-semibold text-slate-600 font-sans">{prog.duration}</span>
                    <Button href="/student/courses" variant="outline" size="sm" className="h-7 text-xs px-3 rounded-lg font-bold">
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="space-y-4 pt-2">
            <h2 className="font-display text-base font-bold text-[#0b172a] uppercase tracking-wider">
              Recent Activity
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm divide-y divide-slate-100">
              {recentActivity.map((act, idx) => (
                <div key={idx} className="flex gap-4 py-3.5 first:pt-0 last:pb-0 items-start">
                  <span className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${act.color}`}></span>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">{act.title}</p>
                    <p className="text-xs text-slate-500 font-sans leading-relaxed">{act.details}</p>
                    <span className="text-[10px] text-slate-400 font-medium font-sans block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets (Deadlines & Mentor Session) */}
        <div className="space-y-6">
          {/* Deadlines Widget */}
          <DashboardCard glowColor="orange" title="Deadlines" headerAction={
            <span className="rounded bg-red-50 px-1.5 py-0.5 text-[9px] font-bold text-red-600 uppercase tracking-wider">
              Urgent
            </span>
          }>
            <div className="space-y-3.5 mb-4">
              {deadlines.map((dl, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-700 leading-snug">{dl.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium font-sans">{dl.due}</p>
                  </div>
                  {dl.status === "URGENT" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0 mt-1.5"></span>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={() => setShowCalendarModal(true)}
              variant="outline"
              className="w-full h-9 rounded-xl text-xs font-bold"
            >
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              View Calendar
            </Button>
          </DashboardCard>

          {/* Next Mentor Session */}
          <DashboardCard glowColor="indigo" title="Next Mentor Session">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full border border-slate-100">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
                    alt="Sarah Jenkins"
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[#0b172a]">Sarah Jenkins</p>
                  <span className="text-[10px] text-slate-400 font-medium font-sans block mt-0.5">Senior Strategy Consultant</span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Scheduled for</span>
                  <span className="text-xs font-bold text-slate-700">Tomorrow, 10:00 AM</span>
                </div>
                <Clock className="h-5 w-5 text-slate-400" />
              </div>

              <Button
                onClick={() => setShowCallModal(true)}
                variant="primary"
                className="w-full h-9 rounded-xl text-xs font-bold bg-[#0b172a] hover:bg-slate-800 shadow-none border-0"
              >
                <Video className="mr-1.5 h-3.5 w-3.5" />
                Join Meeting
              </Button>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b172a]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
                July 2026 Scheduler
              </h3>
              <button
                onClick={() => setShowCalendarModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mini Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-700">
              {/* Pad empty days for July 2026 starting on Wednesday */}
              <span className="text-slate-200">28</span>
              <span className="text-slate-200">29</span>
              <span className="text-slate-200">30</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              {/* July 9 (Today) */}
              <span className="relative flex items-center justify-center h-7 w-7 mx-auto rounded-full bg-orange-500 text-white font-bold">9</span>
              {/* July 10 (Mentor call) */}
              <span className="relative flex items-center justify-center h-7 w-7 mx-auto rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-bold group cursor-pointer" title="Mentor Session">
                10
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-blue-500"></span>
              </span>
              <span>11</span>
              {/* July 12 (IT Application due) */}
              <span className="relative flex items-center justify-center h-7 w-7 mx-auto rounded-full bg-red-50 border border-red-200 text-red-600 font-bold group cursor-pointer" title="Internship Application Due">
                12
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-red-500"></span>
              </span>
              <span>13</span>
              <span>14</span>
              <span>15</span>
              <span>16</span>
              <span>17</span>
              <span>18</span>
              <span>19</span>
              <span>20</span>
              <span>21</span>
              <span>22</span>
              <span>23</span>
              <span>24</span>
              <span>25</span>
              <span>26</span>
              <span>27</span>
              <span>28</span>
              <span>29</span>
              <span>30</span>
              <span>31</span>
            </div>

            {/* Event agenda */}
            <div className="space-y-2 border-t border-slate-100 pt-3 text-left">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Events</h4>
              <div className="flex items-start gap-2.5 rounded-xl bg-blue-50/40 p-2.5 border border-blue-100/30">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                <div className="text-xs">
                  <p className="font-bold text-[#0b172a]">Mentor Session with Sarah Jenkins</p>
                  <p className="text-[10px] text-slate-500 font-medium font-sans">Tomorrow, 10:00 AM - 10:45 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl bg-red-50/40 p-2.5 border border-red-100/30">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5"></span>
                <div className="text-xs">
                  <p className="font-bold text-[#0b172a]">Internship Application Deadline</p>
                  <p className="text-[10px] text-slate-500 font-medium font-sans">12 July, 11:59 PM (IT Development)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mock Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b172a] p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="relative w-full max-w-3xl h-[80vh] flex flex-col justify-between rounded-3xl bg-slate-900 overflow-hidden shadow-2xl border border-slate-800 text-white animate-in zoom-in-95 duration-200">
            {/* Call Header */}
            <div className="flex justify-between items-center p-5 bg-gradient-to-b from-black/40 to-transparent">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-orange-500/20 px-2 py-0.5 text-[9px] font-bold text-orange-400 uppercase tracking-wider">
                  Live Session
                </span>
                <span className="text-xs font-semibold text-slate-300">Mentor Call: Sarah Jenkins</span>
              </div>
              <div className="text-xs font-mono font-bold bg-black/30 px-3 py-1 rounded-full text-slate-200">
                {formatCallTime(callDuration)}
              </div>
            </div>

            {/* Mock Video Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-2">
              {/* Advisor Video Frame */}
              <div className="relative rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800">
                <div className="absolute top-3 left-3 bg-black/40 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-200 z-10">
                  Sarah Jenkins
                </div>
                <div className="text-center space-y-3">
                  <div className="relative h-20 w-20 mx-auto rounded-full overflow-hidden border-2 border-orange-500 animate-pulse">
                    <Image
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces"
                      alt="Sarah Jenkins"
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <p className="text-xs font-semibold text-slate-300">Sarah is speaking...</p>
                </div>
              </div>

              {/* Student Video Frame */}
              <div className="relative w-full h-full rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800">
                <div className="absolute top-3 left-3 bg-black/40 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-200 z-10">
                  {currentUser?.name || "Student"} (You)
                </div>
                
                {/* Live Video element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover absolute inset-0 ${cameraActive ? "block" : "hidden"}`}
                />

                {/* Camera off overlay placeholder */}
                {!cameraActive && (
                  <div className="text-center space-y-2 z-10">
                    <VideoOff className="h-8 w-8 text-slate-600 mx-auto" />
                    <p className="text-xs font-semibold text-slate-500">Camera is off</p>
                  </div>
                )}

                {!micActive && (
                  <div className="absolute top-3 right-3 bg-red-500/20 p-1.5 rounded-lg z-10">
                    <MicOff className="h-3.5 w-3.5 text-red-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Call Controls Footer */}
            <div className="flex items-center justify-center gap-4 p-6 bg-gradient-to-t from-black/40 to-transparent">
              <button
                onClick={() => setMicActive(!micActive)}
                className={`rounded-full p-3.5 transition-colors border ${
                  micActive
                    ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-white"
                    : "bg-red-500 hover:bg-red-600 border-red-500 text-white"
                }`}
                title={micActive ? "Mute Microphone" : "Unmute Microphone"}
              >
                {micActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setCameraActive(!cameraActive)}
                className={`rounded-full p-3.5 transition-colors border ${
                  cameraActive
                    ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-white"
                    : "bg-red-500 hover:bg-red-600 border-red-500 text-white"
                }`}
                title={cameraActive ? "Turn Camera Off" : "Turn Camera On"}
              >
                {cameraActive ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setShowCallModal(false)}
                className="rounded-full p-3.5 bg-red-600 hover:bg-red-700 border border-red-600 hover:scale-105 active:scale-95 transition-all text-white"
                title="End Session"
              >
                <PhoneOff className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
