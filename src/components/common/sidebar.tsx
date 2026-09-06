"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Ticket, 
  Package, 
  Settings, 
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/lib/auth-service";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { canAccessPath, normalizeRole, type Role } from "@/lib/rbac";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Chat IA", href: "/chat", icon: MessageSquare },
  { name: "Tickets SAV", href: "/tickets", icon: Ticket },
  { name: "Produits & Garanties", href: "/produits", icon: Package },
  { name: "Administration", href: "/admin", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    try {
      const user = JSON.parse(Cookies.get("user") || "{}") as { role?: unknown };
      setRole(normalizeRole(user.role));
    } catch {
      setRole(null);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between min-h-screen border-r border-slate-800 shrink-0">
      <div>
        {/* Logo 3LM SOLUTIONS */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-blue flex items-center justify-center font-bold text-lg text-white shadow-md border border-brand-cyan/30">
            3LM
          </div>
          <div>
            <h1 className="font-bold text-sm leading-none text-white tracking-wide">3LM SOLUTIONS</h1>
            <span className="text-[10px] text-brand-cyan font-semibold tracking-wider">SAV & SUPPORT IA</span>
          </div>
        </div>

        {/* Menu de navigation */}
        <nav className="p-4 space-y-1.5">
          {navigation.filter((item) => canAccessPath(role, item.href)).map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-brand-cyan" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bouton Déconnexion */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800/80 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5 text-slate-400 hover:text-red-400" />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}