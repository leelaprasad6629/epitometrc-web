import { ParsedResume } from "@/lib/ai/store/resumeStore";

/**
 * Triggers clean browser print PDF generation for ATS master template.
 */
export function downloadResumePDF(fileName: string = "ATS_Resume.pdf") {
  if (typeof window === "undefined") return;

  const targetElement = document.getElementById("ats-master-resume-template");
  if (!targetElement) {
    alert("Resume template container not found. Please try again.");
    return;
  }

  // Inject temporary print stylesheet to isolate resume
  const printStyle = document.createElement("style");
  printStyle.id = "resume-print-style";
  printStyle.innerHTML = `
    @media print {
      body * {
        visibility: hidden !important;
      }
      #ats-master-resume-template, #ats-master-resume-template * {
        visibility: visible !important;
      }
      #ats-master-resume-template {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 12mm 10mm !important;
        box-shadow: none !important;
        transform: none !important;
      }
      @page {
        size: A4 portrait;
        margin: 12mm 10mm;
      }
    }
  `;

  document.head.appendChild(printStyle);

  window.print();

  setTimeout(() => {
    const injected = document.getElementById("resume-print-style");
    if (injected) injected.remove();
  }, 1000);
}

/**
 * Generates an ATS-compliant Word document (.docx format) matching the single-column layout.
 */
export function downloadResumeDOCX(data: ParsedResume, fileName: string = "ATS_Resume.docx") {
  if (!data) return;

  const fullName = data.fullName || "Candidate Name";
  const headline = data.headline || "";
  const contact = [
    data.email,
    data.phone,
    data.location,
    data.linkedin,
    data.github,
    data.portfolioWebsite
  ].filter(Boolean).join(" | ");

  let docxContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${fullName} Resume</title>
      <style>
        body { font-family: 'Arial', sans-serif; font-size: 11pt; line-height: 1.4; color: #111; margin: 20pt; }
        h1 { font-size: 20pt; text-align: center; text-transform: uppercase; margin-bottom: 2pt; color: #000; }
        .subtitle { font-size: 12pt; text-align: center; text-transform: uppercase; font-weight: bold; color: #444; margin-bottom: 4pt; }
        .contact { font-size: 9.5pt; text-align: center; color: #555; margin-bottom: 15pt; border-bottom: 1.5pt solid #000; padding-bottom: 8pt; }
        h2 { font-size: 11pt; text-transform: uppercase; font-weight: bold; color: #000; border-bottom: 1pt solid #666; margin-top: 14pt; margin-bottom: 6pt; }
        p { font-size: 10.5pt; margin-top: 0; margin-bottom: 6pt; text-align: justify; }
        ul { margin-top: 2pt; margin-bottom: 6pt; padding-left: 18pt; }
        li { font-size: 10pt; margin-bottom: 3pt; }
        .entry-title { font-weight: bold; font-size: 10.5pt; }
        .entry-sub { font-style: italic; font-size: 10pt; color: #444; }
      </style>
    </head>
    <body>
      <h1>${fullName}</h1>
      ${headline ? `<div class="subtitle">${headline}</div>` : ""}
      <div class="contact">${contact}</div>
  `;

  // Summary
  if (data.bio || data.candidateProfile) {
    docxContent += `<h2>Professional Summary</h2><p>${data.bio || data.candidateProfile}</p>`;
  }

  // Skills
  const skills = Array.from(new Set([
    ...(data.technicalSkills || []),
    ...(data.programmingLanguages || []),
    ...(data.frameworks || []),
    ...(data.tools || [])
  ])).filter(Boolean);

  if (skills.length > 0) {
    docxContent += `<h2>Skills & Proficiencies</h2><p><b>Technical Skills:</b> ${skills.join(" • ")}</p>`;
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    docxContent += `<h2>Work Experience</h2>`;
    data.experience.forEach(exp => {
      docxContent += `
        <div style="margin-bottom: 8pt;">
          <div class="entry-title">${exp.role || "Role"} — ${exp.companyName}</div>
          <div class="entry-sub">${[exp.startDate, exp.endDate].filter(Boolean).join(" – ") || exp.duration} | ${exp.employmentType || "Full-Time"}</div>
          ${exp.responsibilities ? `<ul>${exp.responsibilities.split('\n').filter(b => b.trim()).map(b => `<li>${b.replace(/^[-•*]\s*/, '')}</li>`).join('')}</ul>` : ''}
        </div>
      `;
    });
  }

  // Projects
  if (data.projects && data.projects.length > 0) {
    docxContent += `<h2>Key Projects</h2>`;
    data.projects.forEach(p => {
      docxContent += `
        <div style="margin-bottom: 8pt;">
          <div class="entry-title">${p.projectTitle}</div>
          ${p.description ? `<p>${p.description}</p>` : ''}
        </div>
      `;
    });
  }

  // Education
  if (data.education && data.education.length > 0) {
    docxContent += `<h2>Education</h2>`;
    data.education.forEach(e => {
      docxContent += `
        <div style="margin-bottom: 6pt;">
          <div class="entry-title">${e.degree} ${e.branch ? `in ${e.branch}` : ''}</div>
          <div class="entry-sub">${e.institution || e.university} (${[e.startYear, e.endYear].filter(Boolean).join(" – ")})</div>
        </div>
      `;
    });
  }

  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    docxContent += `<h2>Certifications</h2><ul>`;
    data.certifications.forEach(c => {
      docxContent += `<li><b>${c.certificationName}</b> — ${c.organization} (${c.date})</li>`;
    });
    docxContent += `</ul>`;
  }

  docxContent += `</body></html>`;

  // Download blob
  const blob = new Blob(['\ufeff', docxContent], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.docx') ? fileName : `${fileName}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
