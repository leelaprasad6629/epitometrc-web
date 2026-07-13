import { PageContext } from "../types";

export function buildPageContextString(context: PageContext): string {
  const { pathname, role, data } = context;
  let detailStr = "";

  if (data) {
    detailStr = `Current Target Data: ${JSON.stringify(data)}\n`;
  }

  let routeDesc = `The user is browsing the route: ${pathname}.\n`;

  if (pathname.includes("/admin")) {
    routeDesc += "User Role: Administrator. Access: Full system settings and overview metrics.\n";
  } else if (pathname.includes("/employee")) {
    routeDesc += "User Role: Employee / Hiring Manager / Advisor. Access: Attendance, recruitment boards, and learning cohorts.\n";
  } else if (pathname.includes("/student")) {
    routeDesc += "User Role: Student. Access: My courses, dashboard, applications, certifications, and live mentor calls.\n";
  } else {
    routeDesc += `User Role: Public Visitor.\n`;
  }

  // Customize specific page info
  if (pathname === "/") {
    routeDesc += "The user is on the Homepage looking at hero highlights, about reviews, and featured courses.\n";
  } else if (pathname.startsWith("/blog")) {
    routeDesc += "The user is browsing technical blogs. If reading an article, discuss layout scalability or software engineering trends.\n";
  } else if (pathname.startsWith("/jobs") || pathname.startsWith("/careers")) {
    routeDesc += "The user is reviewing current open employment roles at EpitomeTRC.\n";
  }

  return `
[CURRENT CONTEXT]
${routeDesc}
${detailStr}
`.trim();
}
