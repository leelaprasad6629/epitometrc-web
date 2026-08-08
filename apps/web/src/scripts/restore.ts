import { prisma } from "../lib/prisma";
import fs from "fs/promises";
import path from "path";

async function restoreDatabase() {
  const args = process.argv.slice(2);
  const backupFile = args[0];

  if (!backupFile) {
    console.error("Please specify the path to the backup JSON file (e.g. npx tsx restore.ts backups/backup_xxxx.json)");
    process.exit(1);
  }

  console.log(`=== Starting Database Restore from ${backupFile} ===`);
  try {
    const rawData = await fs.readFile(path.resolve(backupFile), "utf-8");
    const data = JSON.parse(rawData);

    console.log(`Backup Timestamp: ${data.timestamp}`);

    // 1. Restore Users
    console.log(`Restoring ${data.users?.length || 0} users...`);
    for (const u of data.users || []) {
      await prisma.user.upsert({
        where: { id: u.id },
        update: {
          name: u.name,
          email: u.email,
          contactNumber: u.contactNumber,
          passwordHash: u.passwordHash,
          role: u.role,
          status: u.status,
          requirePasswordChange: u.requirePasswordChange,
          policyAccepted: u.policyAccepted,
          policyAcceptedAt: u.policyAcceptedAt ? new Date(u.policyAcceptedAt) : null,
          policyVersion: u.policyVersion,
          tokenVersion: u.tokenVersion,
          createdAt: new Date(u.createdAt)
        },
        create: {
          id: u.id,
          name: u.name,
          email: u.email,
          contactNumber: u.contactNumber,
          passwordHash: u.passwordHash,
          role: u.role,
          status: u.status,
          requirePasswordChange: u.requirePasswordChange,
          policyAccepted: u.policyAccepted,
          policyAcceptedAt: u.policyAcceptedAt ? new Date(u.policyAcceptedAt) : null,
          policyVersion: u.policyVersion,
          tokenVersion: u.tokenVersion,
          createdAt: new Date(u.createdAt)
        }
      });
    }

    // 2. Restore UserProfiles
    console.log(`Restoring ${data.profiles?.length || 0} user profiles...`);
    for (const p of data.profiles || []) {
      await prisma.userProfile.upsert({
        where: { id: p.id },
        update: {
          userId: p.userId,
          profile: p.profile || {}
        },
        create: {
          id: p.id,
          userId: p.userId,
          profile: p.profile || {}
        }
      });
    }

    // 3. Restore UserMemberships
    console.log(`Restoring ${data.memberships?.length || 0} memberships...`);
    for (const m of data.memberships || []) {
      await prisma.userMembership.upsert({
        where: { id: m.id },
        update: {
          userId: m.userId,
          planName: m.planName,
          status: m.status,
          validUntil: m.validUntil ? new Date(m.validUntil) : null,
          mockInterviewsUsed: m.mockInterviewsUsed,
          resumesOptimizedUsed: m.resumesOptimizedUsed,
          createdAt: new Date(m.createdAt),
          updatedAt: new Date(m.updatedAt)
        },
        create: {
          id: m.id,
          userId: m.userId,
          planName: m.planName,
          status: m.status,
          validUntil: m.validUntil ? new Date(m.validUntil) : null,
          mockInterviewsUsed: m.mockInterviewsUsed,
          resumesOptimizedUsed: m.resumesOptimizedUsed,
          createdAt: new Date(m.createdAt),
          updatedAt: new Date(m.updatedAt)
        }
      });
    }

    // 4. Restore AuditLogs
    console.log(`Restoring ${data.auditLogs?.length || 0} audit logs...`);
    for (const log of data.auditLogs || []) {
      const exists = await prisma.auditLog.findUnique({
        where: { id: log.id }
      });
      if (!exists) {
        await prisma.auditLog.create({
          data: {
            id: log.id,
            userId: log.userId,
            userEmail: log.userEmail,
            action: log.action,
            details: log.details,
            ipAddress: log.ipAddress,
            createdAt: new Date(log.createdAt)
          }
        });
      }
    }

    console.log("=== Database Restore Completed Successfully ===");
  } catch (err) {
    console.error("Restore process failed:", err);
  }
}

restoreDatabase();
