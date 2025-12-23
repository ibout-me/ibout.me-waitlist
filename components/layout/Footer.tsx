"use client";

import { useTranslations } from "next-intl";

export function Footer() {
    const t = useTranslations();

    return (
        <footer className="mt-12 text-center text-[10px] text-zinc-600 sm:mt-16 sm:text-xs">
            <p>{t("footer.consent")}</p>
            <p className="mt-1">
                &copy; {new Date().getFullYear()} ibout.me –{" "}
                <a
                    href="https://jessy-david.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded text-zinc-500 transition-colors hover:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                >
                    Jessy DAVID
                    <span className="sr-only">
                        {" "}
                        ({t("a11y.opensNewWindow")})
                    </span>
                </a>
                {" & "}
                <a
                    href="https://philippe-gaulin.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded text-zinc-500 transition-colors hover:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                >
                    Philippe GAULIN
                    <span className="sr-only">
                        {" "}
                        ({t("a11y.opensNewWindow")})
                    </span>
                </a>
            </p>
        </footer>
    );
}
