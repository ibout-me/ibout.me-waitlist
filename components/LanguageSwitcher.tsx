"use client";

import { localeFlags, localeNames, locales, type Locale } from "@/i18n/config";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";

export function LanguageSwitcher() {
    const locale = useLocale() as Locale;
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                className="flex items-center gap-2 rounded-xl border border-zinc-700/50 bg-zinc-800/80 px-3 py-2 text-sm text-zinc-300 backdrop-blur-sm transition-all hover:border-zinc-600 hover:bg-zinc-700/80 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
                <span aria-hidden="true">{localeFlags[locale]}</span>
                <span className="hidden sm:inline">{localeNames[locale]}</span>
                <svg
                    className={`h-4 w-4 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <ul
                        role="listbox"
                        aria-label="Sélectionner une langue"
                        className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-800/95 shadow-xl backdrop-blur-sm"
                    >
                        {locales.map((loc) => (
                            <li
                                key={loc}
                                role="option"
                                aria-selected={loc === locale}
                            >
                                <Link
                                    href={pathname}
                                    locale={loc}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-zinc-700/50 ${
                                        loc === locale
                                            ? "bg-violet-500/10 text-violet-400"
                                            : "text-zinc-300"
                                    }`}
                                >
                                    <span aria-hidden="true">
                                        {localeFlags[loc]}
                                    </span>
                                    <span>{localeNames[loc]}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
