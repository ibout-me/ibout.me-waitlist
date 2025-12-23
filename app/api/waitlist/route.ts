import { NextRequest, NextResponse } from "next/server";
import { addEmail, getCount } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { validateEmail } from "@/lib/emailValidation";

const SUBMIT_LIMIT = 3;
const SUBMIT_WINDOW = 60000;
const READ_LIMIT = 30;
const READ_WINDOW = 60000;

export async function POST(request: NextRequest) {
    try {
        const ip = getClientIp(request);
        const { allowed, remaining, resetIn } = rateLimit(ip, SUBMIT_LIMIT, SUBMIT_WINDOW);

        if (!allowed) {
            return NextResponse.json(
                { error: "Trop de requêtes. Réessayez plus tard." },
                { 
                    status: 429,
                    headers: { "Retry-After": String(Math.ceil(resetIn / 1000)) }
                }
            );
        }

        const contentLength = request.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > 1024) {
            return NextResponse.json({ error: "Requête trop volumineuse" }, { status: 413 });
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
        }

        const validation = validateEmail(body.email);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const result = await addEmail(validation.sanitized!);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 409 });
        }

        return NextResponse.json(
            { message: "Vous êtes inscrit ! Nous vous contacterons bientôt." },
            { 
                status: 201,
                headers: { "X-RateLimit-Remaining": String(remaining) }
            }
        );
    } catch (error) {
        console.error("Waitlist error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const ip = getClientIp(request);
        const { allowed } = rateLimit(`${ip}:read`, READ_LIMIT, READ_WINDOW);

        if (!allowed) {
            return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
        }

        return NextResponse.json({ count: await getCount() });
    } catch (error) {
        console.error("Waitlist count error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
