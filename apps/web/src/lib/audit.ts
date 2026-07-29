import { prisma } from "./prisma";

export async function logAuditAction(
  userId: string,
  email: string,
  action: string,
  details: any,
  ipAddress?: string | null
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        userEmail: email,
        action,
        details: JSON.stringify(details),
        ipAddress: ipAddress || null,
      },
    });
  } catch (err) {
    console.error("Failed to write administrative audit log:", err);
  }
}
