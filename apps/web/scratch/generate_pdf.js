const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outputPath = path.join(
  'C:',
  'Users',
  'sreya',
  '.gemini',
  'antigravity',
  'brain',
  '681ab065-8d3d-40e2-ad68-dbe2e9a6ce6f',
  'testing_kit.pdf'
);

console.log(`Generating detailed PDF handbook at: ${outputPath}`);

const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true });
const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

const colors = {
  primary: '#0B172A',
  accent: '#F97316',
  text: '#334155',
  lightGray: '#F8FAFC',
  border: '#E2E8F0',
  secondary: '#1E293B'
};

// Title Block
doc
  .fillColor(colors.primary)
  .font('Helvetica-Bold')
  .fontSize(18)
  .text('EpitomeTRC User Testing Handbook', { align: 'center' });

doc
  .fillColor(colors.accent)
  .font('Helvetica')
  .fontSize(11)
  .text('Complete Manual Testing Guide for Non-Technical Users', { align: 'center' })
  .text('Staging Target: https://epitometrc-web.vercel.app/', { align: 'center' })
  .moveDown(1.2);

doc
  .strokeColor(colors.border)
  .lineWidth(1)
  .moveTo(40, doc.y)
  .lineTo(555, doc.y)
  .stroke()
  .moveDown(1);

// Helper for Sections
function addSectionHeader(title) {
  doc
    .fillColor(colors.primary)
    .font('Helvetica-Bold')
    .fontSize(12)
    .text(title)
    .moveDown(0.4);
}

// Helper for Sub-sections
function addSubsectionHeader(title) {
  doc
    .fillColor(colors.accent)
    .font('Helvetica-Bold')
    .fontSize(10)
    .text(title)
    .moveDown(0.3);
}

// Helper for mapping pages
function addPageTarget(title, path, instructions, expected) {
  doc
    .fillColor(colors.primary)
    .font('Helvetica-Bold')
    .fontSize(9)
    .text(`• ${title} (https://epitometrc-web.vercel.app${path})`);

  doc
    .fillColor(colors.secondary)
    .font('Helvetica')
    .fontSize(8)
    .text(`  Test Steps: ${instructions}`, { lineGap: 1.5 })
    .fillColor(colors.text)
    .font('Helvetica-Oblique')
    .text(`  Expected Result: ${expected}`, { lineGap: 1.5 })
    .moveDown(0.4);
}

// ==========================================
// SECTION A: PUBLIC PAGES
// ==========================================
addSectionHeader('SECTION A: PUBLIC PAGE CHECKLISTS & TESTS');

addPageTarget(
  'Homepage',
  '/',
  'Open page, scroll to bottom. Click Find Job and Hire Talent.',
  'Homepage metrics load. Buttons route to /jobs and /recruitment.'
);
addPageTarget(
  'About Us',
  '/about',
  'Scroll to certifications list.',
  'Indore coordinates and ISO 9001 badge display.'
);
addPageTarget(
  'Services Index',
  '/services',
  'Click bento grid cards (Recruitment, Consulting).',
  'Pages load correctly.'
);
addPageTarget(
  'Recruitment & Staffing',
  '/recruitment',
  'Fill out staffing request form and click submit.',
  'Logs lead in CRM database timeline.'
);
addPageTarget(
  'Corporate Consulting',
  '/consulting',
  'Fill out IT advisory query.',
  'Logs consulting enquiry.'
);
addPageTarget(
  'Jobs Board',
  '/jobs',
  'Filter jobs, click apply, upload test PDF resume.',
  'Application status shifts to Applied.'
);
addPageTarget(
  'Contact Us',
  '/contact',
  'Submit query (name, email, message).',
  'Enquiry is logged, confirmation email alert triggered.'
);

doc.addPage();

// ==========================================
// SECTION B: SIGN-IN, REGISTRATION & MFA
// ==========================================
addSectionHeader('SECTION B: SIGN-IN, REGISTRATION & MFA');

addPageTarget(
  'Sign-Up Gate',
  '/register',
  'Create Student profile using strong password. Try Employee role with gmail domain.',
  'Student sign up succeeds. Staff role with generic Gmail is blocked.'
);
addPageTarget(
  'Sign-In Gate',
  '/login',
  'Sign in with registered credentials. Try logging in using Google account.',
  'Redirects to Student Dashboard page.'
);
addPageTarget(
  'Forgot Password',
  '/forgot-password',
  'Enter email to request password reset link.',
  'Reset email dispatch logged in DB.'
);

doc.addPage();

// ==========================================
// SECTION C: STUDENT PORTAL (CANDIDATE SUITE)
// ==========================================
addSectionHeader('SECTION C: STUDENT PORTAL (CANDIDATE SUITE)');

addPageTarget(
  'Student Profile',
  '/student/profile',
  'Add skills (React), education history, and experience.',
  'Saves updates, completeness gauge updates.'
);
addPageTarget(
  'Video CV Portal',
  '/student/video-resume',
  'Upload short video introduction.',
  'Video saves to profile.'
);
addPageTarget(
  'ATS Resume Builder',
  '/student/resume-builder',
  'Upload resume PDF, match against strategic analyst.',
  'Match score card appears with score explanation.'
);
addPageTarget(
  'AI Mock Interview',
  '/student/career-suite',
  'Start mock interview, voice responses, click submit.',
  'Scorecard displays grammar and filler word stats.'
);
addPageTarget(
  'Course Learn View',
  '/student/courses/1/learn',
  '1. Mark lesson complete. 2. Ask AI Course Coach. 3. Submit assignment. 4. Write notes. 5. Take quiz.',
  'Progress updates, AI coach answers, assignment logs save, quiz grades recorded.'
);
addPageTarget(
  'Certificates Locker',
  '/student/certificates',
  'Click download on earned course certificates.',
  'PDF certificate download triggers.'
);
addPageTarget(
  'Application Tracker',
  '/student/applications',
  'View history of job applications and recruitment status.',
  'Displays timeline status.'
);
addPageTarget(
  'Refresher Webinar',
  '/student/refresher-bridge',
  'Register live bridge mentor webinar session.',
  'Meeting schedules and Google Meet links display.'
);

doc.addPage();

// ==========================================
// SECTION D & E: STAFF & ADMIN
// ==========================================
addSectionHeader('SECTION D & E: EMPLOYEE & ADMIN PORTALS');

addSubsectionHeader('Employee Tasks:');
addPageTarget(
  'Recruiter Dashboard',
  '/employee/recruitment',
  'Click application. Open candidate summary, match applicant, click Approve.',
  'Application status shifts to Approved.'
);
addPageTarget(
  'Webinar Scheduler',
  '/employee/trainings',
  'Add live refresher session webinar coordinates.',
  'Session lists on student refresher portal.'
);

addSubsectionHeader('Admin Tasks:');
addPageTarget(
  'Analytics Hub',
  '/admin/analytics',
  'Review telemetry and error charts.',
  'Charts render correctly.'
);
addPageTarget(
  'Global Settings',
  '/admin/settings',
  'Toggle off AI Interviews feature flag. Update address.',
  'Interviews block hidden. Contact address updates.'
);

doc.moveDown(1);

// ==========================================
// REPORT FORMAT
// ==========================================
addSectionHeader('REPORT FORMAT FOR TESTERS');
doc
  .fillColor(colors.text)
  .font('Helvetica')
  .fontSize(8.5)
  .text('For each issue found, please write:', { lineGap: 3 })
  .text('  • Page/Feature Name: (e.g. Resume Builder)', { lineGap: 3 })
  .text('  • URL: (e.g. https://epitometrc-web.vercel.app/... )', { lineGap: 3 })
  .text('  • Issue Description: (Describe in simple terms)', { lineGap: 3 })
  .text('  • Steps to Reproduce: (Step-by-step actions clicked)', { lineGap: 3 })
  .text('  • Severity: (Critical / Major / Minor / Suggestion)', { lineGap: 3 })
  .moveDown(1);

// Footer Page Numbers
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(i);
  
  const oldAutoPageBreak = doc.options.autoPageBreak;
  doc.options.autoPageBreak = false;
  
  doc
    .fillColor('#94A3B8')
    .fontSize(8)
    .text(
      `Page ${i + 1} of ${range.count} | EpitomeTRC Agni Pariksha User Handbook`,
      40,
      doc.page.height - 30,
      { align: 'center', lineBreak: false }
    );
    
  doc.options.autoPageBreak = oldAutoPageBreak;
}

doc.end();
console.log('Comprehensive User PDF handbook generated successfully!');
