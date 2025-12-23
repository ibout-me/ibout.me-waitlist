"use client";

import { useSyncExternalStore } from "react";

interface FloatingCard {
    id: string;
    type: "social" | "music" | "video" | "link" | "text" | "image" | "map";
    icon: React.ReactNode;
    title?: string;
    subtitle?: string;
    gradient: string;
    iconColor: string;
    size: "small" | "medium" | "large";
    position: { x: number; y: number };
    delay: number;
}

const SocialIcon = ({ platform }: { platform: string }) => {
    const icons: Record<string, React.ReactNode> = {
        twitter: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        github: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
        ),
        spotify: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
        ),
        youtube: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
        linkedin: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
        instagram: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
            </svg>
        ),
        dribbble: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
            </svg>
        ),
        twitch: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
            </svg>
        ),
    };
    return icons[platform] || null;
};

const floatingCardsData: FloatingCard[] = [
    // ===== GAUCHE - 3 cartes en arc =====
    {
        id: "twitter",
        type: "social",
        icon: <SocialIcon platform="twitter" />,
        title: "@username",
        subtitle: "1.2K followers",
        gradient: "from-zinc-800/90 to-zinc-900/90",
        iconColor: "text-white",
        size: "medium",
        position: { x: -520, y: -140 },
        delay: 0,
    },
    {
        id: "spotify",
        type: "music",
        icon: <SocialIcon platform="spotify" />,
        title: "Now Playing",
        subtitle: "Daft Punk",
        gradient: "from-green-900/60 to-zinc-900/90",
        iconColor: "text-[#1DB954]",
        size: "small",
        position: { x: -480, y: 80 },
        delay: 0.4,
    },
    {
        id: "github",
        type: "social",
        icon: <SocialIcon platform="github" />,
        title: "GitHub",
        subtitle: "42 repos",
        gradient: "from-zinc-800/90 to-zinc-900/90",
        iconColor: "text-white",
        size: "small",
        position: { x: -540, y: 280 },
        delay: 0.8,
    },

    // ===== DROITE - 3 cartes en arc inversé =====
    {
        id: "youtube",
        type: "video",
        icon: <SocialIcon platform="youtube" />,
        title: "Latest Video",
        subtitle: "12K views",
        gradient: "from-red-900/50 to-zinc-900/90",
        iconColor: "text-[#FF0000]",
        size: "medium",
        position: { x: 520, y: -140 },
        delay: 0.2,
    },
    {
        id: "linkedin",
        type: "social",
        icon: <SocialIcon platform="linkedin" />,
        title: "LinkedIn",
        subtitle: "500+",
        gradient: "from-blue-900/50 to-zinc-900/90",
        iconColor: "text-[#0A66C2]",
        size: "small",
        position: { x: 480, y: 80 },
        delay: 0.6,
    },
    {
        id: "instagram",
        type: "social",
        icon: <SocialIcon platform="instagram" />,
        title: "Instagram",
        subtitle: "5.3K",
        gradient: "from-pink-900/50 to-purple-900/50",
        iconColor: "text-[#E4405F]",
        size: "small",
        position: { x: 540, y: 280 },
        delay: 1.0,
    },
];

function FloatingCard({ card }: { card: FloatingCard }) {
    const sizeClasses = {
        small: "w-32 h-20",
        medium: "w-40 h-24",
        large: "w-48 h-28",
    };

    return (
        <div
            className="floating-card absolute hidden lg:block"
            style={{
                left: `calc(50% + ${card.position.x}px)`,
                top: `calc(50% + ${card.position.y}px)`,
                animationDelay: `${card.delay}s`,
                transform: "translate(-50%, -50%)",
            }}
        >
            <div
                className={`
                    ${sizeClasses[card.size]}
                    bg-linear-to-br ${card.gradient}
                    rounded-xl border border-white/8
                    backdrop-blur-md
                    p-3
                    flex flex-col justify-between
                    shadow-lg shadow-black/30
                    transition-all duration-500 ease-out
                    hover:scale-[1.08] hover:border-white/15
                    hover:shadow-xl hover:shadow-violet-500/5
                    cursor-pointer
                    group
                `}
            >
                <div className="flex items-start justify-between">
                    <div
                        className={`rounded-lg bg-black/30 p-1.5 ${card.iconColor} transition-all duration-300 group-hover:bg-black/40 group-hover:scale-110`}
                    >
                        {card.icon}
                    </div>
                    {card.type === "music" && (
                        <div className="flex items-end gap-[2px] h-4">
                            <span className="w-[3px] h-2 rounded-full bg-[#1DB954] animate-pulse" />
                            <span
                                className="w-[3px] h-3 rounded-full bg-[#1DB954] animate-pulse"
                                style={{ animationDelay: "0.15s" }}
                            />
                            <span
                                className="w-[3px] h-4 rounded-full bg-[#1DB954] animate-pulse"
                                style={{ animationDelay: "0.3s" }}
                            />
                            <span
                                className="w-[3px] h-2 rounded-full bg-[#1DB954] animate-pulse"
                                style={{ animationDelay: "0.45s" }}
                            />
                        </div>
                    )}
                    {card.type === "video" && (
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500">
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-2 w-2 text-white ml-px"
                            >
                                <polygon points="5,3 19,12 5,21" />
                            </svg>
                        </div>
                    )}
                </div>
                <div>
                    {card.title && (
                        <p className="truncate text-[11px] font-medium text-white/90 leading-tight">
                            {card.title}
                        </p>
                    )}
                    {card.subtitle && (
                        <p className="truncate text-[10px] text-white/40 leading-tight">
                            {card.subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Mobile version - simplified horizontal scroll
function MobileFloatingCards() {
    const mobileCards = floatingCardsData.slice(0, 6);

    return (
        <div className="mb-6 w-full overflow-hidden lg:hidden">
            <div className="animate-scroll-cards flex gap-2.5 px-4">
                {[...mobileCards, ...mobileCards].map((card, index) => (
                    <div
                        key={`${card.id}-${index}`}
                        className={`
                            shrink-0
                            w-24 h-16
                            bg-linear-to-br ${card.gradient}
                            rounded-lg border border-white/8
                            backdrop-blur-md
                            p-2.5
                            flex flex-col justify-between
                            shadow-md shadow-black/30
                        `}
                    >
                        <div
                            className={`rounded-md bg-black/30 p-1 ${card.iconColor} w-fit`}
                        >
                            <div className="scale-[0.65] origin-top-left">
                                {card.icon}
                            </div>
                        </div>
                        <p className="truncate text-[9px] font-medium text-white/90">
                            {card.title}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Hook pour détecter le montage côté client (compatible React 19)
function useIsMounted() {
    const getSnapshot = () => true;
    const getServerSnapshot = () => false;
    const subscribe = () => () => {};

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function FloatingCards() {
    const isMounted = useIsMounted();

    if (!isMounted) return null;

    return (
        <>
            {/* Desktop floating cards */}
            <div
                className="pointer-events-none fixed inset-0 z-0 hidden lg:block"
                aria-hidden="true"
            >
                <div className="relative h-full w-full">
                    {floatingCardsData.map((card) => (
                        <FloatingCard key={card.id} card={card} />
                    ))}
                </div>
            </div>

            {/* Mobile scrolling cards */}
            <MobileFloatingCards />
        </>
    );
}
