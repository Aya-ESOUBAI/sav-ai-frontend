"use client";
import dynamic from "next/dynamic";
import ChatWindow from "../../components/ChatWindow";

export default function ChatPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-slate-900 mb-4">Interface Chat IA & Support</h1>
      <ChatWindow />
    </div>
  );
}