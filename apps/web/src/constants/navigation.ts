export type NavLink = {
  name: string;
  href: string;
};

export type NavItemWithDropdown = {
  name: string;
  href: string;
  children?: NavLink[];
};

export const mainNavItems: NavItemWithDropdown[] = [
  { name: "Home", href: "/" },
  {
    name: "Services",
    href: "/services",
    children: [
      { name: "Recruitment", href: "/services#recruitment" },
      { name: "Staffing", href: "/services#staffing" },
      { name: "Consulting", href: "/consulting" },
      { name: "Corporate Training", href: "/training" },
      { name: "Technology Solutions", href: "/services#it-services" },
    ],
  },
  { name: "Training", href: "/training" },
  { name: "Consulting", href: "/consulting" },
  {
    name: "Courses",
    href: "/courses",
    children: [
      { name: "Technical Courses", href: "/courses#technical" },
      { name: "Soft Skills", href: "/courses#soft-skills" },
      { name: "Certifications", href: "/certifications" },
      { name: "Workshops", href: "/courses#workshops" },
    ],
  },
  {
    name: "Career",
    href: "/careers",
    children: [
      { name: "Jobs", href: "/jobs" },
      { name: "Internships", href: "/internships" },
      { name: "Placement Assistance", href: "/careers#placement" },
      { name: "Resume Building", href: "/careers#resume" },
    ],
  },
  { name: "Jobs", href: "/jobs" },
  { name: "Internships", href: "/internships" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export const footerServicesLinks: NavLink[] = [
  { name: "Business Consulting", href: "/consulting" },
  { name: "Recruitment", href: "/services#recruitment" },
  { name: "IT Services", href: "/services#it-services" },
  { name: "Training & Internships", href: "/training" },
  { name: "College Collaboration", href: "/services#college" },
];

export const footerCompanyLinks: NavLink[] = [
  { name: "About Us", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/contact#privacy" },
];

export const footerProgramsLinks: NavLink[] = [
  { name: "Technical Courses", href: "/courses" },
  { name: "Certifications", href: "/certifications" },
  { name: "Internships", href: "/internships" },
  { name: "Jobs", href: "/jobs" },
];
