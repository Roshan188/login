import { Resend } from "resend";
import { WelcomeEmail } from "@/emails/welcome";
import { absoluteUrl } from "@/lib/utils";

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export async function sendWelcomeEmail(email: string, name: string) {
  const resend = getResend();
  if (!resend) return;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "noreply@devfolio.dev",
    to: email,
    subject: "Welcome to DevFolio 🚀",
    react: WelcomeEmail({ name, dashboardUrl: absoluteUrl("/dashboard") }),
  });
}
