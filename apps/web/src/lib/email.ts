import nodemailer from "nodemailer";

const host = process.env.EMAIL_SERVER_HOST || "smtp.resend.com";
const port = parseInt(process.env.EMAIL_SERVER_PORT || "587");
const user = process.env.EMAIL_SERVER_USER || "resend";
const pass = process.env.EMAIL_SERVER_PASSWORD || "";
const from = process.env.EMAIL_FROM || "noreply@epitometrc.com";

export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text: string; html?: string }) {
  console.log(`[Email Service] Attempting to send email to: ${to}, Subject: ${subject}`);
  
  if (pass === "placeholder_smtp_api_key" || !pass) {
    console.warn(`[Email Service] SMTP password is default placeholder. Logging email body to console:\nSubject: ${subject}\nBody: ${text}`);
    return {
      success: true,
      delivered: false,
      message: "SMTP configuration is using placeholder credentials. Email logged to server console.",
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });

  const info = await transporter.sendMail({
    from: `"EpitomeTRC Recruiter" <${from}>`,
    to,
    subject,
    text,
    html: html || text.replace(/\n/g, "<br/>"),
  });

  console.log(`[Email Service] Email sent successfully. MessageId: ${info.messageId}`);
  return {
    success: true,
    delivered: true,
    messageId: info.messageId,
  };
}
