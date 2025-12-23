"use client";

import { useTranslations } from "next-intl";

interface WaitlistStatsProps {
    count: number;
}

export function WaitlistStats({ count }: WaitlistStatsProps) {
    const t = useTranslations();

    if (count <= 0) return null;

    return (
        <section
            className="mt-6 flex items-center gap-2 sm:mt-8 sm:gap-3"
            aria-label={t("a11y.waitlistStats")}
        >
            <div className="flex -space-x-2" aria-hidden="true">
                {["A", "M", "S", "J"]
                    .slice(0, Math.min(4, count))
                    .map((letter, i) => (
                        <div
                            key={i}
                            className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-zinc-900 bg-zinc-800 text-[10px] font-medium text-zinc-400 sm:h-8 sm:w-8 sm:text-xs"
                        >
                            {letter}
                        </div>
                    ))}
            </div>
            <p className="text-xs text-zinc-500 sm:text-sm">
                <span className="font-medium text-zinc-300">+{count}</span>{" "}
                {count > 1 ? t("stats.people") : t("stats.person")}
            </p>
        </section>
    );
}
