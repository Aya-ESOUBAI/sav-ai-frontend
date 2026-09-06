"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/components/NotificationProvider";

interface UserProfile {
  nom: string;
  email: string;
  role: string;
}

export function Header() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (e) {
        console.error("Erreur de lecture du profil utilisateur", e);
      }
    }
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "3L";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shadow-xs sticky top-0 z-10">
      {/* Barre de recherche */}
      <div className="w-80 relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input 
          placeholder="Recherche..." 
          className="pl-9 bg-slate-50 border-slate-200 text-sm h-9 focus-visible:ring-brand-blue"
        />
      </div>

      {/* Profile & Notifications */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            aria-label="Notifications"
            className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            onClick={() => setOpen((s) => !s)}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg ring-1 ring-black/5 rounded p-2 z-30">
              <div className="flex items-center justify-between px-2 mb-2">
                <strong>Notifications</strong>
                <button className="text-xs text-slate-500" onClick={() => markAllRead()}>
                  Marquer tout comme lu
                </button>
              </div>
              <div className="max-h-64 overflow-auto space-y-2">
                {notifications.length === 0 && <div className="text-xs text-slate-500 p-2">Aucune notification</div>}
                {notifications.map((n) => (
                  <div key={n.id} className={`p-2 rounded hover:bg-slate-50 cursor-pointer ${n.read ? "opacity-60" : ""}`} onClick={() => { markRead(n.id); if (n.link) window.location.href = n.link; }}>
                    <div className="text-sm font-medium">{n.title}</div>
                    {n.body && <div className="text-xs text-slate-500">{n.body}</div>}
                    <div className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* Profil cliquable vers /profil */}
        <Link href="/profil" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-brand-blue/10 group-hover:ring-brand-blue transition-all">
            {getInitials(user?.nom)}
          </div>
          <div className="text-xs hidden sm:block">
            <p className="font-semibold text-slate-900 leading-tight group-hover:text-brand-blue transition-colors">
              {user?.nom || "Aya ESOUBAI"}
            </p>
            <p className="text-slate-500 text-[11px] capitalize">
              {user?.role?.replace("_", " ").toLowerCase() || "Responsable SAV"}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}