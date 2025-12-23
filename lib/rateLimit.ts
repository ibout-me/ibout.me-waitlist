type RateLimitRecord = {
    count: number;
    timestamp: number;
};

const requests = new Map<string, RateLimitRecord>();

// Nettoyage périodique des anciennes entrées
if (typeof setInterval !== "undefined") {
    setInterval(() => {
        const now = Date.now();
        for (const [key, record] of requests.entries()) {
            if (now - record.timestamp > 3600000) {
                requests.delete(key);
            }
        }
    }, 60000);
}

/**
 * Rate limiter simple en mémoire
 */
export function rateLimit(
    identifier: string,
    limit: number = 5,
    windowMs: number = 60000
): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const record = requests.get(identifier);

    if (!record || now - record.timestamp > windowMs) {
        requests.set(identifier, { count: 1, timestamp: now });
        return { allowed: true, remaining: limit - 1, resetIn: windowMs };
    }

    if (record.count >= limit) {
        const resetIn = windowMs - (now - record.timestamp);
        return { allowed: false, remaining: 0, resetIn };
    }

    record.count++;
    return {
        allowed: true,
        remaining: limit - record.count,
        resetIn: windowMs - (now - record.timestamp),
    };
}

/**
 * Obtenir l'IP du client depuis les headers
 */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    const realIp = request.headers.get("x-real-ip");
    if (realIp) {
        return realIp;
    }
    return "unknown";
}
