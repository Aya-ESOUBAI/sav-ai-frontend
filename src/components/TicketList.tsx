"use client";
import React, { useEffect, useState } from "react";
import TicketForm from "./TicketForm";
import { useNotifications } from "@/components/NotificationProvider";

type Ticket = {
  id: string;
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: number;
};

const STORAGE_KEY = "sav_tickets_v1";

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [editing, setEditing] = useState<Ticket | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setTickets(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }, [tickets]);

  const notif = useNotifications();

  function handleSave(ticket: Ticket) {
    const exists = tickets.find((t) => t.id === ticket.id);
    setTickets((all) => {
      if (exists) return all.map((t) => (t.id === ticket.id ? ticket : t));
      return [ticket, ...all];
    });
    setCreating(false);
    setEditing(null);

    if (exists) {
      notif.push({ title: "Ticket mis à jour", body: ticket.title, link: "/tickets" });
    } else {
      notif.push({ title: "Nouveau ticket créé", body: ticket.title, link: "/tickets" });
    }
  }

  function handleDelete(id: string) {
    if (!confirm("Supprimer ce ticket ?")) return;
    setTickets((all) => all.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tickets</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-sky-600 text-white rounded" onClick={() => setCreating(true)}>
            Nouveau Ticket
          </button>
        </div>
      </div>

      {creating && (
        <TicketForm onSave={handleSave} onCancel={() => setCreating(false)} />
      )}

      {editing && (
        <TicketForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
      )}

      <div className="overflow-auto border rounded bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Titre</th>
              <th className="p-2">Priorité</th>
              <th className="p-2">Statut</th>
              <th className="p-2">Créé</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-500">Aucun ticket</td>
              </tr>
            )}
            {tickets.map((t, i) => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{t.title}</td>
                <td className="p-2 text-center">{t.priority}</td>
                <td className="p-2 text-center">
                  <select
                    value={t.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as any;
                    setTickets((all) => all.map((x) => (x.id === t.id ? { ...x, status: newStatus } : x)));
                    notif.push({ title: "Mise à jour de ticket", body: `${t.title} → ${newStatus}`, link: "/tickets" });
                  }}
                  className="border rounded px-2 py-1"
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Closed</option>
                  </select>
                </td>
                <td className="p-2 text-xs text-slate-500">{new Date(t.createdAt).toLocaleString()}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button className="px-2 py-1 border rounded" onClick={() => setEditing(t)}>
                      Modifier
                    </button>
                    <button className="px-2 py-1 border rounded text-red-600" onClick={() => handleDelete(t.id)}>
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
