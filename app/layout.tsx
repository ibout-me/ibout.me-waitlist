import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-outfit",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
    variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
    title: "Waitlist - Ibout.me",
    description: "Rejoignez notre liste d'attente",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html className={`${outfit.variable} ${spaceGrotesk.variable}`}>
            <body>{children}</body>
        </html>
    );
}
