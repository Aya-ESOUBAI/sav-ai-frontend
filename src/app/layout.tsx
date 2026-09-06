import type { Metadata } from "next";
import "@/app/globals.css";
import { AppShell } from "@/components/common/app-shell";

export const metadata: Metadata = {
  title: "3LM SOLUTIONS - Plateforme SAV IA",
  description: "Plateforme SaaS d'agent IA pour le service après-vente et le support technique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-slate-50 min-h-screen text-slate-900 antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}