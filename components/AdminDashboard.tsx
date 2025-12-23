"use client";

import { useEffect, useState } from "react";

interface WaitlistEntry {
    id: number;
    email: string;
    created_at: string;
    notified_at: string | null;
}

export default function AdminDashboard() {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const [secret, setSecret] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [entries, setEntries] = useState<WaitlistEntry[]>([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [copySuccess, setCopySuccess] = useState(false);
    const [selectedEntries, setSelectedEntries] = useState<Set<number>>(
        new Set()
    );
    const [notifying, setNotifying] = useState(false);
    const [notifyResult, setNotifyResult] = useState<{
        sent?: number;
        total?: number;
        error?: string;
    } | null>(null);

    // Vérifier si déjà connecté
    useEffect(() => {
        fetch("/api/dashboard/auth")
            .then((res) => res.json())
            .then((data) => setAuthenticated(data.authenticated))
            .catch(() => setAuthenticated(false));
    }, []);

    // Charger les données si connecté
    useEffect(() => {
        if (authenticated) {
            loadEntries();
        }
    }, [authenticated]);

    const loadEntries = async () => {
        setDataLoading(true);
        try {
            const res = await fetch("/api/dashboard/waitlist");
            const data = await res.json();
            setEntries(data.entries || []);
        } catch {
            // Erreur silencieuse
        } finally {
            setDataLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/dashboard/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ secret }),
            });

            if (res.ok) {
                setAuthenticated(true);
                setSecret("");
            } else {
                const data = await res.json();
                setError(data.error || "Erreur de connexion");
            }
        } catch {
            setError("Erreur de connexion");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/dashboard/auth", { method: "DELETE" });
        setAuthenticated(false);
        setEntries([]);
    };

    const handleExport = async () => {
        const res = await fetch("/api/dashboard/export");
        if (res.ok) {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `waitlist-${
                new Date().toISOString().split("T")[0]
            }.csv`;
            a.click();
        }
    };

    const copyEmails = () => {
        const emailsToCopy =
            selectedEntries.size > 0
                ? entries
                      .filter((e) => selectedEntries.has(e.id))
                      .map((e) => e.email)
                : filteredEntries.map((e) => e.email);
        navigator.clipboard.writeText(emailsToCopy.join("\n"));
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const toggleSelectAll = () => {
        if (selectedEntries.size === filteredEntries.length) {
            setSelectedEntries(new Set());
        } else {
            setSelectedEntries(new Set(filteredEntries.map((e) => e.id)));
        }
    };

    const toggleSelect = (id: number) => {
        const newSelected = new Set(selectedEntries);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedEntries(newSelected);
    };

    const handleNotifyAll = async () => {
        const pendingCount = stats.total - stats.notified;
        if (
            !confirm(
                `Envoyer l'email de lancement à ${pendingCount} personne${
                    pendingCount > 1 ? "s" : ""
                } ?`
            )
        ) {
            return;
        }

        setNotifying(true);
        setNotifyResult(null);

        try {
            const res = await fetch("/api/dashboard/notify", {
                method: "POST",
            });
            const data = await res.json();

            if (res.ok) {
                setNotifyResult({ sent: data.sent, total: data.total });
                await loadEntries();
            } else {
                setNotifyResult({ error: data.error });
            }
        } catch {
            setNotifyResult({ error: "Erreur de connexion" });
        } finally {
            setNotifying(false);
        }
    };

    const handleDelete = async (ids: number[]) => {
        if (
            !confirm(
                `Supprimer ${ids.length} email${ids.length > 1 ? "s" : ""} ?`
            )
        ) {
            return;
        }

        try {
            const res = await fetch("/api/dashboard/waitlist", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids }),
            });

            if (res.ok) {
                setSelectedEntries(new Set());
                await loadEntries();
            }
        } catch {
            // Erreur silencieuse
        }
    };

    // Filtrer les entrées
    const filteredEntries = entries.filter((entry) =>
        entry.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Stats
    const stats = {
        total: entries.length,
        notified: entries.filter((e) => e.notified_at).length,
        today: entries.filter((e) => {
            const today = new Date().toDateString();
            return new Date(e.created_at).toDateString() === today;
        }).length,
        thisWeek: entries.filter((e) => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(e.created_at) >= weekAgo;
        }).length,
    };

    // Loading initial
    if (authenticated === null) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-950">
                <div className="flex items-center gap-3 text-zinc-400">
                    <svg
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    Chargement...
                </div>
            </main>
        );
    }

    // Login form
    if (!authenticated) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
                {/* Background effects */}
                <div
                    className="pointer-events-none fixed inset-0 overflow-hidden"
                    aria-hidden="true"
                >
                    <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
                    <div className="absolute -bottom-1/4 -right-1/4 h-80 w-80 rounded-full bg-fuchsia-600/10 blur-[120px]" />
                </div>

                <div className="relative w-full max-w-sm">
                    <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-8 backdrop-blur-sm">
                        <div className="mb-8 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
                                <svg
                                    className="h-7 w-7 text-violet-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-white">
                                Dashboard Admin
                            </h1>
                            <p className="mt-2 text-sm text-zinc-500">
                                Entrez le secret pour accéder
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label htmlFor="secret" className="sr-only">
                                    Secret
                                </label>
                                <input
                                    type="password"
                                    id="secret"
                                    value={secret}
                                    onChange={(e) => setSecret(e.target.value)}
                                    placeholder="••••••••••••"
                                    autoComplete="current-password"
                                    required
                                    className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/50 px-4 py-3.5 text-center tracking-widest text-white placeholder-zinc-600 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                                    <svg
                                        className="h-4 w-4 shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 py-3.5 font-medium text-white transition-all hover:from-violet-500 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg
                                            className="h-4 w-4 animate-spin"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Connexion...
                                    </span>
                                ) : (
                                    "Se connecter"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        );
    }

    // Dashboard
    return (
        <main className="min-h-screen bg-zinc-950">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500">
                            <span className="text-lg font-bold text-white">
                                i
                            </span>
                        </div>
                        <div>
                            <h1 className="font-semibold text-white">
                                ibout.me
                            </h1>
                            <p className="text-xs text-zinc-500">
                                Dashboard Admin
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        <span className="hidden sm:inline">Déconnexion</span>
                    </button>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                {/* Stats Cards */}
                <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                                <svg
                                    className="h-5 w-5 text-violet-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">
                                    {stats.total}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    Total inscrits
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                                <svg
                                    className="h-5 w-5 text-emerald-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">
                                    {stats.today}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    Aujourd&apos;hui
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                                <svg
                                    className="h-5 w-5 text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">
                                    {stats.thisWeek}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    Cette semaine
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                                <svg
                                    className="h-5 w-5 text-amber-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">
                                    {stats.notified}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    Notifiés
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search */}
                    <div className="relative flex-1 sm:max-w-xs">
                        <svg
                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Rechercher un email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        {selectedEntries.size > 0 && (
                            <>
                                <span className="flex items-center rounded-lg bg-violet-500/10 px-3 py-2 text-sm text-violet-400">
                                    {selectedEntries.size} sélectionné
                                    {selectedEntries.size > 1 ? "s" : ""}
                                </span>
                                <button
                                    onClick={() =>
                                        handleDelete(
                                            Array.from(selectedEntries)
                                        )
                                    }
                                    className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400 transition-all hover:bg-red-500/20"
                                >
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                    Supprimer
                                </button>
                            </>
                        )}
                        <button
                            onClick={copyEmails}
                            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-sm text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-800"
                        >
                            {copySuccess ? (
                                <>
                                    <svg
                                        className="h-4 w-4 text-emerald-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span className="text-emerald-400">
                                        Copié !
                                    </span>
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Copier
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-sm text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-800"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                            Exporter
                        </button>
                        <button
                            onClick={handleNotifyAll}
                            disabled={
                                notifying || stats.total - stats.notified === 0
                            }
                            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-emerald-500 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {notifying ? (
                                <>
                                    <svg
                                        className="h-4 w-4 animate-spin"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Envoi...
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Notifier ({stats.total - stats.notified})
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Notify Result */}
                {notifyResult && (
                    <div
                        className={`mb-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                            notifyResult.error
                                ? "bg-red-500/10 text-red-400"
                                : "bg-emerald-500/10 text-emerald-400"
                        }`}
                    >
                        {notifyResult.error ? (
                            <>
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {notifyResult.error}
                            </>
                        ) : (
                            <>
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                {notifyResult.sent}/{notifyResult.total} emails
                                envoyés avec succès
                            </>
                        )}
                        <button
                            onClick={() => setNotifyResult(null)}
                            className="ml-auto hover:opacity-70"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Table */}
                {dataLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-3 text-zinc-400">
                            <svg
                                className="h-5 w-5 animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Chargement des données...
                        </div>
                    </div>
                ) : filteredEntries.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-12 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800">
                            <svg
                                className="h-7 w-7 text-zinc-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                />
                            </svg>
                        </div>
                        <p className="text-zinc-400">
                            {searchQuery
                                ? "Aucun résultat trouvé"
                                : "Aucun inscrit pour le moment"}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="mt-3 text-sm text-violet-400 hover:text-violet-300"
                            >
                                Effacer la recherche
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/30">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-zinc-800/50 bg-zinc-900/50">
                                        <th className="w-12 px-4 py-4">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedEntries.size ===
                                                        filteredEntries.length &&
                                                    filteredEntries.length > 0
                                                }
                                                onChange={toggleSelectAll}
                                                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-violet-500 focus:ring-violet-500 focus:ring-offset-0"
                                            />
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                            Email
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                            Date d&apos;inscription
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wider text-zinc-500">
                                            Statut
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/30">
                                    {filteredEntries.map((entry) => (
                                        <tr
                                            key={entry.id}
                                            className={`transition-colors hover:bg-zinc-800/30 ${
                                                selectedEntries.has(entry.id)
                                                    ? "bg-violet-500/5"
                                                    : ""
                                            }`}
                                        >
                                            <td className="w-12 px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEntries.has(
                                                        entry.id
                                                    )}
                                                    onChange={() =>
                                                        toggleSelect(entry.id)
                                                    }
                                                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-violet-500 focus:ring-violet-500 focus:ring-offset-0"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="font-medium text-white">
                                                    {entry.email}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-zinc-400">
                                                {new Date(
                                                    entry.created_at
                                                ).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                {entry.notified_at ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                                                        <svg
                                                            className="h-3 w-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        Notifié
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-500">
                                                        <svg
                                                            className="h-3 w-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                        En attente
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        <div className="border-t border-zinc-800/50 bg-zinc-900/30 px-4 py-3">
                            <p className="text-sm text-zinc-500">
                                {filteredEntries.length} résultat
                                {filteredEntries.length > 1 ? "s" : ""}
                                {searchQuery && ` pour "${searchQuery}"`}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
