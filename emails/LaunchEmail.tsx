import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";

interface LaunchEmailProps {
    email?: string;
    name?: string;
}

export default function LaunchEmailEN({ email, name }: LaunchEmailProps) {
    const getNameFromEmail = (email?: string): string | null => {
        if (!email) return null;
        const localPart = email.split("@")[0];
        // Extract first part before dots, underscores, or numbers
        const namePart = localPart.split(/[._0-9]/)[0];
        if (!namePart || namePart.length < 2) return null;
        // Capitalize first letter
        return (
            namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase()
        );
    };

    const displayName = name || getNameFromEmail(email);
    const greeting = displayName ? `Hey ${displayName} 👋` : null;

    return (
        <Html>
            <Head />
            <Preview>
                🚀 ibout.me is finally live! Create your link page in minutes.
            </Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <Text style={logo}>
                            ibout<span style={logoAccent}>.me</span>
                        </Text>
                    </Section>

                    {/* Hero */}
                    <Section style={heroSection}>
                        <Heading style={heading}>We&apos;re Live!</Heading>
                        {greeting && <Text style={subheading}>{greeting}</Text>}
                        <Text style={paragraph}>
                            Thanks for joining our waitlist. We&apos;re thrilled
                            to announce that{" "}
                            <strong style={highlight}>ibout.me</strong> is
                            officially launched!
                        </Text>
                    </Section>

                    {/* CTA */}
                    <Section style={ctaSection}>
                        <Button style={button} href="https://ibout.me">
                            Create my page →
                        </Button>
                        <Text style={ctaSubtext}>
                            Free • Ready in 2 minutes
                        </Text>
                    </Section>

                    {/* Social Proof */}
                    <Section style={socialProofSection}>
                        <Text style={socialProofText}>
                            Join creators who already trust ibout.me
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            You&apos;re receiving this email because you joined
                            the waitlist{" "}
                            <span style={emailHighlight}>{email}</span>.
                        </Text>
                        <Text style={footerLinks}>
                            <Link href="https://ibout.me" style={footerLink}>
                                ibout.me
                            </Link>
                            {" • "}
                            <Link
                                href="https://discord.gg/xz6YX5RM3H"
                                style={footerLink}
                            >
                                Discord
                            </Link>
                            {" • "}
                            <Link
                                href="https://twitter.com/iboutme"
                                style={footerLink}
                            >
                                Twitter
                            </Link>
                        </Text>
                        <Text style={copyright}>
                            © {new Date().getFullYear()} ibout.me - All rights
                            reserved
                        </Text>
                        <Text style={unsubscribe}>
                            <Link href="#" style={unsubscribeLink}>
                                Unsubscribe
                            </Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

// Styles
const main = {
    backgroundColor: "#0a0a0f",
    fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "40px 20px",
    maxWidth: "560px",
};

const header = {
    textAlign: "center" as const,
    marginBottom: "32px",
};

const logo = {
    fontSize: "28px",
    fontWeight: "700",
    color: "#fafafa",
    margin: "0",
};

const logoAccent = {
    background: "linear-gradient(135deg, #a78bfa, #c084fc, #f472b6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
};

const heroSection = {
    textAlign: "center" as const,
    marginBottom: "32px",
};

const heading = {
    color: "#fafafa",
    fontSize: "32px",
    fontWeight: "700",
    margin: "0 0 8px 0",
    letterSpacing: "-0.02em",
};

const subheading = {
    color: "#a78bfa",
    fontSize: "18px",
    fontWeight: "500",
    margin: "0 0 16px 0",
};

const paragraph = {
    color: "#a1a1aa",
    fontSize: "16px",
    lineHeight: "26px",
    margin: "0",
};

const highlight = {
    color: "#fafafa",
    fontWeight: "600",
};

const ctaSection = {
    textAlign: "center" as const,
    marginBottom: "40px",
};

const button = {
    background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    padding: "16px 32px",
    display: "inline-block",
    boxShadow: "0 4px 14px 0 rgba(139, 92, 246, 0.4)",
};

const ctaSubtext = {
    color: "#52525b",
    fontSize: "13px",
    margin: "12px 0 0 0",
};

const socialProofSection = {
    textAlign: "center" as const,
    marginBottom: "32px",
};

const socialProofText = {
    color: "#71717a",
    fontSize: "14px",
    fontStyle: "italic",
    margin: "0",
};

const hr = {
    borderColor: "#27272a",
    margin: "32px 0",
};

const footer = {
    textAlign: "center" as const,
};

const footerText = {
    color: "#52525b",
    fontSize: "13px",
    margin: "0 0 16px 0",
    lineHeight: "20px",
};

const emailHighlight = {
    color: "#71717a",
};

const footerLinks = {
    margin: "0 0 16px 0",
};

const footerLink = {
    color: "#71717a",
    fontSize: "13px",
    textDecoration: "none",
};

const copyright = {
    color: "#3f3f46",
    fontSize: "12px",
    margin: "0 0 8px 0",
};

const unsubscribe = {
    margin: "0",
};

const unsubscribeLink = {
    color: "#3f3f46",
    fontSize: "11px",
    textDecoration: "underline",
};
