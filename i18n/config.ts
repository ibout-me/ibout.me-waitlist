export const locales = ["fr", "en", "es", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
    fr: "Français",
    en: "English",
    es: "Español",
    de: "Deutsch",
};

export const localeFlags: Record<Locale, string> = {
    fr: "🇫🇷",
    en: "🇬🇧",
    es: "🇪🇸",
    de: "🇩🇪",
};
