"use client";
import TicketList from "../../components/TicketList";

export default function TicketsPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-slate-900 mb-4">Gestion des Tickets SAV</h1>
      <TicketList />
    </div>
  );
}