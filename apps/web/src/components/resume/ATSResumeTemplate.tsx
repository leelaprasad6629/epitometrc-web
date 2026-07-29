"use client";

import React from "react";
import { ParsedResume } from "@/lib/ai/store/resumeStore";

interface ATSResumeTemplateProps {
  data: ParsedResume;
  zoomScale?: number;
  isPreview?: boolean;
}

export default function ATSResumeTemplate({ data, zoomScale = 1, isPreview = false }: ATSResumeTemplateProps) {
  if (!data) return null;

  // Extract fields
  const fullName = data.fullName || "Candidate Name";
  const headline = data.headline || "Professional Title";
  const email = data.email || "";
  const phone = data.phone || "";
  const location = data.location || "";
  const linkedin = data.linkedin || "";
  const github = data.github || "";
  const portfolio = data.portfolioWebsite || data.personalWebsite || "";

  // Contact line items
  const contactItems = [
    email && { label: email, href: `mailto:${email}` },
    phone && { label: phone, href: `tel:${phone}` },
    location && { label: location },
    linkedin && { label: "LinkedIn", href: linkedin.startsWith("http") ? linkedin : `https://${linkedin}` },
    github && { label: "GitHub", href: github.startsWith("http") ? github : `https://${github}` },
    portfolio && { label: "Portfolio", href: portfolio.startsWith("http") ? portfolio : `https://${portfolio}` }
  ].filter(Boolean) as { label: string; href?: string }[];

  const summary = data.bio || data.candidateProfile || "";

  // Technical & Soft Skills
  const technicalSkills = Array.from(new Set([
    ...(data.technicalSkills || []),
    ...(data.programmingLanguages || []),
    ...(data.frameworks || []),
    ...(data.frontend || []),
    ...(data.backend || []),
    ...(data.databases || []),
    ...(data.cloud || []),
    ...(data.devops || []),
    ...(data.tools || [])
  ])).filter(Boolean);

  const softSkills = (data.softSkills || []).filter(Boolean);
  const experience = (data.experience || []).filter(e => e.companyName || e.role);
  const projects = (data.projects || []).filter(p => p.projectTitle);
  const education = (data.education || []).filter(e => e.institution || e.degree);
  const certifications = (data.certifications || []).filter(c => c.certificationName);
  const achievements = [...(data.achievements || []), ...(data.awards || [])].filter(a => a.title);
  const languages = (data.languagesKnown || []).filter(Boolean);
  const volunteer = (data.volunteerExperience || []).filter(v => v.organization || v.role);

  // Custom or standard section order
  const defaultOrder = [
    "summary",
    "technicalSkills",
    "experience",
    "projects",
    "education",
    "certifications",
    "achievements",
    "languages",
    "volunteer"
  ];
  const sectionOrder = data.sectionOrder && data.sectionOrder.length > 0 ? data.sectionOrder : defaultOrder;

  const renderSection = (key: string) => {
    switch (key) {
      case "summary":
        if (!summary) return null;
        return (
          <div key="summary" className="ats-section mb-5">
            <h2 className="ats-heading text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="ats-text text-[11px] leading-relaxed text-gray-800 text-justify">
              {summary}
            </p>
          </div>
        );

      case "technicalSkills":
        if (technicalSkills.length === 0 && softSkills.length === 0) return null;
        return (
          <div key="technicalSkills" className="ats-section mb-5">
            <h2 className="ats-heading text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 pb-1 mb-2">
              Skills & Proficiencies
            </h2>
            {technicalSkills.length > 0 && (
              <div className="text-[11px] leading-relaxed text-gray-800 mb-1">
                <span className="font-semibold text-gray-900">Technical Skills: </span>
                <span>{technicalSkills.join(" • ")}</span>
              </div>
            )}
            {softSkills.length > 0 && (
              <div className="text-[11px] leading-relaxed text-gray-800">
                <span className="font-semibold text-gray-900">Soft Skills: </span>
                <span>{softSkills.join(" • ")}</span>
              </div>
            )}
          </div>
        );

      case "experience":
        if (experience.length === 0) return null;
        return (
          <div key="experience" className="ats-section mb-5">
            <h2 className="ats-heading text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 pb-1 mb-2">
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="ats-entry">
                  <div className="flex justify-between items-baseline text-[11px]">
                    <span className="font-bold text-gray-900">{exp.role || "Role"}</span>
                    <span className="text-gray-600 font-medium">
                      {[exp.startDate, exp.endDate].filter(Boolean).join(" – ") || exp.duration}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-[11px] italic text-gray-700 mb-1">
                    <span>{exp.companyName}</span>
                    {exp.employmentType && <span>{exp.employmentType}</span>}
                  </div>
                  {exp.responsibilities && (
                    <ul className="list-disc list-outside ml-4 text-[10.5px] leading-relaxed text-gray-800 space-y-0.5">
                      {exp.responsibilities
                        .split(/\n|(?<=\.)\s+(?=[A-Z])/)
                        .map(b => b.trim().replace(/^[-•*]\s*/, ""))
                        .filter(b => b.length > 3)
                        .map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "projects":
        if (projects.length === 0) return null;
        return (
          <div key="projects" className="ats-section mb-5">
            <h2 className="ats-heading text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 pb-1 mb-2">
              Key Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="ats-entry">
                  <div className="flex justify-between items-baseline text-[11px]">
                    <span className="font-bold text-gray-900">{proj.projectTitle}</span>
                    {proj.duration && <span className="text-gray-600 font-medium text-[10px]">{proj.duration}</span>}
                  </div>
                  {proj.technologiesUsed && proj.technologiesUsed.length > 0 && (
                    <div className="text-[10px] italic text-gray-700 mb-0.5">
                      Technologies: {proj.technologiesUsed.join(", ")}
                    </div>
                  )}
                  {proj.description && (
                    <p className="text-[10.5px] leading-relaxed text-gray-800 text-justify">
                      {proj.description}
                    </p>
                  )}
                  {(proj.githubLink || proj.liveUrl) && (
                    <div className="text-[10px] text-gray-600 mt-0.5 space-x-3">
                      {proj.githubLink && <span>GitHub: {proj.githubLink}</span>}
                      {proj.liveUrl && <span>Live: {proj.liveUrl}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "education":
        if (education.length === 0) return null;
        return (
          <div key="education" className="ats-section mb-5">
            <h2 className="ats-heading text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 pb-1 mb-2">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={idx} className="ats-entry text-[11px]">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-900">
                      {edu.degree} {edu.branch ? `in ${edu.branch}` : ""}
                    </span>
                    <span className="text-gray-600 font-medium">
                      {[edu.startYear, edu.endYear].filter(Boolean).join(" – ")}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-gray-700 italic">
                    <span>{edu.institution || edu.university}</span>
                    {edu.cgpa && <span className="not-italic font-semibold">GPA/Score: {edu.cgpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "certifications":
        if (certifications.length === 0) return null;
        return (
          <div key="certifications" className="ats-section mb-5">
            <h2 className="ats-heading text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 pb-1 mb-2">
              Certifications
            </h2>
            <ul className="list-disc list-outside ml-4 text-[10.5px] leading-relaxed text-gray-800 space-y-0.5">
              {certifications.map((cert, idx) => (
                <li key={idx}>
                  <span className="font-bold text-gray-900">{cert.certificationName}</span>
                  {cert.organization && <span> — {cert.organization}</span>}
                  {cert.date && <span className="text-gray-600"> ({cert.date})</span>}
                </li>
              ))}
            </ul>
          </div>
        );

      case "achievements":
        if (achievements.length === 0) return null;
        return (
          <div key="achievements" className="ats-section mb-5">
            <h2 className="ats-heading text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 pb-1 mb-2">
              Achievements & Awards
            </h2>
            <ul className="list-disc list-outside ml-4 text-[10.5px] leading-relaxed text-gray-800 space-y-0.5">
              {achievements.map((ach, idx) => (
                <li key={idx}>
                  <span className="font-bold text-gray-900">{ach.title}</span>
                  {ach.description && <span>: {ach.description}</span>}
                </li>
              ))}
            </ul>
          </div>
        );

      case "languages":
        if (languages.length === 0) return null;
        return (
          <div key="languages" className="ats-section mb-5">
            <h2 className="ats-heading text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 pb-1 mb-2">
              Languages
            </h2>
            <div className="text-[11px] text-gray-800">
              {languages.join(" • ")}
            </div>
          </div>
        );

      case "volunteer":
        if (volunteer.length === 0) return null;
        return (
          <div key="volunteer" className="ats-section mb-5">
            <h2 className="ats-heading text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 pb-1 mb-2">
              Volunteer & Community Leadership
            </h2>
            <div className="space-y-2">
              {volunteer.map((v, idx) => (
                <div key={idx} className="ats-entry text-[11px]">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span>{v.role}</span>
                    <span className="font-normal text-gray-600 text-[10px]">{v.organization}</span>
                  </div>
                  {v.description && <p className="text-[10.5px] leading-relaxed text-gray-800">{v.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      id="ats-master-resume-template"
      className="bg-white text-gray-900 font-sans shadow-lg mx-auto print:shadow-none print:m-0"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "18mm 16mm",
        transform: zoomScale !== 1 && isPreview ? `scale(${zoomScale})` : undefined,
        transformOrigin: "top center",
        boxSizing: "border-box",
        fontFamily: "'Inter', 'Arial', sans-serif"
      }}
    >
      {/* Header (Center Aligned, Pure ATS Single-Column Format) */}
      <header className="text-center mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight uppercase mb-1">
          {fullName}
        </h1>
        {headline && (
          <div className="text-sm font-semibold text-gray-700 uppercase tracking-widest mb-2">
            {headline}
          </div>
        )}
        {contactItems.length > 0 && (
          <div className="text-[10.5px] text-gray-700 flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
            {contactItems.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-gray-400 font-normal">•</span>}
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium text-gray-800">
                    {item.label}
                  </a>
                ) : (
                  <span>{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {/* Dynamic Sections Rendered in Fixed / Custom ATS Order */}
      <main className="space-y-4">
        {sectionOrder.map(key => renderSection(key))}
      </main>
    </div>
  );
}
