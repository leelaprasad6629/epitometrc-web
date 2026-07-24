"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Phone, MapPin, Globe, Edit3, Save, X, Camera, Plus, Trash, Check, 
  Info, Sparkles, BookOpen, Briefcase, Award, Flame, 
  Target, FileText, Link2, Compass, GraduationCap, Trophy, Users, HeartHandshake, HelpCircle, Upload, Trash2
} from "lucide-react";
import { FaLinkedin, FaGithub, FaHackerrank } from "react-icons/fa";
import { SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { 
  useResumeStore, ParsedResume, EducationEntry, ExperienceEntry, ProjectEntry, 
  CertificationEntry, AchievementEntry, PublicationEntry, 
  WorkshopEntry, HackathonEntry, LeadershipEntry, VolunteerEntry 
} from "@/lib/ai/store/resumeStore";
import AIResumeMatchWidget from "@/components/ai/AIResumeMatchWidget";
import DashboardCard from "@/components/dashboard/DashboardCard";

const SKILLS_DICTIONARY = [
  "Frontend Development", "Frontend Architecture", "React", "React Native", "Redux", "TypeScript", "JavaScript",
  "HTML5", "CSS3", "Tailwind CSS", "Node.js", "Express.js", "Spring Boot", "Python", "PyTorch", "Django", "FastAPI",
  "AWS", "Supabase", "PostgreSQL", "MongoDB", "Redis", "Docker", "Kubernetes", "Git", "GitHub", "CI/CD", "Jest",
  "Cypress", "Selenium", "Flutter", "Postman", "Figma", "Linux", "DNS", "OAuth", "JWT", "Cyber Security"
];

const isValidUrl = (url: string) => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function StudentProfilePage() {
  const { 
    parsedResumeDetails, 
    updateParsedDetails, 
    loadProfileFromServer,
    verified,
    setVerified,
    confidenceScores,
    deleteResume,
    setResumeData
  } = useResumeStore();

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    bio: false,
    links: false,
    education: false,
    experience: false,
    projects: false,
    skills: false,
    academic: false,
  });

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    loadProfileFromServer();
  }, [loadProfileFromServer]);

  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  // File Input Ref for Re-uploading resume
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local Form state
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Links states
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolioWebsite, setPortfolioWebsite] = useState("");
  const [personalWebsite, setPersonalWebsite] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [hackerrank, setHackerrank] = useState("");
  const [codechef, setCodechef] = useState("");
  const [codeforces, setCodeforces] = useState("");
  const [kaggle, setKaggle] = useState("");
  const [medium, setMedium] = useState("");
  const [stackoverflow, setStackoverflow] = useState("");
  const [behance, setBehance] = useState("");
  const [dribbble, setDribbble] = useState("");

  // Lists States
  const [educationList, setEducationList] = useState<EducationEntry[]>([]);
  const [experienceList, setExperienceList] = useState<ExperienceEntry[]>([]);
  const [projectsList, setProjectsList] = useState<ProjectEntry[]>([]);
  const [certificationsList, setCertificationsList] = useState<CertificationEntry[]>([]);
  const [achievementsList, setAchievementsList] = useState<AchievementEntry[]>([]);

  // Extra activities states
  const [publicationsList, setPublicationsList] = useState<PublicationEntry[]>([]);
  const [workshopsList, setWorkshopsList] = useState<WorkshopEntry[]>([]);
  const [hackathonsList, setHackathonsList] = useState<HackathonEntry[]>([]);
  const [leadershipRolesList, setLeadershipRolesList] = useState<LeadershipEntry[]>([]);
  const [volunteerExperienceList, setVolunteerExperienceList] = useState<VolunteerEntry[]>([]);
  const [languagesKnownText, setLanguagesKnownText] = useState("");
  const [professionalInterestsText, setProfessionalInterestsText] = useState("");

  // Autocomplete states
  const [skillSearch, setSkillSearch] = useState("");
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Sync state values when parsed details change
  useEffect(() => {
    if (parsedResumeDetails) {
      setFullName(parsedResumeDetails.fullName || "");
      setHeadline(parsedResumeDetails.headline || "Apprentice Engineer");
      setBio(parsedResumeDetails.bio || "");
      setEmail(parsedResumeDetails.email || "");
      setPhone(parsedResumeDetails.phone || "");
      setLocation(parsedResumeDetails.location || "");
      setProfileImage(parsedResumeDetails.profileImage || null);

      setLinkedin(parsedResumeDetails.linkedin || "");
      setGithub(parsedResumeDetails.github || "");
      setPortfolioWebsite(parsedResumeDetails.portfolioWebsite || "");
      setPersonalWebsite(parsedResumeDetails.personalWebsite || "");
      setLeetcode(parsedResumeDetails.leetcode || "");
      setHackerrank(parsedResumeDetails.hackerrank || "");
      setCodechef(parsedResumeDetails.codechef || "");
      setCodeforces(parsedResumeDetails.codeforces || "");
      setKaggle(parsedResumeDetails.kaggle || "");
      setMedium(parsedResumeDetails.medium || "");
      setStackoverflow(parsedResumeDetails.stackoverflow || "");
      setBehance(parsedResumeDetails.behance || "");
      setDribbble(parsedResumeDetails.dribbble || "");

      setEducationList(parsedResumeDetails.education || []);
      setExperienceList(parsedResumeDetails.experience || []);
      setProjectsList(parsedResumeDetails.projects || []);
      setCertificationsList(parsedResumeDetails.certifications || []);
      setAchievementsList(parsedResumeDetails.achievements || []);

      setPublicationsList(parsedResumeDetails.publications || []);
      setWorkshopsList(parsedResumeDetails.workshops || []);
      setHackathonsList(parsedResumeDetails.hackathons || []);
      setLeadershipRolesList(parsedResumeDetails.leadershipRoles || []);
      setVolunteerExperienceList(parsedResumeDetails.volunteerExperience || []);
      setLanguagesKnownText((parsedResumeDetails.languagesKnown || []).join(", "));
      setProfessionalInterestsText((parsedResumeDetails.professionalInterests || []).join(", "));
    }
  }, [parsedResumeDetails]);

  // Image Upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setProfileImage(base64);
      updateParsedDetails({ profileImage: base64 });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    updateParsedDetails({ profileImage: null });
  };

  // Reupload & delete handlers
  const handleReuploadResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setSuccessMsg("Parsing new resume details...");
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result?.toString().split(",")[1] || "";
        const res = await fetch("/api/ai/parse-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileMimeType: file.type || "application/pdf",
            fileBase64: base64Data
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setResumeData(file.name, base64Data, file.type || "application/pdf", data.result, data.confidenceScores);
            setVerified(false); // Enter ReviewWizard!
            setSuccessMsg("Resume parsed successfully! Please review the fields.");
            setTimeout(() => setSuccessMsg(""), 3000);
          } else {
            alert(data.error || "Parsing failed.");
          }
        } else {
          alert(`Parsing service failed: ${res.status}`);
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert("Upload error: " + err.message);
      setUploading(false);
    }
  };

  const handleDeleteResume = () => {
    if (confirm("Are you sure you want to delete your resume details and reset your profile?")) {
      deleteResume();
      setSuccessMsg("Resume details deleted.");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  // Section Add / Remove handlers
  const addEdu = () => {
    setEducationList(prev => [...prev, { degree: "", branch: "", institution: "", university: "", startYear: "", endYear: "", cgpa: "" }]);
  };
  const removeEdu = (idx: number) => {
    setEducationList(prev => prev.filter((_, i) => i !== idx));
  };
  const updateEdu = (idx: number, field: keyof EducationEntry, val: string) => {
    setEducationList(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const addExp = () => {
    setExperienceList(prev => [...prev, { companyName: "", role: "", employmentType: "Full-Time", startDate: "", endDate: "", duration: "", responsibilities: "" }]);
  };
  const removeExp = (idx: number) => {
    setExperienceList(prev => prev.filter((_, i) => i !== idx));
  };
  const updateExp = (idx: number, field: keyof ExperienceEntry, val: string) => {
    setExperienceList(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const addProj = () => {
    setProjectsList(prev => [...prev, { projectTitle: "", description: "", technologiesUsed: [], githubLink: "", liveUrl: "", duration: "" }]);
  };
  const removeProj = (idx: number) => {
    setProjectsList(prev => prev.filter((_, i) => i !== idx));
  };
  const updateProj = (idx: number, field: keyof ProjectEntry, val: string) => {
    setProjectsList(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const addCert = () => {
    setCertificationsList(prev => [...prev, { certificationName: "", organization: "", date: "", credentialId: "" }]);
  };
  const removeCert = (idx: number) => {
    setCertificationsList(prev => prev.filter((_, i) => i !== idx));
  };
  const updateCert = (idx: number, field: keyof CertificationEntry, val: string) => {
    setCertificationsList(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const addAch = () => {
    setAchievementsList(prev => [...prev, { title: "", description: "" }]);
  };
  const removeAch = (idx: number) => {
    setAchievementsList(prev => prev.filter((_, i) => i !== idx));
  };
  const updateAch = (idx: number, field: keyof AchievementEntry, val: string) => {
    setAchievementsList(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const addPub = () => {
    setPublicationsList(prev => [...prev, { title: "", publisher: "", date: "", url: "" }]);
  };
  const removePub = (idx: number) => {
    setPublicationsList(prev => prev.filter((_, i) => i !== idx));
  };
  const updatePub = (idx: number, field: keyof PublicationEntry, val: string) => {
    setPublicationsList(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const addWorkshop = () => {
    setWorkshopsList(prev => [...prev, { name: "", organizer: "", date: "" }]);
  };
  const removeWorkshop = (idx: number) => {
    setWorkshopsList(prev => prev.filter((_, i) => i !== idx));
  };
  const updateWorkshop = (idx: number, field: keyof WorkshopEntry, val: string) => {
    setWorkshopsList(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const addHack = () => {
    setHackathonsList(prev => [...prev, { name: "", role: "", date: "", prize: "" }]);
  };
  const removeHack = (idx: number) => {
    setHackathonsList(prev => prev.filter((_, i) => i !== idx));
  };
  const updateHack = (idx: number, field: keyof HackathonEntry, val: string) => {
    setHackathonsList(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const addLeader = () => {
    setLeadershipRolesList(prev => [...prev, { role: "", organization: "", duration: "" }]);
  };
  const removeLeader = (idx: number) => {
    setLeadershipRolesList(prev => prev.filter((_, i) => i !== idx));
  };
  const updateLeader = (idx: number, field: keyof LeadershipEntry, val: string) => {
    setLeadershipRolesList(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const addVolunteer = () => {
    setVolunteerExperienceList(prev => [...prev, { role: "", organization: "", description: "" }]);
  };
  const removeVolunteer = (idx: number) => {
    setVolunteerExperienceList(prev => prev.filter((_, i) => i !== idx));
  };
  const updateVolunteer = (idx: number, field: keyof VolunteerEntry, val: string) => {
    setVolunteerExperienceList(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  // Skill search suggestions
  const handleSkillSearch = (text: string) => {
    setSkillSearch(text);
    if (!text.trim()) {
      setSkillSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filtered = SKILLS_DICTIONARY.filter(
      s => s.toLowerCase().includes(text.toLowerCase()) && 
      !(parsedResumeDetails?.verifiedSkills || []).includes(s)
    );
    setSkillSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleAddSkill = (skill: string) => {
    const current = parsedResumeDetails?.verifiedSkills || [];
    if (!current.includes(skill)) {
      updateParsedDetails({ verifiedSkills: [...current, skill] });
    }
    setSkillSearch("");
    setShowSuggestions(false);
  };

  const handleRemoveSkill = (skill: string) => {
    const current = parsedResumeDetails?.verifiedSkills || [];
    updateParsedDetails({ verifiedSkills: current.filter(s => s !== skill) });
  };

  // Save changes to database
  const handleSaveProfile = async () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required.";
    if (linkedin && !isValidUrl(linkedin)) newErrors.linkedin = "Invalid LinkedIn URL.";
    if (github && !isValidUrl(github)) newErrors.github = "Invalid GitHub URL.";
    if (portfolioWebsite && !isValidUrl(portfolioWebsite)) newErrors.portfolioWebsite = "Invalid Portfolio URL.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const langs = languagesKnownText.split(",").map(s => s.trim()).filter(Boolean);
    const interests = professionalInterestsText.split(",").map(s => s.trim()).filter(Boolean);

    await updateParsedDetails({
      fullName,
      headline,
      bio,
      email,
      phone,
      location,
      linkedin,
      github,
      portfolioWebsite,
      personalWebsite,
      leetcode,
      hackerrank,
      codechef,
      codeforces,
      kaggle,
      medium,
      stackoverflow,
      behance,
      dribbble,
      education: educationList,
      experience: experienceList,
      projects: projectsList,
      certifications: certificationsList,
      achievements: achievementsList,
      publications: publicationsList,
      workshops: workshopsList,
      hackathons: hackathonsList,
      leadershipRoles: leadershipRolesList,
      volunteerExperience: volunteerExperienceList,
      languagesKnown: langs,
      professionalInterests: interests
    });

    setErrors({});
    setIsEditing(false);
    setSuccessMsg("Profile saved successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleCancelEdit = () => {
    if (parsedResumeDetails) {
      setFullName(parsedResumeDetails.fullName || "");
      setHeadline(parsedResumeDetails.headline || "Apprentice Engineer");
      setBio(parsedResumeDetails.bio || "");
      setEmail(parsedResumeDetails.email || "");
      setPhone(parsedResumeDetails.phone || "");
      setLocation(parsedResumeDetails.location || "");
      setProfileImage(parsedResumeDetails.profileImage || null);
      
      setLinkedin(parsedResumeDetails.linkedin || "");
      setGithub(parsedResumeDetails.github || "");
      setPortfolioWebsite(parsedResumeDetails.portfolioWebsite || "");
      setPersonalWebsite(parsedResumeDetails.personalWebsite || "");
      setLeetcode(parsedResumeDetails.leetcode || "");
      setHackerrank(parsedResumeDetails.hackerrank || "");
      setCodechef(parsedResumeDetails.codechef || "");
      setCodeforces(parsedResumeDetails.codeforces || "");
      setKaggle(parsedResumeDetails.kaggle || "");
      setMedium(parsedResumeDetails.medium || "");
      setStackoverflow(parsedResumeDetails.stackoverflow || "");
      setBehance(parsedResumeDetails.behance || "");
      setDribbble(parsedResumeDetails.dribbble || "");

      setEducationList(parsedResumeDetails.education || []);
      setExperienceList(parsedResumeDetails.experience || []);
      setProjectsList(parsedResumeDetails.projects || []);
      setCertificationsList(parsedResumeDetails.certifications || []);
      setAchievementsList(parsedResumeDetails.achievements || []);

      setPublicationsList(parsedResumeDetails.publications || []);
      setWorkshopsList(parsedResumeDetails.workshops || []);
      setHackathonsList(parsedResumeDetails.hackathons || []);
      setLeadershipRolesList(parsedResumeDetails.leadershipRoles || []);
      setVolunteerExperienceList(parsedResumeDetails.volunteerExperience || []);
      setLanguagesKnownText((parsedResumeDetails.languagesKnown || []).join(", "));
      setProfessionalInterestsText((parsedResumeDetails.professionalInterests || []).join(", "));
    }
    setErrors({});
    setIsEditing(false);
  };

  // Helpers
  const activeAvatar = profileImage || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=faces";
  const displayHeadline = headline || "Software Engineering Apprentice";
  const verifiedSkillsList = parsedResumeDetails?.verifiedSkills || [];
  const overallCompleteness = parsedResumeDetails?.overallCompleteness || 0;
  const metrics = parsedResumeDetails?.completenessMetrics || {};

  // Check which sections have parsed data to render them dynamically
  const hasBio = !!bio;
  const hasLinks = [linkedin, github, portfolioWebsite, personalWebsite, leetcode, hackerrank, codechef, codeforces, kaggle].some(Boolean);
  const hasEducation = educationList.length > 0;
  const hasExperience = experienceList.length > 0;
  const hasProjects = projectsList.length > 0;
  const hasSkills = verifiedSkillsList.length > 0 || (parsedResumeDetails?.technicalSkills && parsedResumeDetails.technicalSkills.length > 0);
  const hasCertsAwards = certificationsList.length > 0 || achievementsList.length > 0;
  const hasAcademicExtra = [publicationsList, workshopsList, hackathonsList, leadershipRolesList, volunteerExperienceList].some(l => l.length > 0);

  return (
    <div className="relative min-h-screen bg-slate-50/30 overflow-hidden py-8 px-4 sm:px-6 lg:px-8 text-left text-slate-700 font-sans text-xs">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-radial from-blue-300/10 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-radial from-purple-300/10 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-radial from-orange-200/5 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* 1. Header Banner Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs bg-gradient-to-r from-blue-50/20 via-purple-50/10 to-cyan-50/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col sm:flex-row gap-5 items-center text-center sm:text-left w-full md:w-auto">
            {/* Avatar upload */}
            <div className="relative h-24 w-24 rounded-2xl border border-slate-200 overflow-hidden group shrink-0 bg-slate-50 shadow-inner">
              <Image
                src={activeAvatar}
                alt={fullName || "User Avatar"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="96px"
              />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer">
                <label className="cursor-pointer text-white flex flex-col items-center">
                  <Camera className="h-4 w-4" />
                  <span className="text-[7px] font-bold uppercase mt-0.5">Upload</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {profileImage && (
                  <button onClick={handleRemoveImage} className="text-red-400 hover:text-red-300">
                    <Trash className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2 flex-1 w-full">
              {isEditing ? (
                <div className="space-y-2 max-w-md">
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="h-8.5 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-slate-800"
                  />
                  {errors.fullName && <p className="text-[9px] text-red-500 font-semibold">{errors.fullName}</p>}
                  <Input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Headline (e.g. Frontend Specialist)"
                    className="h-8 text-xs text-slate-600"
                  />
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="font-display font-black text-slate-800 text-lg">{fullName || "Engineering Apprentice"}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-xs">
                      Candidate Profile
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs font-medium">{displayHeadline}</p>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center w-full md:w-auto justify-end">
            {verified && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-655 font-bold transition-all shadow-xs"
                >
                  <Upload className="h-3.5 w-3.5" /> Re-upload Resume
                  <input type="file" ref={fileInputRef} accept=".pdf,.docx,.doc,.txt" onChange={handleReuploadResume} className="hidden" />
                </button>
                <button
                  onClick={handleDeleteResume}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-250 bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 transition-all shadow-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete Profile
                </button>
              </>
            )}

            {isEditing ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-605 font-bold transition-all shadow-xs"
                >
                  <X className="h-3.5 w-3.5" /> Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-sm"
                >
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-white font-bold transition-all shadow-sm"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {successMsg}
          </motion.div>
        )}

        {/* 2. Resume-First Mode Splits */}
        {!verified ? (
          /* Resume Upload Focused workspace initially */
          <div className="max-w-3xl mx-auto py-8">
            <AIResumeMatchWidget />
          </div>
        ) : (
          /* Dynamic AI workspace showing only non-empty parsed sections in a FULL-WIDTH visual layout stack */
          <div className="space-y-6 w-full">
            
            {/* Profile Health Completeness Gauge (Summary on top) */}
            <DashboardCard glowColor="indigo" className="text-left flex items-center justify-between gap-4 w-full">
              <div className="space-y-1.5 flex-1 font-sans">
                <h3 className="font-display text-[10.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-cyan-600 animate-pulse" /> Profile Health Strength
                </h3>
                <div>
                  <span className="text-2xl font-black text-slate-900 font-mono">{overallCompleteness}%</span>
                  <p className="text-[9.5px] text-slate-400 mt-0.5">Calculated ATS readiness metric</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-1 pt-1 text-[9px] text-slate-500 font-semibold">
                  {Object.keys(metrics).map((key) => (
                    <div key={key} className="flex justify-between items-center pr-3 border-r border-slate-100 last:border-0">
                      <span className="capitalize">{key}</span>
                      <span className="font-bold text-slate-800">{metrics[key]}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative h-16 w-16 flex items-center justify-center shrink-0 ml-3">
                <svg className="h-full w-full -rotate-90">
                  <circle cx="32" cy="32" r="26" className="stroke-slate-50 fill-transparent stroke-[4px]" />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="fill-transparent stroke-[4px] stroke-slate-900 transition-all duration-700"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 - (overallCompleteness / 100) * (2 * Math.PI * 26)}
                  />
                </svg>
                <span className="absolute text-[10px] font-black text-slate-950 font-mono">{overallCompleteness}%</span>
              </div>
            </DashboardCard>

            {/* Career Profile Summary Card */}
            {hasBio && (
              <DashboardCard glowColor="blue" className="space-y-4 w-full">
                <div 
                  onClick={() => toggleSection("bio")}
                  className="flex justify-between items-center cursor-pointer select-none"
                >
                  <h3 className="font-display text-[10.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-cyan-600" /> Career Profile Summary
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {collapsedSections.bio ? "[ Show ]" : "[ Hide ]"}
                  </span>
                </div>
                {!collapsedSections.bio && (
                  <div className="pt-4 border-t border-slate-50">
                    {isEditing ? (
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs focus:outline-none focus:border-slate-800 h-24 resize-none bg-white font-medium"
                      />
                    ) : (
                      <p className="text-slate-600 leading-relaxed text-xs italic font-medium">
                        "{bio}"
                      </p>
                    )}
                  </div>
                )}
              </DashboardCard>
            )}

            {/* Social Links Card */}
            {hasLinks && (
              <DashboardCard glowColor="indigo" className="space-y-4 w-full">
                <div 
                  onClick={() => toggleSection("links")}
                  className="flex justify-between items-center cursor-pointer select-none"
                >
                  <h3 className="font-display text-[10.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Link2 className="h-4 w-4 text-cyan-600" /> Social & Professional Networks
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {collapsedSections.links ? "[ Show ]" : "[ Hide ]"}
                  </span>
                </div>
                {!collapsedSections.links && (
                  <div className="pt-4 border-t border-slate-50">
                    {isEditing ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><FaLinkedin /> LinkedIn</span>
                          <Input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="h-7 text-[10px]" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><FaGithub /> GitHub</span>
                          <Input type="text" value={github} onChange={(e) => setGithub(e.target.value)} className="h-7 text-[10px]" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><Globe className="h-3 w-3" /> Portfolio</span>
                          <Input type="text" value={portfolioWebsite} onChange={(e) => setPortfolioWebsite(e.target.value)} className="h-7 text-[10px]" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2.5">
                        {[
                          { name: "LinkedIn", url: linkedin, icon: <FaLinkedin className="h-4 w-4 text-blue-600" /> },
                          { name: "GitHub", url: github, icon: <FaGithub className="h-4 w-4 text-slate-800" /> },
                          { name: "Portfolio", url: portfolioWebsite, icon: <Globe className="h-4 w-4 text-cyan-600" /> },
                          { name: "LeetCode", url: leetcode, icon: <SiLeetcode className="h-4 w-4 text-orange-500" /> },
                          { name: "HackerRank", url: hackerrank, icon: <FaHackerrank className="h-4 w-4 text-green-500" /> }
                        ].map((item) => {
                          if (!item.url) return null;
                          return (
                            <a
                              key={item.name}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-all font-semibold text-slate-800 text-[10.5px]"
                            >
                              {item.icon}
                              <span>{item.name}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </DashboardCard>
            )}

            {/* Skills Tag Cloud */}
            {hasSkills && (
              <DashboardCard glowColor="blue" className="space-y-4 w-full">
                <h3 className="font-display text-[10.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-cyan-600" /> Verified Skills Inventory
                </h3>
                <div className="pt-2 border-t border-slate-50 space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {verifiedSkillsList.map((skill) => (
                      <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-600 text-[10.5px] font-semibold">
                        {skill}
                        {isEditing && (
                          <button onClick={() => handleRemoveSkill(skill)} className="text-red-500 hover:text-red-600 ml-1"><X className="h-3 w-3" /></button>
                        )}
                      </span>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="relative space-y-1.5 max-w-md">
                      <Input
                        placeholder="Search and add skills..."
                        value={skillSearch}
                        onChange={(e) => handleSkillSearch(e.target.value)}
                        className="h-8 text-[10.5px]"
                      />
                      {showSuggestions && skillSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl mt-1 shadow-lg z-30 max-h-36 overflow-y-auto divide-y divide-slate-50">
                          {skillSuggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => handleAddSkill(suggestion)}
                              className="w-full px-3 py-2 text-left hover:bg-slate-50 text-slate-700 font-semibold text-[10px]"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </DashboardCard>
            )}

            {/* Education & Experience Timelines */}
            {(hasEducation || hasExperience) && (
              <DashboardCard glowColor="purple" className="space-y-4 w-full">
                <div 
                  onClick={() => toggleSection("education")}
                  className="flex justify-between items-center cursor-pointer select-none"
                >
                  <h3 className="font-display text-[10.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-cyan-600" /> Education & Work Timelines
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {collapsedSections.education ? "[ Show ]" : "[ Hide ]"}
                  </span>
                </div>
                {!collapsedSections.education && (
                  <div className="pt-4 border-t border-slate-50 space-y-6">
                    
                    {/* Education Entries */}
                    {hasEducation && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                          <h4 className="font-bold text-slate-500 text-[9.5px] uppercase">Education History</h4>
                          {isEditing && (
                            <button onClick={addEdu} className="text-slate-800 hover:text-slate-900 font-bold flex items-center gap-0.5 text-[10px] bg-slate-50 border border-slate-150 px-2 py-1 rounded-xl">
                              <Plus className="h-3.5 w-3.5" /> Add
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          {educationList.map((item, idx) => (
                            <div key={idx} className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl relative">
                              {isEditing ? (
                                <div className="grid grid-cols-2 gap-3 pr-6">
                                  <button onClick={() => removeEdu(idx)} className="absolute top-2 right-2 text-red-500"><Trash className="h-3.5 w-3.5" /></button>
                                  <Input placeholder="Degree" value={item.degree} onChange={(e) => updateEdu(idx, "degree", e.target.value)} className="h-7 text-[10px]" />
                                  <Input placeholder="Branch" value={item.branch} onChange={(e) => updateEdu(idx, "branch", e.target.value)} className="h-7 text-[10px]" />
                                  <Input placeholder="Institution" value={item.institution} onChange={(e) => updateEdu(idx, "institution", e.target.value)} className="h-7 text-[10px]" />
                                  <Input placeholder="CGPA" value={item.cgpa} onChange={(e) => updateEdu(idx, "cgpa", e.target.value)} className="h-7 text-[10px]" />
                                </div>
                              ) : (
                                <div>
                                  <h5 className="font-bold text-slate-800 text-[11px]">{item.degree} in {item.branch}</h5>
                                  <p className="text-slate-450 font-semibold mt-0.5">{item.institution} • {item.startYear} - {item.endYear}</p>
                                  {item.cgpa && <span className="inline-block mt-1.5 px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 font-black text-[9px] uppercase font-mono">CGPA: {item.cgpa}</span>}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience Entries */}
                    {hasExperience && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                          <h4 className="font-bold text-slate-500 text-[9.5px] uppercase">Work Experience</h4>
                          {isEditing && (
                            <button onClick={addExp} className="text-slate-800 hover:text-slate-900 font-bold flex items-center gap-0.5 text-[10px] bg-slate-50 border border-slate-150 px-2 py-1 rounded-xl">
                              <Plus className="h-3.5 w-3.5" /> Add
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          {experienceList.map((item, idx) => (
                            <div key={idx} className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl relative">
                              {isEditing ? (
                                <div className="space-y-2 pr-6">
                                  <button onClick={() => removeExp(idx)} className="absolute top-2 right-2 text-red-500"><Trash className="h-3.5 w-3.5" /></button>
                                  <div className="grid grid-cols-2 gap-3">
                                    <Input placeholder="Company" value={item.companyName} onChange={(e) => updateExp(idx, "companyName", e.target.value)} className="h-7 text-[10px]" />
                                    <Input placeholder="Role" value={item.role} onChange={(e) => updateExp(idx, "role", e.target.value)} className="h-7 text-[10px]" />
                                  </div>
                                  <textarea placeholder="Responsibilities" value={item.responsibilities} onChange={(e) => updateExp(idx, "responsibilities", e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-[10px] h-14 bg-white" />
                                </div>
                              ) : (
                                <div>
                                  <h5 className="font-bold text-slate-800 text-[11px]">{item.role}</h5>
                                  <p className="text-slate-450 font-semibold mt-0.5">{item.companyName} • {item.startDate} - {item.endDate}</p>
                                  {item.responsibilities && <p className="text-[10px] text-slate-500 leading-relaxed mt-2 pl-2 border-l-2 border-slate-200">{item.responsibilities}</p>}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </DashboardCard>
            )}

            {/* Projects Portfolio */}
            {hasProjects && (
              <DashboardCard glowColor="orange" className="space-y-4 w-full">
                <div 
                  onClick={() => toggleSection("projects")}
                  className="flex justify-between items-center cursor-pointer select-none"
                >
                  <h3 className="font-display text-[10.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="h-4 w-4 text-cyan-600" /> Projects Portfolio
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {collapsedSections.projects ? "[ Show ]" : "[ Hide ]"}
                  </span>
                </div>
                {!collapsedSections.projects && (
                  <div className="pt-4 border-t border-slate-50 space-y-4">
                    {isEditing && (
                      <div className="flex justify-end pb-1 border-b border-slate-50">
                        <button onClick={addProj} className="text-slate-800 hover:text-slate-900 font-bold flex items-center gap-0.5 text-[10px] bg-slate-50 border border-slate-150 px-2 py-1 rounded-xl">
                          <Plus className="h-3.5 w-3.5" /> Add Project
                        </button>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {projectsList.map((item, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl relative flex flex-col justify-between">
                          {isEditing ? (
                            <div className="space-y-2 pr-6">
                              <button onClick={() => removeProj(idx)} className="absolute top-2 right-2 text-red-500"><Trash className="h-3.5 w-3.5" /></button>
                              <Input placeholder="Project Title" value={item.projectTitle} onChange={(e) => updateProj(idx, "projectTitle", e.target.value)} className="h-7 text-[10px]" />
                              <textarea placeholder="Description" value={item.description} onChange={(e) => updateProj(idx, "description", e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-[10px] h-14 bg-white" />
                            </div>
                          ) : (
                            <div>
                              <h5 className="font-bold text-slate-800 text-[11px]">{item.projectTitle}</h5>
                              <p className="text-[10px] text-slate-500 leading-relaxed mt-1">{item.description}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </DashboardCard>
            )}

            {/* Certifications & Achievements Card */}
            {hasCertsAwards && (
              <DashboardCard glowColor="purple" className="space-y-4 w-full">
                <h3 className="font-display text-[10.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-cyan-600" /> Certifications & Achievements
                </h3>
                <div className="pt-4 border-t border-slate-50 space-y-4">
                  {certificationsList.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase block tracking-wider">Certifications</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {certificationsList.map((item, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl text-[10px]">
                            <h5 className="font-bold text-slate-800">{item.certificationName}</h5>
                            <p className="text-slate-450 font-semibold">{item.organization}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {achievementsList.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase block tracking-wider">Achievements</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {achievementsList.map((item, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl text-[10px]">
                            <h5 className="font-bold text-slate-800">{item.title}</h5>
                            <p className="text-slate-500 mt-0.5">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DashboardCard>
            )}

            {/* Academic & Extra Activities Card */}
            {hasAcademicExtra && (
              <DashboardCard glowColor="indigo" className="space-y-4 w-full">
                <div 
                  onClick={() => toggleSection("academic")}
                  className="flex justify-between items-center cursor-pointer select-none"
                >
                  <h3 className="font-display text-[10.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-cyan-600" /> Academic & Extra Activities
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {collapsedSections.academic ? "[ Show ]" : "[ Hide ]"}
                  </span>
                </div>
                {!collapsedSections.academic && (
                  <div className="pt-4 border-t border-slate-50 space-y-4">
                    
                    {publicationsList.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-400 text-[9px] uppercase">Publications</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {publicationsList.map((item, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                              <h5 className="font-bold text-slate-700">{item.title}</h5>
                              <p className="text-slate-400 mt-0.5">{item.publisher} • {item.date}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {workshopsList.length > 0 && (
                      <div className="space-y-1.5 border-t border-slate-50 pt-3">
                        <span className="font-bold text-slate-400 text-[9px] uppercase">Workshops</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {workshopsList.map((item, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                              <h5 className="font-bold text-slate-700">{item.name}</h5>
                              <p className="text-slate-400 mt-0.5">{item.organizer} • {item.date}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {hackathonsList.length > 0 && (
                      <div className="space-y-1.5 border-t border-slate-50 pt-3">
                        <span className="font-bold text-slate-400 text-[9px] uppercase">Hackathons</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {hackathonsList.map((item, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                              <h5 className="font-bold text-slate-700">{item.name}</h5>
                              <p className="text-slate-400 mt-0.5">{item.role} • {item.date} {item.prize && `• Prize: ${item.prize}`}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </DashboardCard>
            )}

            {/* Dynamic Job Matching & Analysis widget (Takes full screen width at the bottom) */}
            <div className="w-full">
              <AIResumeMatchWidget />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
