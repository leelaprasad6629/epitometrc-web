import { prisma } from "@/lib/prisma";

export async function createRecordVersion(
  recordId: string,
  recordType: string,
  userId: string | null,
  changeSummary: string,
  snapshot: any
) {
  try {
    // Find the latest version for this record
    const latest = await prisma.recordVersion.findFirst({
      where: { recordId, recordType },
      orderBy: { createdAt: "desc" },
    });

    let nextVersion = "v1.0";
    if (latest) {
      const match = latest.version.match(/v(\d+)\.(\d+)/);
      if (match) {
        const major = parseInt(match[1], 10);
        const minor = parseInt(match[2], 10);
        nextVersion = `v${major}.${minor + 1}`;
      }
    }

    const versionRecord = await prisma.recordVersion.create({
      data: {
        recordId,
        recordType,
        version: nextVersion,
        userId,
        changeSummary,
        snapshot: JSON.stringify(snapshot),
      },
    });

    return versionRecord;
  } catch (error) {
    console.error("Error creating record version audit log:", error);
    return null;
  }
}
