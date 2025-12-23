// Liste des domaines email jetables
const DISPOSABLE_DOMAINS = new Set([
    "tempmail.com", "temp-mail.org", "guerrillamail.com", "guerrillamail.org",
    "10minutemail.com", "10minutemail.net", "mailinator.com", "maildrop.cc",
    "yopmail.com", "yopmail.fr", "throwaway.email", "throwawaymail.com",
    "fakeinbox.com", "trashmail.com", "trashmail.net", "mailnesia.com",
    "tempinbox.com", "dispostable.com", "sharklasers.com", "getairmail.com",
    "mohmal.com", "getnada.com", "emailondeck.com", "mintemail.com",
    "discard.email", "mailsac.com", "mytemp.email", "tempr.email",
    "tmpmail.org", "tmpmail.net", "spamgourmet.com", "spamex.com", "spam4.me",
]);

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const VALID_TLDS = new Set([
    "com", "org", "net", "edu", "gov", "mil", "int",
    "fr", "de", "uk", "es", "it", "nl", "be", "ch", "at",
    "ca", "au", "jp", "cn", "kr", "br", "mx", "ru",
    "io", "co", "me", "tv", "info", "biz", "name", "pro",
    "dev", "app", "tech", "online", "site", "xyz", "club",
]);

export interface EmailValidationResult {
    valid: boolean;
    error?: string;
    sanitized?: string;
}

export function validateEmail(email: unknown): EmailValidationResult {
    if (!email || typeof email !== "string") {
        return { valid: false, error: "Email requis" };
    }

    const sanitized = email.toLowerCase().trim();

    if (sanitized.length < 5 || sanitized.length > 254) {
        return { valid: false, error: "Format d'email invalide" };
    }

    if (!EMAIL_REGEX.test(sanitized)) {
        return { valid: false, error: "Format d'email invalide" };
    }

    const parts = sanitized.split("@");
    if (parts.length !== 2) {
        return { valid: false, error: "Format d'email invalide" };
    }

    const [localPart, domain] = parts;

    if (localPart.length > 64) {
        return { valid: false, error: "Format d'email invalide" };
    }

    if (/[<>()\\,;:"\[\]]/.test(sanitized)) {
        return { valid: false, error: "Caractères non autorisés" };
    }

    const domainParts = domain.split(".");
    const tld = domainParts[domainParts.length - 1];

    if (!VALID_TLDS.has(tld)) {
        return { valid: false, error: "Domaine email invalide" };
    }

    if (DISPOSABLE_DOMAINS.has(domain)) {
        return { valid: false, error: "Les emails temporaires ne sont pas acceptés" };
    }

    if (domain.includes("temp") || domain.includes("fake") || domain.includes("trash") || domain.includes("spam")) {
        return { valid: false, error: "Les emails temporaires ne sont pas acceptés" };
    }

    return { valid: true, sanitized };
}
