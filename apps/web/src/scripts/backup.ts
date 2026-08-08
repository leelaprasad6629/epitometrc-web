import { prisma } from "../lib/prisma";
import fs from "fs/promises";
import path from "path";

async function backupDatabase() {
  console.log("=== Starting Database Backup ===");
  try {
    const backupData = {
      timestamp: new Date().toISOString(),
      users: await prisma.user.findMany(),
      profiles: await prisma.userProfile.findMany(),
      memberships: await prisma.userMembership.findMany(),
      auditLogs: await prisma.auditLog.findMany(),
      suggestions: await prisma.ideaSuggestion.findMany()
    };

    const backupDir = path.join(process.cwd(), "backups");
    await fs.mkdir(backupDir, { recursive: true });

    const filename = `backup_${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    const filepath = path.join(backupDir, filename);

    await fs.writeFile(filepath, JSON.stringify(backupData, null, 2), "utf-8");
    console.log(`Backup successfully saved to: ${filepath}`);
    console.log("=== Database Backup Finished ===");
  } catch (err) {
    console.error("Backup process failed:", err);
  }
}

backupDatabase();
