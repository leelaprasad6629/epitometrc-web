"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Phone, MapPin, Globe, Edit3, Save, X, Camera, Plus, Trash, Check, 
  Info, Sparkles, BookOpen, Briefcase, Award, CheckCircle, Flame, 
  Target, FileText, Link2, Compass
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
    fileName,
    deleteResume,
    setResumeData,
    confidenceScores
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

  // Local Form state
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // 13 Professional Links states
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

  // Structured Lists States
  const [educationList, setEducationList] = useState<EducationEntry[]>([]);
  const [experienceList, setExperienceList] = useState<ExperienceEntry[]>([]);
  const [projectsList, setProjectsList] = useState<ProjectEntry[]>([]);
  const [certificationsList, setCertificationsList] = useState<CertificationEntry[]>([]);
  const [achievementsList, setAchievementsList] = useState<AchievementEntry[]>([]);

  // Academic & Extra-curricular States
  const [publicationsList, setPublicationsList] = useState<PublicationEntry[]>([]);
  const [workshopsList, setWorkshopsList] = useState<WorkshopEntry[]>([]);
  const [hackathonsList, setHackathonsList] = useState<HackathonEntry[]>([]);
  const [leadershipRolesList, setLeadershipRolesList] = useState<LeadershipEntry[]>([]);
  const [volunteerExperienceList, setVolunteerExperienceList] = useState<VolunteerEntry[]>([]);
  const [languagesKnownText, setLanguagesKnownText] = useState("");
  const [professionalInterestsText, setProfessionalInterestsText] = useState("");

  // Skills Autocomplete states
  const [skillSearch, setSkillSearch] = useState("");
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Initialize local states from store
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

  // Check for unsaved changes
  const hasChanges = parsedResumeDetails ? (
    fullName !== (parsedResumeDetails.fullName || "") ||
    headline !== (parsedResumeDetails.headline || "") ||
    bio !== (parsedResumeDetails.bio || "") ||
    email !== (parsedResumeDetails.email || "") ||
    phone !== (parsedResumeDetails.phone || "") ||
    location !== (parsedResumeDetails.location || "") ||
    profileImage !== (parsedResumeDetails.profileImage || null) ||
    linkedin !== (parsedResumeDetails.linkedin || "") ||
    github !== (parsedResumeDetails.github || "") ||
    portfolioWebsite !== (parsedResumeDetails.portfolioWebsite || "") ||
    personalWebsite !== (parsedResumeDetails.personalWebsite || "") ||
    leetcode !== (parsedResumeDetails.leetcode || "") ||
    hackerrank !== (parsedResumeDetails.hackerrank || "") ||
    codechef !== (parsedResumeDetails.codechef || "") ||
    codeforces !== (parsedResumeDetails.codeforces || "") ||
    kaggle !== (parsedResumeDetails.kaggle || "") ||
    medium !== (parsedResumeDetails.medium || "") ||
    stackoverflow !== (parsedResumeDetails.stackoverflow || "") ||
    behance !== (parsedResumeDetails.behance || "") ||
    dribbble !== (parsedResumeDetails.dribbble || "") ||
    JSON.stringify(educationList) !== JSON.stringify(parsedResumeDetails.education || []) ||
    JSON.stringify(experienceList) !== JSON.stringify(parsedResumeDetails.experience || []) ||
    JSON.stringify(projectsList) !== JSON.stringify(parsedResumeDetails.projects || []) ||
    JSON.stringify(certificationsList) !== JSON.stringify(parsedResumeDetails.certifications || []) ||
    JSON.stringify(achievementsList) !== JSON.stringify(parsedResumeDetails.achievements || []) ||
    JSON.stringify(publicationsList) !== JSON.stringify(parsedResumeDetails.publications || []) ||
    JSON.stringify(workshopsList) !== JSON.stringify(parsedResumeDetails.workshops || []) ||
    JSON.stringify(hackathonsList) !== JSON.stringify(parsedResumeDetails.hackathons || []) ||
    JSON.stringify(leadershipRolesList) !== JSON.stringify(parsedResumeDetails.leadershipRoles || []) ||
    JSON.stringify(volunteerExperienceList) !== JSON.stringify(parsedResumeDetails.volunteerExperience || []) ||
    languagesKnownText !== (parsedResumeDetails.languagesKnown || []).join(", ") ||
    professionalInterestsText !== (parsedResumeDetails.professionalInterests || []).join(", ")
  ) : false;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved edits. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  // Skills Autocomplete Logic
  useEffect(() => {
    if (skillSearch.trim().length > 0) {
      const filtered = SKILLS_DICTIONARY.filter(s =>
        s.toLowerCase().includes(skillSearch.toLowerCase()) &&
        !(parsedResumeDetails?.verifiedSkills || []).includes(s)
      );
      setSkillSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSkillSuggestions([]);
      setShowSuggestions(false);
    }
  }, [skillSearch, parsedResumeDetails]);

  const handleAddSkill = (skillName: string) => {
    const currentSkills = parsedResumeDetails?.technicalSkills || [];
    if (!currentSkills.includes(skillName)) {
      const updated = [...currentSkills, skillName];
      updateParsedDetails({ 
        technicalSkills: updated,
        verifiedSkills: updated
      });
      setSuccessMsg(`Skill "${skillName}" added!`);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
    setSkillSearch("");
    setShowSuggestions(false);
  };

  const handleRemoveSkill = (skillName: string) => {
    const currentSkills = parsedResumeDetails?.technicalSkills || [];
    const updated = currentSkills.filter(s => s !== skillName);
    updateParsedDetails({
      technicalSkills: updated,
      verifiedSkills: updated
    });
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillSearch.trim().length > 0) {
      handleAddSkill(skillSearch.trim());
    }
  };

  // Image Upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        updateParsedDetails({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    updateParsedDetails({ profileImage: null });
  };

  // CRUD helpers for sub-arrays
  const addEdu = () => setEducationList([...educationList, { degree: "", branch: "", institution: "", university: "", startYear: "", endYear: "", cgpa: "" }]);
  const removeEdu = (idx: number) => setEducationList(educationList.filter((_, i) => i !== idx));
  const updateEdu = (idx: number, key: keyof EducationEntry, val: string) => setEducationList(educationList.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  const addExp = () => setExperienceList([...experienceList, { companyName: "", role: "", employmentType: "Full-time", startDate: "", endDate: "", duration: "", responsibilities: "", technologiesUsed: [], achievements: [] }]);
  const removeExp = (idx: number) => setExperienceList(experienceList.filter((_, i) => i !== idx));
  const updateExp = (idx: number, key: keyof ExperienceEntry, val: any) => setExperienceList(experienceList.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  const addProj = () => setProjectsList([...projectsList, { projectTitle: "", description: "", technologiesUsed: [], githubLink: "", liveUrl: "", duration: "", teamSize: "", contributions: "", outcomes: "" }]);
  const removeProj = (idx: number) => setProjectsList(projectsList.filter((_, i) => i !== idx));
  const updateProj = (idx: number, key: keyof ProjectEntry, val: any) => setProjectsList(projectsList.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  const addCert = () => setCertificationsList([...certificationsList, { certificationName: "", organization: "", date: "", credentialId: "" }]);
  const removeCert = (idx: number) => setCertificationsList(certificationsList.filter((_, i) => i !== idx));
  const updateCert = (idx: number, key: keyof CertificationEntry, val: string) => setCertificationsList(certificationsList.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  const addAchievement = () => setAchievementsList([...achievementsList, { title: "", description: "" }]);
  const removeAchievement = (idx: number) => setAchievementsList(achievementsList.filter((_, i) => i !== idx));
  const updateAchievement = (idx: number, key: keyof AchievementEntry, val: string) => setAchievementsList(achievementsList.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  const addPub = () => setPublicationsList([...publicationsList, { title: "", publisher: "", date: "", url: "" }]);
  const removePub = (idx: number) => setPublicationsList(publicationsList.filter((_, i) => i !== idx));
  const updatePub = (idx: number, key: keyof PublicationEntry, val: string) => setPublicationsList(publicationsList.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  const addWorkshop = () => setWorkshopsList([...workshopsList, { name: "", organizer: "", date: "" }]);
  const removeWorkshop = (idx: number) => setWorkshopsList(workshopsList.filter((_, i) => i !== idx));
  const updateWorkshop = (idx: number, key: keyof WorkshopEntry, val: string) => setWorkshopsList(workshopsList.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  const addHack = () => setHackathonsList([...hackathonsList, { name: "", role: "", date: "", prize: "" }]);
  const removeHack = (idx: number) => setHackathonsList(hackathonsList.filter((_, i) => i !== idx));
  const updateHack = (idx: number, key: keyof HackathonEntry, val: string) => setHackathonsList(hackathonsList.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  const addLeader = () => setLeadershipRolesList([...leadershipRolesList, { role: "", organization: "", duration: "" }]);
  const removeLeader = (idx: number) => setLeadershipRolesList(leadershipRolesList.filter((_, i) => i !== idx));
  const updateLeader = (idx: number, key: keyof LeadershipEntry, val: string) => setLeadershipRolesList(leadershipRolesList.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  const addVolunteer = () => setVolunteerExperienceList([...volunteerExperienceList, { role: "", organization: "", description: "" }]);
  const removeVolunteer = (idx: number) => setVolunteerExperienceList(volunteerExperienceList.filter((_, i) => i !== idx));
  const updateVolunteer = (idx: number, key: keyof VolunteerEntry, val: string) => setVolunteerExperienceList(volunteerExperienceList.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  // Save profile updates
  const handleSaveProfile = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";

    const urlFields = [
      { name: "linkedin", value: linkedin },
      { name: "github", value: github },
      { name: "portfolioWebsite", value: portfolioWebsite },
      { name: "personalWebsite", value: personalWebsite },
      { name: "leetcode", value: leetcode },
      { name: "hackerrank", value: hackerrank },
      { name: "kaggle", value: kaggle },
      { name: "medium", value: medium },
      { name: "stackoverflow", value: stackoverflow },
      { name: "behance", value: behance },
      { name: "dribbble", value: dribbble }
    ];

    urlFields.forEach(f => {
      if (f.value && !isValidUrl(f.value)) {
        newErrors[f.name] = "Please enter a valid URL (e.g. https://...).";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const langs = languagesKnownText.split(",").map(s => s.trim()).filter(Boolean);
    const interests = professionalInterestsText.split(",").map(s => s.trim()).filter(Boolean);

    updateParsedDetails({
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
    setSuccessMsg("Profile database saved successfully!");
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

  // Helper values
  const activeAvatar = profileImage || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=faces";
  const displayHeadline = headline || "Software Engineering Apprentice";
  const verifiedSkillsList = parsedResumeDetails?.verifiedSkills || [];
  const domainLabel = parsedResumeDetails?.careerDomain || "Full Stack Development";
  const semanticSummary = parsedResumeDetails?.candidateProfile || "A passionate engineering apprentice focused on building verified digital tools.";

  const overallCompleteness = parsedResumeDetails?.overallCompleteness || 0;
  const metrics = parsedResumeDetails?.completenessMetrics || {};

  // Suggestions helper logic
  const missingSuggestions: string[] = [];
  if (!linkedin) missingSuggestions.push("LinkedIn Profile Link");
  if (!github) missingSuggestions.push("GitHub Repository Link");
  if (!portfolioWebsite && !personalWebsite) missingSuggestions.push("Portfolio Website URL");
  if (!bio) missingSuggestions.push("Professional summary bio description");
  if (educationList.length === 0) missingSuggestions.push("Higher Education details");
  if (experienceList.length === 0) missingSuggestions.push("Work experience record");
  if (projectsList.length === 0) missingSuggestions.push("Technical project entries");
  if (certificationsList.length === 0) missingSuggestions.push("Industry certifications");
  if (verifiedSkillsList.length === 0) missingSuggestions.push("Verified technical skills tags");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans text-xs text-left text-slate-700 bg-slate-50/20 p-4 sm:p-6 lg:p-8 rounded-3xl min-h-screen"
    >
      {/* 1. Header Banner & Profile Overview */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm bg-gradient-to-r from-blue-50/20 via-purple-50/10 to-cyan-50/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col sm:flex-row gap-5 items-center text-center sm:text-left w-full md:w-auto">
          {/* Avatar Upload Container */}
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
              <div>
                <h1 className="font-display text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  {fullName || "Mudigonda Lalitha Sreya"}
                  {fileName && <Sparkles className="h-4.5 w-4.5 text-cyan-600 animate-pulse" />}
                </h1>
                <p className="text-xs font-bold text-slate-500 mt-0.5">{displayHeadline}</p>
              </div>
            )}

            <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-1 text-slate-500 text-[10.5px]">
              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full pt-1">
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    className="h-8 text-xs"
                  />
                  <div className="space-y-0.5">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="h-8 text-xs"
                    />
                    {errors.email && <p className="text-[9px] text-red-500 font-semibold">{errors.email}</p>}
                  </div>
                  <Input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                    className="h-8 text-xs"
                  />
                </div>
              ) : (
                <>
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" /> {location || "Hyderabad, India"}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> {email || "lalithasreya23@gmail.com"}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> {phone || "+91-9307768135"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center w-full md:w-auto justify-end">
          {hasChanges && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 text-[9px] font-bold text-amber-700 animate-pulse flex items-center gap-1">
              <Info className="h-3 w-3" /> Unsaved Changes
            </span>
          )}

          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-655 font-bold transition-all shadow-xs"
              >
                <X className="h-3.5 w-3.5" /> Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-md"
              >
                <Save className="h-3.5 w-3.5" /> Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-md"
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

      {/* 2. Page Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left main column (2 cols span) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio section */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm text-left space-y-3.5">
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
              <>
                {isEditing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a summary about your skills, expertise, and aspirations..."
                    className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs text-slate-655 font-sans leading-relaxed focus:border-slate-800 outline-none h-24 resize-none bg-white transition-all"
                  />
                ) : (
                  <p className="text-slate-655 font-sans leading-relaxed text-xs italic">
                    "{bio || "Professional summary biography. Edit profile to write yours."}"
                  </p>
                )}
              </>
            )}
          </div>

          {/* Social Links Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm text-left space-y-4">
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
              <>
                {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><FaLinkedin /> LinkedIn</span>
                  <Input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="h-7 text-[10px]" placeholder="https://linkedin.com/..." />
                  {errors.linkedin && <p className="text-[8px] text-red-500 font-semibold">{errors.linkedin}</p>}
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><FaGithub /> GitHub</span>
                  <Input type="text" value={github} onChange={(e) => setGithub(e.target.value)} className="h-7 text-[10px]" placeholder="https://github.com/..." />
                  {errors.github && <p className="text-[8px] text-red-500 font-semibold">{errors.github}</p>}
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><Globe className="h-3 w-3" /> Portfolio</span>
                  <Input type="text" value={portfolioWebsite} onChange={(e) => setPortfolioWebsite(e.target.value)} className="h-7 text-[10px]" placeholder="https://..." />
                  {errors.portfolioWebsite && <p className="text-[8px] text-red-500 font-semibold">{errors.portfolioWebsite}</p>}
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><Globe className="h-3 w-3" /> Personal Site</span>
                  <Input type="text" value={personalWebsite} onChange={(e) => setPersonalWebsite(e.target.value)} className="h-7 text-[10px]" placeholder="https://..." />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><SiLeetcode /> LeetCode</span>
                  <Input type="text" value={leetcode} onChange={(e) => setLeetcode(e.target.value)} className="h-7 text-[10px]" placeholder="https://leetcode.com/..." />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><FaHackerrank /> HackerRank</span>
                  <Input type="text" value={hackerrank} onChange={(e) => setHackerrank(e.target.value)} className="h-7 text-[10px]" placeholder="https://hackerrank.com/..." />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><SiCodechef /> CodeChef</span>
                  <Input type="text" value={codechef} onChange={(e) => setCodechef(e.target.value)} className="h-7 text-[10px]" placeholder="CodeChef URL" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><SiCodeforces /> Codeforces</span>
                  <Input type="text" value={codeforces} onChange={(e) => setCodeforces(e.target.value)} className="h-7 text-[10px]" placeholder="Codeforces URL" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><Sparkles className="h-3 w-3" /> Kaggle</span>
                  <Input type="text" value={kaggle} onChange={(e) => setKaggle(e.target.value)} className="h-7 text-[10px]" placeholder="Kaggle URL" />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {[
                  { name: "LinkedIn", url: linkedin, icon: <FaLinkedin className="h-4 w-4" /> },
                  { name: "GitHub", url: github, icon: <FaGithub className="h-4 w-4" /> },
                  { name: "Portfolio", url: portfolioWebsite, icon: <Globe className="h-4 w-4 text-cyan-600" /> },
                  { name: "Personal Website", url: personalWebsite, icon: <Globe className="h-4 w-4 text-slate-400" /> },
                  { name: "LeetCode", url: leetcode, icon: <SiLeetcode className="h-4 w-4 text-orange-500" /> },
                  { name: "HackerRank", url: hackerrank, icon: <FaHackerrank className="h-4 w-4 text-green-500" /> },
                  { name: "CodeChef", url: codechef, icon: <SiCodechef className="h-4 w-4" /> },
                  { name: "Codeforces", url: codeforces, icon: <SiCodeforces className="h-4 w-4 text-blue-500" /> },
                  { name: "Kaggle", url: kaggle, icon: <Sparkles className="h-4 w-4 text-sky-500" /> }
                ].map((item) => {
                  if (!item.url) return null;
                  return (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-all font-semibold text-slate-800 text-[10.5px] shadow-xs"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </a>
                  );
                })}
                {![linkedin, github, portfolioWebsite, personalWebsite, leetcode, hackerrank, codechef, codeforces, kaggle].some(Boolean) && (
                  <p className="text-slate-400 italic text-[10px]">No links configured. Edit details to configure links.</p>
                )}
              </div>
            )}
              </>
            )}
          </div>

          {/* Connected Education & Work Timelines Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm text-left space-y-6">
            <div 
              onClick={() => toggleSection("education")}
              className="flex justify-between items-center cursor-pointer select-none"
            >
              <h3 className="font-display text-[10.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-cyan-600" /> Education & Work Timelines
              </h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {collapsedSections.education ? "[ Show ]" : "[ Hide ]"}
              </span>
            </div>
            {!collapsedSections.education && (
              <>
                <div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-slate-500 text-[9.5px] uppercase">Education History</h4>
                {isEditing && (
                  <button onClick={addEdu} className="text-slate-800 hover:text-slate-900 font-bold flex items-center gap-0.5 text-[10px] bg-slate-50 border border-slate-150 px-2 py-1 rounded-xl transition-colors">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                )}
              </div>

              <div className="relative border-l border-slate-100 ml-3 pl-6 space-y-6 pt-4">
                {educationList.map((item, idx) => (
                  <div key={idx} className="relative space-y-2">
                    <span className="absolute -left-[30px] top-1.5 h-3 w-3 rounded-full border-2 border-cyan-500 bg-white shrink-0" />
                    {isEditing ? (
                      <div className="p-4 border border-slate-200 rounded-2xl relative bg-slate-50/20 space-y-2">
                        <button onClick={() => removeEdu(idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-700">
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <Input placeholder="Degree" value={item.degree} onChange={(e) => updateEdu(idx, "degree", e.target.value)} className="h-8 text-xs" />
                          <Input placeholder="Specialization" value={item.branch} onChange={(e) => updateEdu(idx, "branch", e.target.value)} className="h-8 text-xs" />
                          <Input placeholder="Institution" value={item.institution} onChange={(e) => updateEdu(idx, "institution", e.target.value)} className="h-8 text-xs" />
                          <Input placeholder="University" value={item.university} onChange={(e) => updateEdu(idx, "university", e.target.value)} className="h-8 text-xs" />
                          <Input placeholder="Start Year" value={item.startYear} onChange={(e) => updateEdu(idx, "startYear", e.target.value)} className="h-8 text-xs" />
                          <Input placeholder="End Year" value={item.endYear} onChange={(e) => updateEdu(idx, "endYear", e.target.value)} className="h-8 text-xs" />
                          <Input placeholder="CGPA" value={item.cgpa} onChange={(e) => updateEdu(idx, "cgpa", e.target.value)} className="h-8 text-xs sm:col-span-2" />
                          <Input placeholder="Relevant Coursework" value={item.relevantCoursework || ""} onChange={(e) => updateEdu(idx, "relevantCoursework", e.target.value)} className="h-8 text-xs sm:col-span-2" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-1 font-sans">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-800 text-[12px]">{item.degree} {item.branch && `• ${item.branch}`}</h4>
                          <p className="text-slate-550 font-medium">{item.institution} {item.university && `(${item.university})`}</p>
                          {item.cgpa && <p className="text-[10px] font-bold text-cyan-600 font-mono">CGPA/Percentage: {item.cgpa}</p>}
                          {item.relevantCoursework && (
                            <p className="text-[9.5px] text-slate-450 mt-1 font-sans">
                              <span className="font-semibold text-slate-500">Coursework:</span> {item.relevantCoursework}
                            </p>
                          )}
                        </div>
                        <span className="text-[9.5px] text-slate-450 font-bold bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 self-start shrink-0">
                          {item.startYear} - {item.endYear}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {educationList.length === 0 && (
                  <p className="text-slate-400 italic text-[10px] pl-1">No education records configured.</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-display text-[10.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-cyan-600" /> Professional Experience
                </h3>
                {isEditing && (
                  <button onClick={addExp} className="text-slate-800 hover:text-slate-900 font-bold flex items-center gap-0.5 text-[10px] bg-slate-50 border border-slate-150 px-2 py-1 rounded-xl transition-colors">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                )}
              </div>

              <div className="relative border-l border-slate-100 ml-3 pl-6 space-y-6 pt-4">
                {experienceList.map((item, idx) => (
                  <div key={idx} className="relative space-y-2">
                    <span className="absolute -left-[30px] top-1.5 h-3 w-3 rounded-full border-2 border-indigo-500 bg-white shrink-0" />
                    {isEditing ? (
                      <div className="p-4 border border-slate-200 rounded-2xl relative bg-slate-50/20 space-y-2">
                        <button onClick={() => removeExp(idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-700">
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <Input placeholder="Company" value={item.companyName} onChange={(e) => updateExp(idx, "companyName", e.target.value)} className="h-8 text-xs" />
                          <Input placeholder="Role" value={item.role} onChange={(e) => updateExp(idx, "role", e.target.value)} className="h-8 text-xs" />
                          <Input placeholder="Employment Type" value={item.employmentType} onChange={(e) => updateExp(idx, "employmentType", e.target.value)} className="h-8 text-xs" />
                          <Input placeholder="Duration (e.g. Jan 2023 - Present)" value={item.duration || ""} onChange={(e) => updateExp(idx, "duration", e.target.value)} className="h-8 text-xs" />
                          <textarea placeholder="Description of responsibilities..." value={item.responsibilities} onChange={(e) => updateExp(idx, "responsibilities", e.target.value)} className="w-full rounded-xl border border-slate-200 p-2.5 text-xs h-16 resize-none outline-none font-sans sm:col-span-2 bg-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-1 font-sans">
                        <div className="space-y-1.5">
                          <div>
                            <h4 className="font-bold text-slate-800 text-[12px]">{item.role}</h4>
                            <p className="text-slate-500 font-semibold">{item.companyName} {item.employmentType && `• ${item.employmentType}`}</p>
                          </div>
                          <p className="text-slate-655 font-sans leading-relaxed text-[11px] font-medium">{item.responsibilities}</p>
                        </div>
                        <span className="text-[9.5px] text-slate-450 font-bold bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 self-start shrink-0">
                          {item.duration || "Period unspecified"}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {experienceList.length === 0 && (
                  <p className="text-slate-400 italic text-[10px] pl-1">No experience history configured.</p>
                )}
              </div>
            </div>
              </>
            )}
          </div>

          {/* Projects Portfolio Section Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm text-left space-y-4">
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
              <>
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="font-bold text-slate-500 text-[9.5px] uppercase">My Projects</span>
              {isEditing && (
                <button onClick={addProj} className="text-slate-800 hover:text-slate-900 font-bold flex items-center gap-0.5 text-[10px] bg-slate-50 border border-slate-150 px-2 py-1 rounded-xl transition-colors">
                  <Plus className="h-3.5 w-3.5" /> Add Project
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projectsList.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50/20 border border-slate-100 rounded-2xl relative flex flex-col justify-between hover:border-slate-200 transition-all shadow-2xs group">
                  {isEditing ? (
                    <div className="space-y-2 text-left w-full">
                      <button onClick={() => removeProj(idx)} className="absolute top-2.5 right-2.5 text-red-500 hover:text-red-700">
                        <Trash className="h-4 w-4" />
                      </button>
                      <Input placeholder="Project Title" value={item.projectTitle} onChange={(e) => updateProj(idx, "projectTitle", e.target.value)} className="h-8.5 text-xs font-bold" />
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Duration" value={item.duration || ""} onChange={(e) => updateProj(idx, "duration", e.target.value)} className="h-8 text-xs" />
                        <Input placeholder="Team Size" value={item.teamSize || ""} onChange={(e) => updateProj(idx, "teamSize", e.target.value)} className="h-8 text-xs" />
                      </div>
                      <Input placeholder="GitHub Link" value={item.githubLink || ""} onChange={(e) => updateProj(idx, "githubLink", e.target.value)} className="h-8 text-xs" />
                      <Input placeholder="Live URL" value={item.liveUrl || ""} onChange={(e) => updateProj(idx, "liveUrl", e.target.value)} className="h-8 text-xs" />
                      <Input placeholder="Tech (comma separated)" value={item.technologiesUsed?.join(", ") || ""} onChange={(e) => updateProj(idx, "technologiesUsed", e.target.value.split(",").map((t: string) => t.trim()).filter(Boolean))} className="h-8 text-xs" />
                      <textarea placeholder="Contributions..." value={item.contributions || ""} onChange={(e) => updateProj(idx, "contributions", e.target.value)} className="w-full rounded-lg border border-slate-200 p-1.5 text-xs h-10 resize-none outline-none font-sans bg-white" />
                      <textarea placeholder="Outcomes..." value={item.outcomes || ""} onChange={(e) => updateProj(idx, "outcomes", e.target.value)} className="w-full rounded-lg border border-slate-200 p-1.5 text-xs h-10 resize-none outline-none font-sans bg-white" />
                      <textarea placeholder="Description details" value={item.description} onChange={(e) => updateProj(idx, "description", e.target.value)} className="w-full rounded-lg border border-slate-200 p-1.5 text-xs h-12 resize-none outline-none font-sans bg-white" />
                    </div>
                  ) : (
                    <div className="space-y-3 flex-1 flex flex-col justify-between text-left">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="font-bold text-slate-800 text-[11.5px] group-hover:text-cyan-700 transition-colors">{item.projectTitle}</h4>
                            {item.teamSize && <span className="text-[9px] text-slate-400 font-semibold block">Team: {item.teamSize}</span>}
                          </div>
                          {item.duration && <span className="text-[9px] text-slate-400 font-bold bg-slate-100/60 rounded px-1.5 py-0.5">{item.duration}</span>}
                        </div>
                        <p className="text-slate-655 font-sans leading-relaxed text-[10.5px] line-clamp-3">{item.description}</p>
                        
                        {(item.contributions || item.outcomes) && (
                          <div className="space-y-1 bg-slate-50/50 p-2 rounded-xl border border-slate-100/50">
                            {item.contributions && (
                              <p className="text-[9.5px] text-slate-550 leading-relaxed font-sans">
                                <span className="font-bold text-slate-600">My Contribution:</span> {item.contributions}
                              </p>
                            )}
                            {item.outcomes && (
                              <p className="text-[9.5px] text-slate-550 leading-relaxed font-sans">
                                <span className="font-bold text-slate-600">Outcome:</span> {item.outcomes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2.5 pt-1">
                        {item.technologiesUsed && item.technologiesUsed.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.technologiesUsed.map(t => (
                              <span key={t} className="px-2 py-0.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-600 text-[8.5px] font-semibold">{t}</span>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-3 pt-0.5">
                          {item.githubLink && (
                            <a href={item.githubLink} target="_blank" rel="noopener noreferrer" className="text-[9.5px] text-cyan-600 hover:underline font-bold flex items-center gap-1">
                              <FaGithub className="h-3.5 w-3.5" /> Repository
                            </a>
                          )}
                          {item.liveUrl && (
                            <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[9.5px] text-cyan-600 hover:underline font-bold flex items-center gap-1">
                              <Globe className="h-3.5 w-3.5" /> Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {projectsList.length === 0 && (
                <p className="text-slate-400 italic text-[10px] col-span-2 pl-1">No projects configured.</p>
              )}
            </div>
              </>
            )}
          </div>

          {/* Categorized Skills Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm text-left space-y-4">
            <div 
              onClick={() => toggleSection("skills")}
              className="flex justify-between items-center cursor-pointer select-none"
            >
              <h3 className="font-display text-[10.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-cyan-600" /> Categorized Skills Inventory
              </h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {collapsedSections.skills ? "[ Show ]" : "[ Hide ]"}
              </span>
            </div>
            {!collapsedSections.skills && (
              <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Programming Languages", key: "programmingLanguages", color: "bg-blue-50 border-blue-100 text-blue-700" },
                { label: "Libraries & Frameworks", key: "frameworks", color: "bg-cyan-50 border-cyan-100 text-cyan-700" },
                { label: "Frontend", key: "frontend", color: "bg-purple-50 border-purple-100 text-purple-700" },
                { label: "Backend", key: "backend", color: "bg-emerald-50 border-emerald-100 text-emerald-700" },
                { label: "Databases & ORMs", key: "databases", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
                { label: "Cloud Platforms", key: "cloud", color: "bg-rose-50 border-rose-100 text-rose-700" },
                { label: "DevOps & Pipelines", key: "devops", color: "bg-amber-50 border-amber-100 text-amber-700" },
                { label: "Testing frameworks", key: "testing", color: "bg-slate-50 border-slate-150 text-slate-700" },
                { label: "AI & Data Science", key: "aiml", color: "bg-teal-50 border-teal-100 text-teal-700" }
              ].map((group) => {
                const skills = (parsedResumeDetails as any)?.[group.key] || [];
                if (skills.length === 0) return null;
                return (
                  <div key={group.key} className="space-y-2 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/30">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">{group.label}</span>
                    <div className="flex flex-wrap gap-1">
                      {skills.map((s: string) => (
                        <span key={s} className={`px-2 py-0.5 rounded-lg border text-[9.5px] font-semibold ${group.color}`}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
              </>
            )}
          </div>

          {/* AI Resume Match Widget wrapper */}
          <div className="w-full">
            <AIResumeMatchWidget />
          </div>
        </div>

        {/* Right Sidebar (1 col span) */}
        <div className="space-y-6">
          {/* Circular Completeness Score Widget */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm text-left flex items-center justify-between">
            <div className="space-y-1.5 flex-1">
              <h3 className="font-display text-[10.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-cyan-600 animate-pulse" /> Profile Health Strength
              </h3>
              <div>
                <span className="text-2xl font-black text-slate-900 font-mono">{overallCompleteness}%</span>
                <p className="text-[9.5px] text-slate-400 mt-0.5">Calculated ATS readiness metric</p>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 text-[9px] text-slate-500 font-medium">
                {Object.keys(metrics).map((key) => (
                  <div key={key} className="flex justify-between items-center">
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
          </div>

          {/* AI Career Insights Panel */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 text-left bg-gradient-to-br from-white to-slate-50/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-200/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="font-display text-[10.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-cyan-600" /> AI Career insights
            </h3>
            <div className="space-y-3 font-sans">
              <p className="text-slate-655 italic leading-relaxed text-xs">
                "{semanticSummary}"
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-0.5 rounded bg-slate-900/5 text-[9px] font-bold text-slate-700 uppercase tracking-wider">
                  {domainLabel}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-slate-900/5 text-[9px] font-bold text-slate-700 uppercase tracking-wider">
                  {parsedResumeDetails?.experienceLevel || "Fresher"}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Suggestions list */}
          {missingSuggestions.length > 0 && (
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/10 p-5 shadow-xs text-left space-y-3">
              <h3 className="font-display text-[10.5px] font-black text-cyan-800 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="h-4 w-4 text-cyan-600 animate-pulse" /> Profile Suggestions
              </h3>
              <p className="text-slate-500 leading-relaxed text-[10.5px]">
                Configuring these fields will maximize your profile matching score:
              </p>
              <ul className="space-y-1.5 text-cyan-850 text-[10px] font-semibold font-sans">
                {missingSuggestions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-cyan-500 font-bold">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sidebar: Certifications & Achievements list */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-display text-[10.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-4 w-4 text-cyan-600" /> Certifications & Achievements
              </h3>
              {isEditing && (
                <button onClick={addCert} className="text-slate-850 hover:text-slate-900 font-bold flex items-center gap-0.5 text-[9.5px]">
                  <Plus className="h-3 w-3" /> Add Cert
                </button>
              )}
            </div>

            <div className="space-y-3">
              {certificationsList.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl relative">
                  {isEditing ? (
                    <div className="space-y-1.5 pr-5">
                      <button onClick={() => removeCert(idx)} className="absolute top-2 right-2 text-red-500">
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                      <Input placeholder="Cert Name" value={item.certificationName} onChange={(e) => updateCert(idx, "certificationName", e.target.value)} className="h-7 text-[10px]" />
                      <Input placeholder="Issuer" value={item.organization} onChange={(e) => updateCert(idx, "organization", e.target.value)} className="h-7 text-[10px]" />
                      <Input placeholder="Issue Date" value={item.date} onChange={(e) => updateCert(idx, "date", e.target.value)} className="h-7 text-[10px]" />
                    </div>
                  ) : (
                    <div className="text-left space-y-0.5 font-sans">
                      <h5 className="font-bold text-slate-800 text-[10.5px]">{item.certificationName}</h5>
                      <p className="text-slate-550 font-medium">{item.organization} • {item.date}</p>
                    </div>
                  )}
                </div>
              ))}
              {certificationsList.length === 0 && (
                <p className="text-slate-400 italic text-[10px]">No certifications listed.</p>
              )}
            </div>

            {/* Achievements Sub list */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                <span className="font-bold text-slate-500 text-[9.5px] uppercase font-sans">Achievements</span>
                {isEditing && (
                  <button onClick={addAchievement} className="text-slate-855 hover:text-slate-900 font-bold flex items-center gap-0.5 text-[9.5px]">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                )}
              </div>
              <div className="space-y-2.5">
                {achievementsList.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl relative">
                    {isEditing ? (
                      <div className="space-y-1.5 pr-5">
                        <button onClick={() => removeAchievement(idx)} className="absolute top-2 right-2 text-red-500">
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                        <Input placeholder="Title" value={item.title} onChange={(e) => updateAchievement(idx, "title", e.target.value)} className="h-7 text-[10px] font-bold" />
                        <textarea placeholder="Description" value={item.description} onChange={(e) => updateAchievement(idx, "description", e.target.value)} className="w-full rounded-lg border border-slate-200 p-1 text-[9.5px] h-8 resize-none outline-none font-sans bg-white" />
                      </div>
                    ) : (
                      <div className="text-left space-y-0.5 font-sans">
                        <h5 className="font-bold text-slate-800 text-[10.5px]">{item.title}</h5>
                        <p className="text-slate-550 leading-relaxed text-[10px]">{item.description}</p>
                      </div>
                    )}
                  </div>
                ))}
                {achievementsList.length === 0 && (
                  <p className="text-slate-400 italic text-[10px]">No achievements recorded.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Verified Skills Tag addition input */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm text-left space-y-4">
            <h3 className="font-display text-[10.5px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              Verified Skills Inventory
            </h3>

            <div className="flex flex-wrap gap-1">
              {verifiedSkillsList.length > 0 ? (
                verifiedSkillsList.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-semibold text-slate-655 font-sans group hover:border-red-200 transition-colors"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-red-500 focus:outline-none transition-colors"
                    >
                      <Trash className="h-3 w-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic text-[10px]">No skills added.</span>
              )}
            </div>

            <div className="relative pt-2 border-t border-slate-100 space-y-1">
              <Input
                type="text"
                placeholder="Search skills (e.g. React, Docker)"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className="h-8 rounded-xl text-xs"
              />

              {showSuggestions && skillSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 z-20 mt-1 max-h-40 overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-lg divide-y divide-slate-50">
                  {skillSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleAddSkill(suggestion)}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 font-sans text-slate-655 hover:text-cyan-600 font-semibold"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Academic & Extra Activities Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm text-left space-y-5">
            <h3 className="font-display text-[10.5px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              Academic & Extra Activities
            </h3>

            {/* Publications */}
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                <span className="font-bold text-slate-500 text-[9.5px] uppercase">Publications</span>
                {isEditing && (
                  <button onClick={addPub} className="text-slate-855 font-bold text-[9px] flex items-center gap-0.5">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                {publicationsList.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-lg relative">
                    {isEditing ? (
                      <div className="space-y-1 pr-5">
                        <button onClick={() => removePub(idx)} className="absolute top-2 right-2 text-red-500"><Trash className="h-3.5 w-3.5" /></button>
                        <Input placeholder="Paper Title" value={item.title} onChange={(e) => updatePub(idx, "title", e.target.value)} className="h-7 text-[10px]" />
                        <Input placeholder="Publisher" value={item.publisher} onChange={(e) => updatePub(idx, "publisher", e.target.value)} className="h-7 text-[10px]" />
                        <Input placeholder="Date" value={item.date} onChange={(e) => updatePub(idx, "date", e.target.value)} className="h-7 text-[10px]" />
                      </div>
                    ) : (
                      <div className="text-left text-[10px] font-sans">
                        <h5 className="font-bold text-slate-700">{item.title}</h5>
                        <p className="text-slate-450 font-medium">{item.publisher} • {item.date}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Workshops */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center border-b border-slate-55 pb-1">
                <span className="font-bold text-slate-500 text-[9.5px] uppercase">Workshops</span>
                {isEditing && (
                  <button onClick={addWorkshop} className="text-slate-855 font-bold text-[9px] flex items-center gap-0.5">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                {workshopsList.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-lg relative">
                    {isEditing ? (
                      <div className="space-y-1 pr-5">
                        <button onClick={() => removeWorkshop(idx)} className="absolute top-2 right-2 text-red-500"><Trash className="h-3.5 w-3.5" /></button>
                        <Input placeholder="Workshop Name" value={item.name} onChange={(e) => updateWorkshop(idx, "name", e.target.value)} className="h-7 text-[10px]" />
                        <Input placeholder="Organizer" value={item.organizer} onChange={(e) => updateWorkshop(idx, "organizer", e.target.value)} className="h-7 text-[10px]" />
                        <Input placeholder="Date" value={item.date} onChange={(e) => updateWorkshop(idx, "date", e.target.value)} className="h-7 text-[10px]" />
                      </div>
                    ) : (
                      <div className="text-left text-[10px] font-sans">
                        <h5 className="font-bold text-slate-700">{item.name}</h5>
                        <p className="text-slate-450 font-medium">{item.organizer} • {item.date}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hackathons */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                <span className="font-bold text-slate-500 text-[9.5px] uppercase">Hackathons</span>
                {isEditing && (
                  <button onClick={addHack} className="text-slate-855 font-bold text-[9px] flex items-center gap-0.5">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                {hackathonsList.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-lg relative">
                    {isEditing ? (
                      <div className="space-y-1 pr-5">
                        <button onClick={() => removeHack(idx)} className="absolute top-2 right-2 text-red-500"><Trash className="h-3.5 w-3.5" /></button>
                        <Input placeholder="Name" value={item.name} onChange={(e) => updateHack(idx, "name", e.target.value)} className="h-7 text-[10px]" />
                        <Input placeholder="Role" value={item.role} onChange={(e) => updateHack(idx, "role", e.target.value)} className="h-7 text-[10px]" />
                        <Input placeholder="Prize" value={item.prize || ""} onChange={(e) => updateHack(idx, "prize", e.target.value)} className="h-7 text-[10px]" />
                      </div>
                    ) : (
                      <div className="text-left text-[10px] font-sans">
                        <h5 className="font-bold text-slate-700">{item.name}</h5>
                        <p className="text-slate-450 font-medium">{item.role} • {item.date}</p>
                        {item.prize && <p className="text-cyan-600 font-bold text-[9px] mt-0.5">Prize: {item.prize}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Volunteering & Leadership */}
            <div className="space-y-4 pt-1">
              <div className="space-y-2">
                <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                  <span className="font-bold text-slate-500 text-[9.5px] uppercase font-sans">Leadership</span>
                  {isEditing && (
                    <button onClick={addLeader} className="text-slate-855 font-bold text-[9px] flex items-center gap-0.5">
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  {leadershipRolesList.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-lg relative">
                      {isEditing ? (
                        <div className="space-y-1 pr-5">
                          <button onClick={() => removeLeader(idx)} className="absolute top-2 right-2 text-red-500"><Trash className="h-3.5 w-3.5" /></button>
                          <Input placeholder="Role" value={item.role} onChange={(e) => updateLeader(idx, "role", e.target.value)} className="h-7 text-[10px]" />
                          <Input placeholder="Org" value={item.organization} onChange={(e) => updateLeader(idx, "organization", e.target.value)} className="h-7 text-[10px]" />
                          <Input placeholder="Duration" value={item.duration} onChange={(e) => updateLeader(idx, "duration", e.target.value)} className="h-7 text-[10px]" />
                        </div>
                      ) : (
                        <div className="text-left text-[10px] font-sans">
                          <h5 className="font-bold text-slate-700">{item.role}</h5>
                          <p className="text-slate-450 font-medium">{item.organization} • {item.duration}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                  <span className="font-bold text-slate-500 text-[9.5px] uppercase font-sans">Volunteering</span>
                  {isEditing && (
                    <button onClick={addVolunteer} className="text-slate-855 font-bold text-[9px] flex items-center gap-0.5">
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  {volunteerExperienceList.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-lg relative">
                      {isEditing ? (
                        <div className="space-y-1 pr-5">
                          <button onClick={() => removeVolunteer(idx)} className="absolute top-2 right-2 text-red-500"><Trash className="h-3.5 w-3.5" /></button>
                          <Input placeholder="Role" value={item.role} onChange={(e) => updateVolunteer(idx, "role", e.target.value)} className="h-7 text-[10px]" />
                          <Input placeholder="Organization" value={item.organization} onChange={(e) => updateVolunteer(idx, "organization", e.target.value)} className="h-7 text-[10px]" />
                          <textarea placeholder="Description" value={item.description} onChange={(e) => updateVolunteer(idx, "description", e.target.value)} className="w-full rounded-lg border border-slate-200 p-1 text-[9.5px] h-8 resize-none outline-none font-sans bg-white" />
                        </div>
                      ) : (
                        <div className="text-left text-[10px] font-sans">
                          <h5 className="font-bold text-slate-700">{item.role}</h5>
                          <p className="text-slate-450 font-medium">{item.organization}</p>
                          {item.description && <p className="text-[9.5px] text-slate-550 leading-relaxed mt-0.5">{item.description}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
