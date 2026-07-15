"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, MapPin, Globe, Edit3, Save, X, Camera, Plus, Trash, Check, AlertCircle, Info, Sparkles } from "lucide-react";
import { FaLinkedin, FaGithub, FaHackerrank } from "react-icons/fa";
import { SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";
import Image from "next/image";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import { useResumeStore, ParsedResume } from "@/lib/ai/store/resumeStore";
import AIResumeMatchWidget from "@/components/ai/AIResumeMatchWidget";

// Autocomplete dictionary of standard technical skills
const SKILLS_DICTIONARY = [
  "Frontend Development", "Frontend Architecture", "Frontend Testing", "Frontend Engineering",
  "React", "React.js", "React Native", "Redux", "Redux Toolkit",
  "Java", "JavaScript", "Java EE", "Java SE", "Spring", "Spring Boot",
  "Python", "PyTorch", "Pyramid", "Pydantic", "Pandas", "NumPy",
  "AWS", "AWS Lambda", "AWS EC2", "AWS S3", "AWS Amplify", "AWS CloudFormation",
  "Node.js", "Express.js", "Next.js", "Vue.js", "Angular", "TypeScript",
  "HTML5", "CSS3", "Tailwind CSS", "Sass", "Bootstrap",
  "PostgreSQL", "MongoDB", "MySQL", "Redis", "Prisma", "Supabase", "SQLite",
  "Docker", "Kubernetes", "Git", "GitHub", "GitLab", "CI/CD", "Terraform", "GraphQL"
];

// Helper to validate generic web URLs
const isValidUrl = (url: string) => {
  if (!url) return true; // Optional fields are valid if empty
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

  const [education, setEducation] = useState("");
  const [projects, setProjects] = useState("");
  const [certifications, setCertifications] = useState("");
  const [internships, setInternships] = useState("");
  const [achievements, setAchievements] = useState("");

  // Skills Autocomplete states
  const [skillSearch, setSkillSearch] = useState("");
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Initialize local states from store
  useEffect(() => {
    if (parsedResumeDetails) {
      setFullName(parsedResumeDetails.fullName || "");
      setHeadline(parsedResumeDetails.headline || "Apprentice Engineer");
      setBio(parsedResumeDetails.experience || ""); // Biography
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

      setEducation(parsedResumeDetails.education || "");
      setProjects(parsedResumeDetails.projects || "");
      setCertifications(parsedResumeDetails.certifications || "");
      setInternships(parsedResumeDetails.internships || "");
      setAchievements(parsedResumeDetails.achievements || "");
    }
  }, [parsedResumeDetails]);

  // Highlight unsaved changes detection
  const hasChanges = parsedResumeDetails ? (
    fullName !== (parsedResumeDetails.fullName || "") ||
    headline !== (parsedResumeDetails.headline || "") ||
    bio !== (parsedResumeDetails.experience || "") ||
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
    education !== (parsedResumeDetails.education || "") ||
    projects !== (parsedResumeDetails.projects || "") ||
    certifications !== (parsedResumeDetails.certifications || "") ||
    internships !== (parsedResumeDetails.internships || "") ||
    achievements !== (parsedResumeDetails.achievements || "")
  ) : false;

  // Prompt the user before leaving the page if there are unsaved edits
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

  // Handle autocomplete search suggestions
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

  // Profile Image Base64 Uploader Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result?.toString() || null;
      setProfileImage(base64);
      // Immediately save profile image to store
      updateParsedDetails({ profileImage: base64 });
      setSuccessMsg("Profile picture updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    updateParsedDetails({ profileImage: null });
    setSuccessMsg("Profile picture removed.");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Add skill to verified list
  const handleAddSkill = (skill: string) => {
    const currentSkills = parsedResumeDetails?.verifiedSkills || [];
    if (!currentSkills.includes(skill)) {
      const updated = [...currentSkills, skill];
      updateParsedDetails({ verifiedSkills: updated });
    }
    setSkillSearch("");
    setShowSuggestions(false);
  };

  const handleRemoveSkill = (skill: string) => {
    const currentSkills = parsedResumeDetails?.verifiedSkills || [];
    const updated = currentSkills.filter(s => s !== skill);
    updateParsedDetails({ verifiedSkills: updated });
  };

  // Add custom skill on Enter key
  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillSearch.trim()) {
      e.preventDefault();
      handleAddSkill(skillSearch.trim());
    }
  };

  // Save profile modifications
  const handleSaveProfile = () => {
    // 1. Validation checks
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
      { name: "codechef", value: codechef },
      { name: "codeforces", value: codeforces }
    ];

    urlFields.forEach(f => {
      if (f.value && !isValidUrl(f.value)) {
        newErrors[f.name] = "Please enter a valid URL (include http:// or https://).";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 2. Commit to Zustand Store
    updateParsedDetails({
      fullName,
      headline,
      experience: bio,
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
      education,
      projects,
      certifications,
      internships,
      achievements
    });

    setErrors({});
    setIsEditing(false);
    setSuccessMsg("Profile updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Cancel edit modifications
  const handleCancelEdit = () => {
    if (parsedResumeDetails) {
      setFullName(parsedResumeDetails.fullName || "");
      setHeadline(parsedResumeDetails.headline || "Apprentice Engineer");
      setBio(parsedResumeDetails.experience || "");
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

      setEducation(parsedResumeDetails.education || "");
      setProjects(parsedResumeDetails.projects || "");
      setCertifications(parsedResumeDetails.certifications || "");
      setInternships(parsedResumeDetails.internships || "");
      setAchievements(parsedResumeDetails.achievements || "");
    }
    setErrors({});
    setIsEditing(false);
  };

  const activeAvatar = profileImage || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=faces";
  const displayHeadline = parsedResumeDetails?.headline || "Software Engineering Apprentice";
  const verifiedSkillsList = parsedResumeDetails?.verifiedSkills || [];

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
            My Profile
          </h1>
          <p className="text-slate-500 text-sm">
            Manage your personal credentials, digital connections, and verified skills.
          </p>
        </div>
        
        {/* Save/Edit Actions */}
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
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-5 items-center">
              {/* Profile Image with Upload/Remove actions */}
              <div className="relative h-20 w-20 rounded-full border-2 border-slate-100 overflow-hidden group">
                <Image
                  src={activeAvatar}
                  alt={fullName}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                
                {/* Photo overlay triggers */}
                <div className="absolute inset-0 bg-[#0b172a]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer">
                  <label className="cursor-pointer text-white flex flex-col items-center">
                    <Camera className="h-4 w-4" />
                    <span className="text-[7.5px] font-bold uppercase mt-0.5">Upload</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {profileImage && (
                    <button onClick={handleRemoveImage} className="text-red-400 hover:text-red-300" title="Remove picture">
                      <Trash className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="text-center sm:text-left space-y-1.5 flex-1 w-full">
                {isEditing ? (
                  <div className="space-y-2 max-w-md">
                    <div className="space-y-0.5">
                      <Input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                        className="h-8.5 rounded-lg border border-slate-200 focus-visible:ring-orange-500 text-xs font-bold text-slate-800"
                      />
                      {errors.fullName && <p className="text-[9.5px] font-semibold text-red-500">{errors.fullName}</p>}
                    </div>
                    <Input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="Headline (e.g. Frontend Architecture Analyst)"
                      className="h-8.5 rounded-lg border border-slate-200 focus-visible:ring-orange-500 text-xs font-medium text-slate-600"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="font-display text-lg font-bold text-[#0b172a]">{fullName || "Alex Thompson"}</h3>
                    <p className="text-xs font-semibold text-orange-500 font-sans">{displayHeadline}</p>
                  </>
                )}

                <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-1 text-slate-400 text-xs font-sans">
                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full pt-1">
                      <Input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location (e.g. London, UK)"
                        className="h-8.5 rounded-lg text-xs"
                      />
                      <div className="space-y-0.5">
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          className="h-8.5 rounded-lg text-xs"
                        />
                        {errors.email && <p className="text-[9.5px] font-semibold text-red-500">{errors.email}</p>}
                      </div>
                      <Input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number"
                        className="h-8.5 rounded-lg text-xs"
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
                Professional Bio / About Me
              </label>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-600 font-sans leading-relaxed focus:border-orange-500 outline-none h-24 resize-none bg-white"
                />
              ) : (
                <p className="text-slate-600 font-sans leading-relaxed text-xs text-left">
                  {bio || "No biography provided. Click Edit Profile to document your background details."}
                </p>
              )}
            </div>
          </div>

          {/* Education, Experience & Projects Details */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider border-b border-slate-50 pb-2">
              Background & History Details
            </h2>

            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Education</label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full h-8.5 rounded-lg border border-slate-200 px-3 text-slate-600 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Projects Summary</label>
                  <textarea
                    value={projects}
                    onChange={(e) => setProjects(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-600 h-14 outline-none text-xs bg-white focus:border-orange-500 resize-none font-sans"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Certifications</label>
                    <input
                      type="text"
                      value={certifications}
                      onChange={(e) => setCertifications(e.target.value)}
                      className="w-full h-8.5 rounded-lg border border-slate-200 px-3 text-slate-600 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Internships</label>
                    <input
                      type="text"
                      value={internships}
                      onChange={(e) => setInternships(e.target.value)}
                      className="w-full h-8.5 rounded-lg border border-slate-200 px-3 text-slate-600 text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Achievements</label>
                  <input
                    type="text"
                    value={achievements}
                    onChange={(e) => setAchievements(e.target.value)}
                    className="w-full h-8.5 rounded-lg border border-slate-200 px-3 text-slate-600 text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {education && (
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Education</span>
                    <p className="text-slate-600 font-sans font-medium">{education}</p>
                  </div>
                )}
                {projects && (
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Projects</span>
                    <p className="text-slate-600 font-sans font-medium">{projects}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {certifications && (
                    <div className="space-y-1 text-left">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Certifications</span>
                      <p className="text-slate-600 font-sans font-medium">{certifications}</p>
                    </div>
                  )}
                  {internships && (
                    <div className="space-y-1 text-left">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Internships</span>
                      <p className="text-slate-600 font-sans font-medium">{internships}</p>
                    </div>
                  )}
                </div>
                {achievements && (
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Achievements</span>
                    <p className="text-slate-600 font-sans font-medium">{achievements}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Resume Match Widget */}
          <AIResumeMatchWidget />
        </div>

        {/* Right Column: Verified Skills & Connections */}
        <div className="space-y-6">
          {/* Verified Skills Autocomplete Tagging card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 text-left relative">
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider border-b border-slate-50 pb-2">
              Verified Skills
            </h2>

            {/* Render verified skill badges */}
            <div className="flex flex-wrap gap-1.5">
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
                <span className="text-slate-400 italic text-[10px]">No verified skills added. Use the input below.</span>
              )}
            </div>

            {/* Autocomplete Input dropdown wrapper */}
            <div className="relative pt-2 border-t border-slate-50 space-y-1">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type to search skills (e.g. fro, rea, py)"
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  className="h-9 rounded-xl border border-slate-200 focus-visible:ring-orange-500 font-sans text-xs"
                />
              </div>

              {/* suggestions list overlay */}
              {showSuggestions && skillSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 z-20 mt-1 max-h-40 overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-lg divide-y divide-slate-50">
                  {skillSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleAddSkill(suggestion)}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-50 font-sans text-slate-600 hover:text-orange-500 font-semibold transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Social Profiles Connections Form */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 text-left">
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider border-b border-slate-50 pb-2">
              Professional Connections
            </h2>

            {isEditing ? (
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">LinkedIn URL</label>
                  <Input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/user"
                    className="h-8.5 rounded-lg text-xs"
                  />
                  {errors.linkedin && <p className="text-[9px] font-semibold text-red-500">{errors.linkedin}</p>}
                </div>

                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">GitHub URL</label>
                  <Input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/user"
                    className="h-8.5 rounded-lg text-xs"
                  />
                  {errors.github && <p className="text-[9px] font-semibold text-red-500">{errors.github}</p>}
                </div>

                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Portfolio Website</label>
                  <Input
                    type="text"
                    value={portfolioWebsite}
                    onChange={(e) => setPortfolioWebsite(e.target.value)}
                    placeholder="https://myportfolio.com"
                    className="h-8.5 rounded-lg text-xs"
                  />
                  {errors.portfolioWebsite && <p className="text-[9px] font-semibold text-red-500">{errors.portfolioWebsite}</p>}
                </div>

                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">LeetCode Link</label>
                  <Input
                    type="text"
                    value={leetcode}
                    onChange={(e) => setLeetcode(e.target.value)}
                    placeholder="https://leetcode.com/user"
                    className="h-8.5 rounded-lg text-xs"
                  />
                  {errors.leetcode && <p className="text-[9px] font-semibold text-red-500">{errors.leetcode}</p>}
                </div>

                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">HackerRank Link</label>
                  <Input
                    type="text"
                    value={hackerrank}
                    onChange={(e) => setHackerrank(e.target.value)}
                    placeholder="https://hackerrank.com/user"
                    className="h-8.5 rounded-lg text-xs"
                  />
                  {errors.hackerrank && <p className="text-[9px] font-semibold text-red-500">{errors.hackerrank}</p>}
                </div>

                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Codeforces Link</label>
                  <Input
                    type="text"
                    value={codeforces}
                    onChange={(e) => setCodeforces(e.target.value)}
                    placeholder="https://codeforces.com/profile/user"
                    className="h-8.5 rounded-lg text-xs"
                  />
                  {errors.codeforces && <p className="text-[9px] font-semibold text-red-500">{errors.codeforces}</p>}
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {/* LinkedIn */}
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <FaLinkedin className="h-4 w-4 text-[#0a66c2]" />
                      <span className="text-[10px] font-bold text-slate-600 font-sans">LinkedIn Connections</span>
                    </div>
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                  </a>
                )}

                {/* GitHub */}
                {github && (
                  <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <FaGithub className="h-4 w-4 text-slate-800" />
                      <span className="text-[10px] font-bold text-slate-600 font-sans">GitHub Repositories</span>
                    </div>
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                  </a>
                )}

                {/* Portfolio */}
                {portfolioWebsite && (
                  <a href={portfolioWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Globe className="h-4 w-4 text-emerald-500" />
                      <span className="text-[10px] font-bold text-slate-600 font-sans">Portfolio Website</span>
                    </div>
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                  </a>
                )}

                {/* LeetCode */}
                {leetcode && (
                  <a href={leetcode} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <SiLeetcode className="h-4 w-4 text-[#f89f1b]" />
                      <span className="text-[10px] font-bold text-slate-600 font-sans">LeetCode Metrics</span>
                    </div>
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                  </a>
                )}

                {/* HackerRank */}
                {hackerrank && (
                  <a href={hackerrank} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <FaHackerrank className="h-4 w-4 text-[#2ec866]" />
                      <span className="text-[10px] font-bold text-slate-600 font-sans">HackerRank Profile</span>
                    </div>
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                  </a>
                )}

                {/* Codeforces */}
                {codeforces && (
                  <a href={codeforces} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <SiCodeforces className="h-4 w-4 text-[#3185f3]" />
                      <span className="text-[10px] font-bold text-slate-600 font-sans">Codeforces Handles</span>
                    </div>
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                  </a>
                )}

                {!linkedin && !github && !portfolioWebsite && !leetcode && !hackerrank && !codeforces && (
                  <p className="text-slate-400 italic text-[10px] text-center">No active social links. Click Edit Profile to add links.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
