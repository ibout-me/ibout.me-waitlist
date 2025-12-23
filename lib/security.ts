import { NextResponse } from "next/server";

/**
 * Adds security headers to a response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
    // XSS protection
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");

    // Referrer policy
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    // Permissions policy
    response.headers.set(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=(), interest-cohort=()"
    );

    return response;
}

/**
 * Creates a secure JSON response
 */
export function secureJsonResponse(
    data: object,
    status: number = 200
): NextResponse {
    const response = NextResponse.json(data, { status });
    return addSecurityHeaders(response);
}

/**
 * Creates a secure error response
 */
export function secureErrorResponse(
    error: string,
    status: number = 400
): NextResponse {
    return secureJsonResponse({ error }, status);
}
