export interface MembershipPlan {
  name: string;
  price: string;
  priceValue: number; // For future payment routing
  period: string;
  mockInterviewLimit: number; // -1 for unlimited
  resumeOptimizationLimit: number; // -1 for unlimited
  features: string[];
  restrictions: string[];
  recommended?: boolean;
  status: "Active" | "Coming Soon";
}

// TOGGLE THIS FLAG TO SHOW ACTUAL PROPOSED PRICES OR KEEP PLACEHOLDERS
export const SHOW_PRICES = false;

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    name: "Free Plan",
    price: "₹0",
    priceValue: 0,
    period: "Forever",
    mockInterviewLimit: 1,
    resumeOptimizationLimit: 1,
    features: [
      "1 Resume & 1 ATS Scan",
      "Resume Download & AI Suggestions",
      "Career Roadmap & Job Search",
      "Community Access",
      "1 Free AI Mock Interview"
    ],
    restrictions: [
      "2nd+ Mock Interviews locked",
      "Premium templates locked",
      "Company-specific interviews locked",
      "Advanced analytics locked"
    ],
    status: "Active"
  },
  {
    name: "Career Premium",
    price: SHOW_PRICES ? "₹999" : "₹XX",
    priceValue: 999,
    period: "month",
    mockInterviewLimit: 10,
    resumeOptimizationLimit: -1,
    features: [
      "Unlimited Resume Builder & ATS Checks",
      "Premium Templates & Resume Tailoring",
      "Resume Score Improvement & Cover Letter",
      "LinkedIn Optimization",
      "10 AI Mock Interviews/mo (HR & Basic Tech)",
      "Interview Reports & Email Support"
    ],
    restrictions: [
      "Capped at 10 AI interviews/mo",
      "Standard support tier"
    ],
    status: "Active"
  },
  {
    name: "Career Professional",
    price: SHOW_PRICES ? "₹2,499" : "₹XX",
    priceValue: 2499,
    period: "month",
    mockInterviewLimit: 30,
    resumeOptimizationLimit: -1,
    features: [
      "Everything in Premium +",
      "30 AI Mock Interviews/mo (Inc. Company-Specific)",
      "JD-based Resume Customization",
      "AI Career Coach, Communication & Voice Analysis",
      "STAR Answer Evaluation & Placement Dashboard",
      "Priority AI Processing & Support"
    ],
    restrictions: [
      "Capped at 30 AI interviews/mo",
      "Optimal for active job seekers"
    ],
    recommended: true,
    status: "Active"
  },
  {
    name: "Career Elite",
    price: SHOW_PRICES ? "₹4,999" : "₹XX",
    priceValue: 4999,
    period: "month",
    mockInterviewLimit: -1,
    resumeOptimizationLimit: -1,
    features: [
      "Everything in Professional +",
      "Unlimited AI Mock Interviews & ATS Checks",
      "Personal AI Mentor & Highest AI Priority",
      "Leadership, HR, Tech & Managerial Prep",
      "Behavioural Prep & Executive Resume Builder",
      "Salary Negotiation AI & AI Placement Strategy"
    ],
    restrictions: [
      "Unrestricted All-Access Tier"
    ],
    status: "Active"
  }
];

export function getPlanByName(name: string): MembershipPlan {
  const plan = MEMBERSHIP_PLANS.find(p => p.name.toLowerCase() === name.toLowerCase());
  return plan || MEMBERSHIP_PLANS[0];
}
