import { NextRequest, NextResponse } from "next/server";
import { getAllEmails } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
    // Vérifier l'authentification
    const authError = await requireAuth(request);
    if (authError) return authError;

    try {
        const entries = await getAllEmails();
        return NextResponse.json({ entries });
    } catch (error) {
        console.error("Admin fetch error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
