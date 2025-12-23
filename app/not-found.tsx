import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-(--color-background) p-4">
            <div className="noise-overlay" />

            <div className="ibout-card max-w-md w-full">
                <div className="ibout-glow" />
                <div className="ibout-card-inner items-center text-center py-12">
                    <h1 className="text-8xl font-bold gradient-text font-display">
                        404
                    </h1>
                    <p className="mt-4 text-xl text-(--color-text) font-display">
                        Page not found
                    </p>
                    <p className="mt-2 text-(--color-text-muted)">
                        The page you&apos;re looking for doesn&apos;t exist or
                        has been moved.
                    </p>
                    <Link
                        href="/"
                        className="mt-8 inline-block rounded-xl bg-(--color-primary) px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-(--color-accent) hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </main>
    );
}
