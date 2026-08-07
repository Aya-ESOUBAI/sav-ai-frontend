"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/common/sidebar";
import { Header } from "@/components/common/header";
import { NotificationProvider } from "@/components/NotificationProvider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Si l'utilisateur est sur l'écran de connexion (Maquette 1), afficher sans la navigation
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  // Pour toutes les autres maquettes (2 à 6), afficher avec la Sidebar et le Header
  return (
    <NotificationProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </NotificationProvider>
  );
}