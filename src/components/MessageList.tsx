"use client";
import React from "react";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: number;
};

export default function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-3 p-2">
      {messages.map((m) => (
        <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
          <div className={`${m.sender === "user" ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-900"} max-w-[90%] break-words rounded-lg px-3 py-2 sm:max-w-[70%]`}>
            <div className="text-sm whitespace-pre-wrap">{m.text}</div>
            <div className="text-[10px] text-slate-400 mt-1 text-right">{new Date(m.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
