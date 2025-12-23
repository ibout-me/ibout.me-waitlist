import LaunchEmail from "@/emails/LaunchEmail";
import { isAuthenticated } from "@/lib/auth";
import { getUnnotifiedEmails, markAsNotified } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
    // Vérifier l'authentification
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return Response.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const entries = await getUnnotifiedEmails();

        if (entries.length === 0) {
            return Response.json({ message: "Aucun email à envoyer", sent: 0 });
        }

        const batchSize = 100;
        let sent = 0;
        const errors: string[] = [];

        for (let i = 0; i < entries.length; i += batchSize) {
            const batch = entries.slice(i, i + batchSize);

            try {
                await resend.batch.send(
                    batch.map((entry) => ({
                        from: "ibout.me <launch@ibout.me>",
                        to: entry.email,
                        subject: "🚀 ibout.me est enfin lancé !",
                        react: LaunchEmail({ email: entry.email }),
                    }))
                );

                // Marquer comme notifiés
                await markAsNotified(batch.map((e) => e.id));
                sent += batch.length;
            } catch (err) {
                errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${err}`);
            }

            // Pause entre les batches
            if (i + batchSize < entries.length) {
                await new Promise((r) => setTimeout(r, 1000));
            }
        }

        return Response.json({
            sent,
            total: entries.length,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error("Erreur notification:", error);
        return Response.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
