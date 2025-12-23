"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SuccessMessage } from "@/components/waitlist/SuccessMessage";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { WaitlistStats } from "@/components/waitlist/WaitlistStats";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function WaitlistPage() {
    const t = useTranslations();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");
    const [message, setMessage] = useState("");
    const [count, setCount] = useState(0);

    useEffect(() => {
        fetch("/api/waitlist")
            .then((res) => res.json())
            .then((data) => setCount(data.count || 0))
            .catch(() => {});
    }, [status]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const response = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage(t("success.message"));
                setEmail("");
            } else {
                setStatus("error");
                if (data.error === "Email requis") {
                    setMessage(t("errors.required"));
                } else if (data.error === "Format d'email invalide") {
                    setMessage(t("errors.invalid"));
                } else if (data.error === "Cet email est déjà inscrit") {
                    setMessage(t("errors.duplicate"));
                } else {
                    setMessage(t("errors.server"));
                }
            }
        } catch {
            setStatus("error");
            setMessage(t("errors.server"));
        }
    };

    return (
        <>
            <BackgroundEffects />

            <div className="fixed right-3 top-3 z-50 sm:right-4 sm:top-4">
                <LanguageSwitcher />
            </div>

            <main
                id="main-content"
                className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
                role="main"
            >
                <Header />

                {/* Hero section */}
                <section
                    className="mb-8 text-center sm:mb-12"
                    aria-labelledby="hero-title"
                >
                    <h1
                        id="hero-title"
                        className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
                    >
                        {t("hero.title")}{" "}
                        <span className="linear-text">
                            {t("hero.titleHighlight")}
                        </span>
                    </h1>
                    <p className="mx-auto mt-3 max-w-xs text-base text-zinc-400 sm:mt-4 sm:max-w-md sm:text-lg">
                        {t("hero.description")}
                    </p>
                </section>

                {/* Main card */}
                <section
                    className="ibout-card w-full max-w-[calc(100vw-2rem)] sm:max-w-md"
                    aria-labelledby="form-title"
                >
                    <div className="ibout-glow" aria-hidden="true" />
                    <div className="ibout-card-inner">
                        {status === "success" ? (
                            <SuccessMessage
                                message={message}
                                onReset={() => setStatus("idle")}
                            />
                        ) : (
                            <WaitlistForm
                                email={email}
                                setEmail={setEmail}
                                status={status}
                                message={message}
                                onSubmit={handleSubmit}
                            />
                        )}
                    </div>
                </section>

                <WaitlistStats count={count} />
                <Footer />
            </main>
        </>
    );
}
