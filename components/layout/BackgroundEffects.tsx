export function BackgroundEffects() {
    return (
        <>
            {/* Noise overlay */}
            <div className="noise-overlay" aria-hidden="true" />

            {/* Background orbs */}
            <div
                className="pointer-events-none fixed inset-0 overflow-hidden"
                aria-hidden="true"
            >
                <div className="absolute -left-1/4 -top-1/4 h-75 w-75 rounded-full bg-violet-600/10 blur-[120px] sm:h-112.5 sm:w-112.5 lg:h-150 lg:w-150" />
                <div className="absolute -bottom-1/4 -right-1/4 h-62.5 w-62.5 rounded-full bg-fuchsia-600/10 blur-[120px] sm:h-93.75 sm:w-93.75 lg:h-125 lg:w-125" />
            </div>
        </>
    );
}
