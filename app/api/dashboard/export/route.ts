import { NextRequest, NextResponse } from "next/server";
import { exportToCsv } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
    // Vérifier l'authentification
    const authError = await requireAuth(request);
    if (authError) return authError;

    try {
        const csv = await exportToCsv();
        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="waitlist-${new Date().toISOString().split("T")[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error("Export error:", error);
        return NextResponse.json({ error: "Erreur export" }, { status: 500 });
    }
}
