"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UserProfile {
  nom: string;
  email: string;
  role: string;
}

export function Header() {
  const [user, setUser] = useState<UserProfile | null>(null);

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
        <button 
          aria-label="Notifications"
          className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-cyan rounded-full ring-2 ring-white" />
        </button>

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