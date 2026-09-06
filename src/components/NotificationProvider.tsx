"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppNotification = {
  id: string;
  title: string;
  body?: string;
  createdAt: number;
  read?: boolean;
  link?: string;
};

type Context = {
  notifications: AppNotification[];
  push: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: number;
};

const ctx = createContext<Context | null>(null);

function uid(prefix = "n") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

const STORAGE_KEY = "sav_notifications_v1";

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setNotifications(JSON.parse(raw));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const push = (n: Omit<AppNotification, "id" | "createdAt" | "read">) => {
    const notif: AppNotification = {
      id: uid("notif"),
      title: n.title,
      body: n.body,
      link: n.link,
      createdAt: Date.now(),
      read: false,
    };
    setNotifications((s) => [notif, ...s].slice(0, 50));

    const ev = new CustomEvent("sav:toast", { detail: { id: notif.id, title: notif.title, body: notif.body } });
    window.dispatchEvent(ev);

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(notif.title, { body: notif.body });
      } catch {}
    }
  };

  const markRead = (id: string) => setNotifications((s) => s.map((x) => (x.id === id ? { ...x, read: true } : x)));
  const markAllRead = () => setNotifications((s) => s.map((x) => ({ ...x, read: true })));
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  return (
    <ctx.Provider value={{ notifications, push, markRead, markAllRead, unreadCount }}>
      {children}
      <Toasts />
    </ctx.Provider>
  );
}

export function useNotifications() {
  const c = useContext(ctx);
  if (!c) throw new Error("useNotifications must be used within NotificationProvider");
  return c;
}

function Toasts() {
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; body?: string }>>([]);

  useEffect(() => {
    function handler(e: any) {
      const d = e.detail as { id: string; title: string; body?: string };
      setToasts((s) => [d, ...s]);
      setTimeout(() => setToasts((s) => s.filter((t) => t.id !== d.id)), 6000);
    }
    window.addEventListener("sav:toast", handler as EventListener);
    return () => window.removeEventListener("sav:toast", handler as EventListener);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="max-w-sm p-3 bg-white shadow ring-1 ring-black/5 rounded">
          <div className="font-semibold text-sm">{t.title}</div>
          {t.body && <div className="text-xs text-slate-600 mt-1">{t.body}</div>}
        </div>
      ))}
    </div>
  );
}
