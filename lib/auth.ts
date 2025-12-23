import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 heures

/**
 * Génère un token de session simple (hash du secret + timestamp)
 */
function generateSessionToken(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return `${timestamp}.${random}`;
}

/**
 * Vérifie si le secret fourni est correct
 */
export function verifySecret(secret: string): boolean {
    return secret === process.env.ADMIN_SECRET;
}

/**
 * Crée une session admin (set cookie)
 */
export async function createSession(): Promise<string> {
    const token = generateSessionToken();
    const cookieStore = await cookies();
    
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
    });
    
    return token;
}

/**
 * Vérifie si une session admin existe
 */
export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const session = cookieStore.get(COOKIE_NAME);
    return !!session?.value;
}

/**
 * Supprime la session admin
 */
export async function destroySession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

/**
 * Middleware helper pour vérifier l'auth sur les routes API
 */
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
    const sessionCookie = request.cookies.get(COOKIE_NAME);
    
    if (!sessionCookie?.value) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    
    return null; // Auth OK
}
