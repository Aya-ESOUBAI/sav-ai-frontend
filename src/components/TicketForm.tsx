"use client";
import React, { useState } from "react";

type Ticket = {
  id: string;
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: number;
};

export default function TicketForm({
  onSave,
  initial,
  onCancel,
}: {
  onSave: (t: Ticket) => void;
  initial?: Partial<Ticket>;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority] = useState<Ticket["priority"]>(initial?.priority ?? "Medium");
  const [status, setStatus] = useState<Ticket["status"]>(initial?.status ?? "Open");

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const ticket: Ticket = {
      id: initial?.id ?? `t_${Math.random().toString(36).slice(2, 9)}`,
      title: title.trim() || "Sans titre",
      description: description.trim(),
      priority,
      status,
      createdAt: initial?.createdAt ?? Date.now(),
    };
    onSave(ticket);
  }

  return (
    <form onSubmit={submit} className="p-4 border rounded bg-white">
      <div className="mb-2">
        <label className="block text-sm font-medium">Titre</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-2 py-1" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-2 py-1" rows={4} />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-sm font-medium">Priorité</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="w-full border rounded px-2 py-1">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Statut</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full border rounded px-2 py-1">
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Closed</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-3 py-1 border rounded">
            Annuler
          </button>
        )}
        <button type="submit" className="px-4 py-1 bg-sky-600 text-white rounded">
          Enregistrer
        </button>
      </div>
    </form>
  );
}
