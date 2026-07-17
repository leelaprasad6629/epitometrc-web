"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, MapPin, Globe, Edit3, Save, X, Camera, Plus, Trash, Check, AlertCircle, Info, Sparkles, BookOpen, Briefcase, Award, CheckCircle, Flame, Target } from "lucide-react";
import { FaLinkedin, FaGithub, FaHackerrank } from "react-icons/fa";
import { SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useResumeStore, ParsedResume, EducationEntry, ExperienceEntry, ProjectEntry, CertificationEntry, InternshipEntry, AchievementEntry } from "@/lib/ai/store/resumeStore";
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
  const { parsedResumeDetails, updateParsedDetails, loadProfileFromServer } = useResumeStore();

  useEffect(() => {
    loadProfileFromServer();
  }, [loadProfileFromServer]);

  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Local Form state
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolioWebsite, setPortfolioWebsite] = useState("");
  const [personalWebsite, setPersonalWebsite] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [hackerrank, setHackerrank] = useState("");
  const [codechef, setCodechef] = useState("");
  const [codeforces, setCodeforces] = useState("");

  // Structured Lists States
  const [educationList, setEducationList] = useState<EducationEntry[]>([]);
  const [experienceList, setExperienceList] = useState<ExperienceEntry[]>([]);
  const [projectsList, setProjectsList] = useState<ProjectEntry[]>([]);
  const [certificationsList, setCertificationsList] = useState<CertificationEntry[]>([]);
  const [internshipsList, setInternshipsList] = useState<InternshipEntry[]>([]);
  const [achievementsList, setAchievementsList] = useState<AchievementEntry[]>([]);

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

      setEducationList(parsedResumeDetails.education || []);
      setExperienceList(parsedResumeDetails.experience || []);
      setProjectsList(parsedResumeDetails.projects || []);
      setCertificationsList(parsedResumeDetails.certifications || []);
      setInternshipsList(parsedResumeDetails.internships || []);
      setAchievementsList(parsedResumeDetails.achievements || []);
    }
  }, [parsedResumeDetails]);

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
    JSON.stringify(educationList) !== JSON.stringify(parsedResumeDetails.education || []) ||
    JSON.stringify(experienceList) !== JSON.stringify(parsedResumeDetails.experience || []) ||
    JSON.stringify(projectsList) !== JSON.stringify(parsedResumeDetails.projects || []) ||
    JSON.stringify(certificationsList) !== JSON.stringify(parsedResumeDetails.certifications || []) ||
    JSON.stringify(internshipsList) !== JSON.stringify(parsedResumeDetails.internships || []) ||
    JSON.stringify(achievementsList) !== JSON.stringify(parsedResumeDetails.achievements || [])
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
  }, [skillSearch, parsedResumeDetails?.verifiedSkills]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result?.toString() || null;
      setProfileImage(base64);
      updateParsedDetails({ profileImage: base64 });
      setSuccessMsg("Profile picture updated!");
      setTimeout(() => setSuccessMsg(""), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    updateParsedDetails({ profileImage: null });
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

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillSearch.trim()) {
      e.preventDefault();
      handleAddSkill(skillSearch.trim());
    }
  };

  // Structured list item actions
  const addEdu = () => setEducationList([...educationList, { degree: "", branch: "", institution: "", university: "", startYear: "", endYear: "", cgpa: "" }]);
  const removeEdu = (idx: number) => setEducationList(educationList.filter((_, i) => i !== idx));
  const updateEdu = (idx: number, key: keyof EducationEntry, val: string) => setEducationList(educationList.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  const addExp = () => setExperienceList([...experienceList, { companyName: "", role: "", employmentType: "Full-time", startDate: "", endDate: "", duration: "", responsibilities: "" }]);
  const removeExp = (idx: number) => setExperienceList(experienceList.filter((_, i) => i !== idx));
  const updateExp = (idx: number, key: keyof ExperienceEntry, val: string) => setExperienceList(experienceList.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  const addProj = () => setProjectsList([...projectsList, { projectTitle: "", description: "", technologiesUsed: [], githubLink: "", liveUrl: "", duration: "" }]);
  const removeProj = (idx: number) => setProjectsList(projectsList.filter((_, i) => i !== idx));
  const updateProj = (idx: number, key: keyof ProjectEntry, val: any) => setProjectsList(projectsList.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  const addCert = () => setCertificationsList([...certificationsList, { certificationName: "", organization: "", date: "", credentialId: "" }]);
  const removeCert = (idx: number) => setCertificationsList(certificationsList.filter((_, i) => i !== idx));
  const updateCert = (idx: number, key: keyof CertificationEntry, val: string) => setCertificationsList(certificationsList.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  const addIntern = () => setInternshipsList([...internshipsList, { company: "", role: "", duration: "", description: "" }]);
  const removeIntern = (idx: number) => setInternshipsList(internshipsList.filter((_, i) => i !== idx));
  const updateIntern = (idx: number, key: keyof InternshipEntry, val: string) => setInternshipsList(internshipsList.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  const addAchieve = () => setAchievementsList([...achievementsList, { title: "", description: "" }]);
  const removeAchieve = (idx: number) => setAchievementsList(achievementsList.filter((_, i) => i !== idx));
  const updateAchieve = (idx: number, key: keyof AchievementEntry, val: string) => setAchievementsList(achievementsList.map((item, i) => i === idx ? { ...item, [key]: val } : item));

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
      { name: "hackerrank", value: hackerrank }
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
      education: educationList,
      experience: experienceList,
      projects: projectsList,
      certifications: certificationsList,
      internships: internshipsList,
      achievements: achievementsList
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

      setEducationList(parsedResumeDetails.education || []);
      setExperienceList(parsedResumeDetails.experience || []);
      setProjectsList(parsedResumeDetails.projects || []);
      setCertificationsList(parsedResumeDetails.certifications || []);
      setInternshipsList(parsedResumeDetails.internships || []);
      setAchievementsList(parsedResumeDetails.achievements || []);
    }
    setIsEditing(false);
    setErrors({});
  };

  // Phase 7 - Profile Suggestions
  const missingSuggestions: string[] = [];
  if (!linkedin) missingSuggestions.push("LinkedIn Profile");
  if (!github) missingSuggestions.push("GitHub Link");
  if (!portfolioWebsite) missingSuggestions.push("Portfolio Website");
  if (!bio) missingSuggestions.push("Professional Summary");
  if (certificationsList.length === 0) missingSuggestions.push("Certifications");
  if (achievementsList.length === 0) missingSuggestions.push("Achievements");

  const activeAvatar = profileImage || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=faces";
  const displayHeadline = parsedResumeDetails?.headline || "Software Engineering Apprentice";
  const verifiedSkillsList = parsedResumeDetails?.verifiedSkills || [];
  const domainLabel = parsedResumeDetails?.careerDomain || "Full Stack Development";
  const semanticSummary = parsedResumeDetails?.candidateProfile || "Alex is an engineering apprentice focused on building optimized UI platforms.";

  const overallCompleteness = parsedResumeDetails?.overallCompleteness || 0;
  const metrics = parsedResumeDetails?.completenessMetrics || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans text-xs text-left"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
            Resume Intelligence Profile
          </h1>
          <p className="text-slate-500 text-sm">
            Edit your verified credentials and semantic resume candidate segments.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {hasChanges && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 text-[10px] font-black text-amber-600 animate-pulse flex items-center gap-1">
              <Info className="h-3.5 w-3.5" /> Unsaved Changes
            </span>
          )}

          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold transition-colors"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-colors shadow-sm"
              >
                <Save className="h-4 w-4" /> Save Profile
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#0b172a] hover:bg-slate-800 text-white font-bold transition-colors shadow-sm"
            >
              <Edit3 className="h-4 w-4" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold flex items-center gap-2">
          <Check className="h-4.5 w-4.5" />
          {successMsg}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Span (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Info Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-5 items-center">
              
              {/* Profile Image */}
              <div className="relative h-20 w-20 rounded-full border-2 border-slate-100 overflow-hidden group shrink-0">
                <Image
                  src={activeAvatar}
                  alt={fullName}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                
                <div className="absolute inset-0 bg-[#0b172a]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer">
                  <label className="cursor-pointer text-white flex flex-col items-center">
                    <Camera className="h-4 w-4" />
                    <span className="text-[7.5px] font-bold uppercase mt-0.5">Upload</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {profileImage && (
                    <button onClick={handleRemoveImage} className="text-red-400 hover:text-red-300">
                      <Trash className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Name Details */}
              <div className="text-center sm:text-left space-y-1.5 flex-1 w-full">
                {isEditing ? (
                  <div className="space-y-2 max-w-md">
                    <div className="space-y-0.5">
                      <Input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                        className="h-8.5 text-xs font-bold text-slate-800"
                      />
                      {errors.fullName && <p className="text-[9px] text-red-500 font-semibold">{errors.fullName}</p>}
                    </div>
                    <Input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="Headline (e.g. Frontend Specialist)"
                      className="h-8.5 text-xs text-slate-600"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="font-display text-lg font-bold text-[#0b172a]">{fullName || "Alex Thompson"}</h3>
                    <p className="text-xs font-semibold text-orange-500">{displayHeadline}</p>
                  </>
                )}

                <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-1 text-slate-400 text-xs">
                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full pt-1">
                      <Input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location"
                        className="h-8.5 text-xs"
                      />
                      <div className="space-y-0.5">
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          className="h-8.5 text-xs"
                        />
                        {errors.email && <p className="text-[9px] text-red-500 font-semibold">{errors.email}</p>}
                      </div>
                      <Input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number"
                        className="h-8.5 text-xs"
                      />
                    </div>
                  ) : (
                    <>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> {location || "London, UK"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-slate-400" /> {email || "alex.t@epitome.com"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-slate-400" /> {phone || "+1 (555) 019-2834"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-2 border-t border-slate-50 pt-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Professional summary
              </label>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-600 font-sans leading-relaxed focus:border-orange-500 outline-none h-24 resize-none bg-white"
                />
              ) : (
                <p className="text-slate-600 font-sans leading-relaxed text-xs">
                  {bio || "No summary provided. Edit profile to write yours."}
                </p>
              )}
            </div>
          </div>

          {/* Background Sections Details */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider border-b border-slate-50 pb-2">
              Background Credentials
            </h2>

            {/* Education History List */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-700 flex items-center gap-1.5 uppercase text-[10px]">
                  <BookOpen className="h-4 w-4 text-orange-500" /> Education Background
                </h3>
                {isEditing && (
                  <button onClick={addEdu} className="text-orange-500 hover:text-orange-600 font-bold flex items-center gap-0.5">
                    <Plus className="h-3.5 w-3.5" /> Add Education
                  </button>
                )}
              </div>

              <div className="space-y-3.5">
                {educationList.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-2.5 relative">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="absolute top-2 right-2">
                          <button onClick={() => removeEdu(idx)} className="text-red-500 hover:text-red-700">
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                          <Input
                            placeholder="Degree (e.g. B.Sc.)"
                            value={item.degree}
                            onChange={(e) => updateEdu(idx, "degree", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Specialization / Branch"
                            value={item.branch}
                            onChange={(e) => updateEdu(idx, "branch", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Institution"
                            value={item.institution}
                            onChange={(e) => updateEdu(idx, "institution", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Affiliated University"
                            value={item.university}
                            onChange={(e) => updateEdu(idx, "university", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Start Year"
                            value={item.startYear}
                            onChange={(e) => updateEdu(idx, "startYear", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="End Year"
                            value={item.endYear}
                            onChange={(e) => updateEdu(idx, "endYear", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="CGPA / Percentage"
                            value={item.cgpa}
                            onChange={(e) => updateEdu(idx, "cgpa", e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start text-left">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-700 text-xs">
                            {item.degree} in {item.branch || "General Specialization"}
                          </h4>
                          <p className="text-[10.5px] text-slate-500 font-medium font-sans">
                            {item.institution} {item.university && `(${item.university})`}
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold font-sans">CGPA Score: {item.cgpa || "N/A"}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold font-sans">
                          {item.startYear} - {item.endYear}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {educationList.length === 0 && (
                  <p className="text-slate-400 italic text-[10px]">No education history recorded.</p>
                )}
              </div>
            </div>

            {/* Work Experiences */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-700 flex items-center gap-1.5 uppercase text-[10px]">
                  <Briefcase className="h-4 w-4 text-orange-500" /> Professional Experience
                </h3>
                {isEditing && (
                  <button onClick={addExp} className="text-orange-500 hover:text-orange-600 font-bold flex items-center gap-0.5">
                    <Plus className="h-3.5 w-3.5" /> Add Experience
                  </button>
                )}
              </div>

              <div className="space-y-3.5">
                {experienceList.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-2 relative">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="absolute top-2 right-2">
                          <button onClick={() => removeExp(idx)} className="text-red-500 hover:text-red-700">
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                          <Input
                            placeholder="Company Name"
                            value={item.companyName}
                            onChange={(e) => updateExp(idx, "companyName", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Role / Position"
                            value={item.role}
                            onChange={(e) => updateExp(idx, "role", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Employment Type (e.g. Full-time)"
                            value={item.employmentType}
                            onChange={(e) => updateExp(idx, "employmentType", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Duration (e.g. Jan 2023 - Present)"
                            value={item.duration}
                            onChange={(e) => updateExp(idx, "duration", e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <textarea
                          placeholder="Responsibilities & Accomplishments"
                          value={item.responsibilities}
                          onChange={(e) => updateExp(idx, "responsibilities", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-600 h-14 resize-none outline-none font-sans"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex justify-between items-start text-left">
                          <div>
                            <h4 className="font-bold text-slate-700 text-xs">{item.role}</h4>
                            <p className="text-[10.5px] text-slate-500 font-medium font-sans">
                              {item.companyName} • <span className="text-orange-500 font-bold">{item.employmentType}</span>
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold font-sans">{item.duration}</span>
                        </div>
                        <p className="text-slate-500 font-sans leading-relaxed text-[10.5px] whitespace-pre-line">{item.responsibilities}</p>
                      </div>
                    )}
                  </div>
                ))}
                {experienceList.length === 0 && (
                  <p className="text-slate-400 italic text-[10px]">No professional experiences recorded.</p>
                )}
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-700 flex items-center gap-1.5 uppercase text-[10px]">
                  <Globe className="h-4 w-4 text-orange-500" /> Projects Portfolio
                </h3>
                {isEditing && (
                  <button onClick={addProj} className="text-orange-500 hover:text-orange-600 font-bold flex items-center gap-0.5">
                    <Plus className="h-3.5 w-3.5" /> Add Project
                  </button>
                )}
              </div>

              <div className="space-y-3.5">
                {projectsList.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-2 relative">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="absolute top-2 right-2">
                          <button onClick={() => removeProj(idx)} className="text-red-500 hover:text-red-700">
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                          <Input
                            placeholder="Project Title"
                            value={item.projectTitle}
                            onChange={(e) => updateProj(idx, "projectTitle", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Duration"
                            value={item.duration}
                            onChange={(e) => updateProj(idx, "duration", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Technologies Used (comma separated)"
                            value={item.technologiesUsed?.join(", ") || ""}
                            onChange={(e) => updateProj(idx, "technologiesUsed", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="GitHub Code Link"
                            value={item.githubLink}
                            onChange={(e) => updateProj(idx, "githubLink", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Live Deploy URL"
                            value={item.liveUrl}
                            onChange={(e) => updateProj(idx, "liveUrl", e.target.value)}
                            className="h-8 text-xs sm:col-span-2"
                          />
                        </div>
                        <textarea
                          placeholder="Project description and accomplishments"
                          value={item.description}
                          onChange={(e) => updateProj(idx, "description", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-600 h-14 resize-none outline-none font-sans"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1 text-left">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-700 text-xs">{item.projectTitle}</h4>
                          <span className="text-[10px] text-slate-400 font-bold font-sans">{item.duration}</span>
                        </div>
                        <p className="text-slate-500 font-sans leading-relaxed text-[10.5px]">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {item.technologiesUsed?.map((t, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-[8.5px] font-bold text-slate-500 uppercase">
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-3 pt-2 text-[10px] font-semibold">
                          {item.githubLink && (
                            <a href={item.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              Code Repository
                            </a>
                          )}
                          {item.liveUrl && (
                            <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">
                              Live Production URL
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {projectsList.length === 0 && (
                  <p className="text-slate-400 italic text-[10px]">No projects recorded.</p>
                )}
              </div>
            </div>

            {/* Certifications & Achievements details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* Certifications */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                  <h3 className="font-bold text-slate-700 flex items-center gap-1.5 uppercase text-[9.5px]">
                    <Award className="h-3.5 w-3.5 text-orange-500" /> Certifications
                  </h3>
                  {isEditing && (
                    <button onClick={addCert} className="text-orange-500 hover:text-orange-600 font-bold flex items-center gap-0.5 text-[9px]">
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {certificationsList.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-lg relative">
                      {isEditing ? (
                        <div className="space-y-1">
                          <button onClick={() => removeCert(idx)} className="absolute top-2 right-2 text-red-500">
                            <Trash className="h-3 w-3" />
                          </button>
                          <Input
                            placeholder="Certification Name"
                            value={item.certificationName}
                            onChange={(e) => updateCert(idx, "certificationName", e.target.value)}
                            className="h-7 text-[10px]"
                          />
                          <Input
                            placeholder="Organization / Issuer"
                            value={item.organization}
                            onChange={(e) => updateCert(idx, "organization", e.target.value)}
                            className="h-7 text-[10px]"
                          />
                          <div className="grid grid-cols-2 gap-1">
                            <Input
                              placeholder="Date"
                              value={item.date}
                              onChange={(e) => updateCert(idx, "date", e.target.value)}
                              className="h-7 text-[10px]"
                            />
                            <Input
                              placeholder="Credential ID"
                              value={item.credentialId}
                              onChange={(e) => updateCert(idx, "credentialId", e.target.value)}
                              className="h-7 text-[10px]"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-left text-[10px]">
                          <h5 className="font-bold text-slate-700">{item.certificationName}</h5>
                          <p className="text-slate-400 font-sans">{item.organization} • {item.date}</p>
                          {item.credentialId && <p className="text-[8.5px] text-slate-400 font-mono">ID: {item.credentialId}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                  {certificationsList.length === 0 && (
                    <p className="text-slate-400 italic text-[9px]">No certifications listed.</p>
                  )}
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                  <h3 className="font-bold text-slate-700 flex items-center gap-1.5 uppercase text-[9.5px]">
                    <CheckCircle className="h-3.5 w-3.5 text-orange-500" /> Achievements
                  </h3>
                  {isEditing && (
                    <button onClick={addAchieve} className="text-orange-500 hover:text-orange-600 font-bold flex items-center gap-0.5 text-[9px]">
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {achievementsList.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-lg relative">
                      {isEditing ? (
                        <div className="space-y-1">
                          <button onClick={() => removeAchieve(idx)} className="absolute top-2 right-2 text-red-500">
                            <Trash className="h-3 w-3" />
                          </button>
                          <Input
                            placeholder="Title"
                            value={item.title}
                            onChange={(e) => updateAchieve(idx, "title", e.target.value)}
                            className="h-7 text-[10px]"
                          />
                          <textarea
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => updateAchieve(idx, "description", e.target.value)}
                            className="w-full rounded-lg border border-slate-200 p-1 text-[10px] h-9 resize-none outline-none font-sans"
                          />
                        </div>
                      ) : (
                        <div className="text-left text-[10px]">
                          <h5 className="font-bold text-slate-700">{item.title}</h5>
                          <p className="text-slate-400 font-sans">{item.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {achievementsList.length === 0 && (
                    <p className="text-slate-400 italic text-[9px]">No achievements listed.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <AIResumeMatchWidget />
        </div>

        {/* Right Span (1 col) */}
        <div className="space-y-6">
          
          {/* Phase 5: Completeness Widget Dashboard */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 text-left">
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider border-b border-slate-50 pb-2 flex items-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" /> Resume Completeness
            </h2>

            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 flex items-center justify-center shrink-0">
                <svg className="h-full w-full -rotate-90">
                  <circle cx="32" cy="32" r="26" className="stroke-slate-100 fill-transparent stroke-4" />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="fill-transparent stroke-4 stroke-orange-500 transition-all duration-700"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 - (overallCompleteness / 100) * (2 * Math.PI * 26)}
                  />
                </svg>
                <span className="absolute text-sm font-black text-slate-800 font-mono">{overallCompleteness}%</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-700 text-xs">Completeness Score</h4>
                <p className="text-[10px] text-slate-400 font-sans">ATS readiness strength value</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-50 pt-3">
              {Object.keys(metrics).map((key) => (
                <div key={key} className="flex justify-between items-center text-[10.5px]">
                  <span className="text-slate-500 font-medium">{key}</span>
                  <span className="font-bold text-slate-800">{metrics[key]}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Resume Quality Analysis Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 text-left">
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" /> AI Resume Quality
            </h2>

            <div className="space-y-3">
              {[
                { label: "Grammar & Readability", score: 92, text: "Excellent readability" },
                { label: "Formatting Structure", score: 95, text: "Standard section headers" },
                { label: "ATS Compatibility", score: parsedResumeDetails ? 85 : 0, text: "Machine-readable layout" },
                { label: "Keyword Coverage", score: parsedResumeDetails ? 80 : 0, text: "Aligns with technical stack" },
                { label: "Action Verb Usage", score: parsedResumeDetails ? 75 : 0, text: "Strong metrics verb count" },
                { label: "Repeated Words", score: 88, text: "Low duplicate word density" },
                { label: "Weak Bullet Points", score: parsedResumeDetails ? 78 : 0, text: "Clear project milestones" },
                { label: "Resume Length", score: 100, text: "Optimal 1-page summary" }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="text-slate-655 font-bold">{item.label}</span>
                    <span className="font-bold text-slate-800 font-mono">{item.score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-50 overflow-hidden relative">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span className="text-[8.5px] text-slate-400 font-medium block">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 7: Missing Suggestions Alerts */}
          {missingSuggestions.length > 0 && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50/20 p-5 shadow-sm space-y-3.5 text-left">
              <h2 className="font-display text-[10.5px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="h-4 w-4 text-amber-500 animate-pulse" /> Profile Suggestions
              </h2>
              <p className="text-slate-500 leading-normal text-[10.5px]">
                Your resume completeness could be stronger! We suggest configuring:
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-amber-700 text-[10.5px] font-bold">
                {missingSuggestions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Phase 6: Semantic Career Profile Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 text-left">
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider border-b border-slate-50 pb-2">
              Semantic Career Domain
            </h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[8.5px] font-bold text-slate-400 uppercase block">Target AI Classification</span>
                <span className="px-3 py-1 rounded-xl bg-orange-50 border border-orange-100 text-[10px] font-black text-orange-600 uppercase inline-block">
                  {domainLabel}
                </span>
              </div>
              <div className="space-y-1 border-t border-slate-50 pt-2">
                <span className="text-[8.5px] font-bold text-slate-400 uppercase block">AI Candidate Profile Summary</span>
                <p className="text-slate-500 font-sans leading-relaxed text-[10px]">
                  "{semanticSummary}"
                </p>
              </div>
            </div>
          </div>

          {/* Verified Skills tags autocomplete */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 text-left">
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider border-b border-slate-50 pb-2">
              Verified Technical Skills
            </h2>

            <div className="flex flex-wrap gap-1">
              {verifiedSkillsList.length > 0 ? (
                verifiedSkillsList.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-100 text-[10.5px] font-semibold text-slate-600 font-sans group hover:border-red-200"
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
                <span className="text-slate-400 italic text-[10px]">No skills.</span>
              )}
            </div>

            <div className="relative pt-2 border-t border-slate-50 space-y-1">
              <Input
                type="text"
                placeholder="Search skills (e.g. front, react)"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className="h-9 rounded-xl text-xs"
              />

              {showSuggestions && skillSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 z-20 mt-1 max-h-40 overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-lg divide-y divide-slate-50">
                  {skillSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleAddSkill(suggestion)}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-50 font-sans text-slate-655 hover:text-orange-500 font-semibold"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
