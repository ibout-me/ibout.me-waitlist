import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const dashboardPath = process.env.DASHBOARD_PATH;

    // Si l'utilisateur accède au chemin secret, rediriger vers /dashboard
    if (dashboardPath && pathname === `/${dashboardPath}`) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.rewrite(url);
    }

    // Bloquer l'accès direct à /admin et /dashboard
    if (
        pathname === "/admin" ||
        pathname.startsWith("/admin/") ||
        pathname === "/dashboard" ||
        pathname.startsWith("/dashboard/")
    ) {
        return NextResponse.rewrite(new URL("/not-found", request.url));
    }

    // Bloquer les API admin/dashboard en accès direct
    if (
        pathname.startsWith("/api/admin") ||
        pathname.startsWith("/api/dashboard")
    ) {
        const referer = request.headers.get("referer") || "";
        const isFromSecretPath =
            dashboardPath && referer.includes(`/${dashboardPath}`);

        if (!isFromSecretPath) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.next();
    }

    // Pour toutes les autres routes, utiliser le middleware i18n
    return intlMiddleware(request);
}

export const config = {
    matcher: [
        // Routes admin/dashboard
        "/admin/:path*",
        "/dashboard/:path*",
        "/api/admin/:path*",
        "/api/dashboard/:path*",
        // Routes i18n (exclure api, _next, fichiers statiques)
        "/((?!api|_next|_vercel|.*\\..*).*)",
    ],
};
