"use client";

import { useTranslations } from "next-intl";
import { useId } from "react";

interface WaitlistFormProps {
    email: string;
    setEmail: (email: string) => void;
    status: "idle" | "loading" | "error";
    message: string;
    onSubmit: (e: React.FormEvent) => void;
}

export function WaitlistForm({
    email,
    setEmail,
    status,
    message,
    onSubmit,
}: WaitlistFormProps) {
    const t = useTranslations();
    const emailId = useId();
    const errorId = useId();

    return (
        <>
            <div className="mb-4 text-center sm:mb-6">
                <h2
                    id="form-title"
                    className="font-display text-lg font-semibold text-white sm:text-xl"
                >
                    {t("form.title")}
                </h2>
                <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                    {t("form.subtitle")}
                </p>
            </div>

            <form
                onSubmit={onSubmit}
                className="space-y-3 sm:space-y-4"
                noValidate
            >
                <div>
                    <label htmlFor={emailId} className="sr-only">
                        {t("form.emailLabel")}
                    </label>
                    <input
                        type="email"
                        id={emailId}
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("form.placeholder")}
                        required
                        autoComplete="email"
                        aria-required="true"
                        aria-invalid={status === "error"}
                        aria-describedby={
                            status === "error" ? errorId : undefined
                        }
                        className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/50 px-3 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 sm:px-4 sm:py-3.5 sm:text-base"
                    />
                </div>

                {status === "error" && (
                    <p
                        id={errorId}
                        className="text-xs text-red-400 sm:text-sm"
                        role="alert"
                        aria-live="assertive"
                    >
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={status === "loading"}
                    aria-busy={status === "loading"}
                    className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-medium text-white transition-all hover:from-violet-500 hover:to-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5 sm:text-base"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {status === "loading" ? (
                            <>
                                <svg
                                    className="h-4 w-4 animate-spin sm:h-5 sm:w-5"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span>{t("form.submitting")}</span>
                            </>
                        ) : (
                            <>
                                <span>{t("form.submit")}</span>
                                <svg
                                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </>
                        )}
                    </span>
                </button>

                <p className="text-center text-xs text-zinc-500 sm:text-sm">
                    {t("form.discordCta")}{" "}
                    <a
                        href="https://discord.gg/xz6YX5RM3H"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded text-violet-500 underline underline-offset-2 transition-colors hover:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                    >
                        {t("form.discordLink")}
                        <span className="sr-only">
                            {" "}
                            ({t("a11y.opensNewWindow")})
                        </span>
                    </a>
                    .
                </p>
            </form>
        </>
    );
}
