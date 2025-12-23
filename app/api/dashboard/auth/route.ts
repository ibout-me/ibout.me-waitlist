import { NextRequest, NextResponse } from "next/server";
import { verifySecret, createSession, destroySession, isAuthenticated } from "@/lib/auth";

// POST /api/dashboard/auth - Login
export async function POST(request: NextRequest) {
    try {
        const { secret } = await request.json();

        if (!secret || typeof secret !== "string") {
            return NextResponse.json({ error: "Secret requis" }, { status: 400 });
        }

        if (!verifySecret(secret)) {
            // Délai pour éviter le bruteforce
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return NextResponse.json({ error: "Secret incorrect" }, { status: 401 });
        }

        await createSession();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// GET /api/dashboard/auth - Check session
export async function GET() {
    try {
        const authenticated = await isAuthenticated();
        return NextResponse.json({ authenticated });
    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json({ authenticated: false });
    }
}

// DELETE /api/dashboard/auth - Logout
export async function DELETE() {
    try {
        await destroySession();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
