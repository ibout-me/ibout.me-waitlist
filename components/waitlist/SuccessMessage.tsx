"use client";

import { useTranslations } from "next-intl";

interface SuccessMessageProps {
    message: string;
    onReset: () => void;
}

export function SuccessMessage({ message, onReset }: SuccessMessageProps) {
    const t = useTranslations();

    return (
        <div
            className="py-4 text-center sm:py-6"
            role="status"
            aria-live="polite"
        >
            <div
                className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 sm:mb-4 sm:h-14 sm:w-14"
                aria-hidden="true"
            >
                <svg
                    className="h-6 w-6 text-emerald-400 sm:h-7 sm:w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>
            <h2 className="font-display text-lg font-semibold text-white sm:text-xl">
                {t("success.title")}
            </h2>
            <p className="mt-2 text-sm text-zinc-400 sm:text-base">{message}</p>
            <button
                onClick={onReset}
                className="mt-4 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900 sm:mt-6"
            >
                {t("success.another")}
            </button>
        </div>
    );
}
