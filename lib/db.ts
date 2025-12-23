import prisma from "./prisma";

export interface WaitlistEntry {
    id: number;
    email: string;
    created_at: string;
    notified_at: string | null;
}

// Helper pour convertir le format Prisma vers le format attendu par l'app
function toWaitlistEntry(entry: {
    id: number;
    email: string;
    createdAt: Date;
    notifiedAt: Date | null;
}): WaitlistEntry {
    return {
        id: entry.id,
        email: entry.email,
        created_at: entry.createdAt.toISOString(),
        notified_at: entry.notifiedAt?.toISOString() ?? null,
    };
}

export async function addEmail(
    email: string
): Promise<{ success: boolean; error?: string }> {
    const normalized = email.toLowerCase().trim();

    try {
        await prisma.waitlistEntry.create({
            data: { email: normalized },
        });
        return { success: true };
    } catch (error: unknown) {
        // Prisma unique constraint violation
        if (
            error &&
            typeof error === "object" &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return { success: false, error: "Cet email est déjà inscrit" };
        }
        console.error("Database error:", error);
        throw error;
    }
}

export async function getCount(): Promise<number> {
    return prisma.waitlistEntry.count();
}

export async function getAllEmails(): Promise<WaitlistEntry[]> {
    const entries = await prisma.waitlistEntry.findMany({
        orderBy: { createdAt: "desc" },
    });
    return entries.map(toWaitlistEntry);
}

export async function getUnnotifiedEmails(): Promise<WaitlistEntry[]> {
    const entries = await prisma.waitlistEntry.findMany({
        where: { notifiedAt: null },
        orderBy: { createdAt: "asc" },
    });
    return entries.map(toWaitlistEntry);
}

export async function markAsNotified(ids: number[]): Promise<void> {
    await prisma.waitlistEntry.updateMany({
        where: { id: { in: ids } },
        data: { notifiedAt: new Date() },
    });
}

export async function exportToCsv(): Promise<string> {
    const entries = await getAllEmails();
    const header = "id,email,created_at,notified_at\n";
    const rows = entries
        .map(
            (e) =>
                `${e.id},"${e.email}","${e.created_at}","${e.notified_at || ""}"`
        )
        .join("\n");
    return header + rows;
}
