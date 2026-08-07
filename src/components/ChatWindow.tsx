"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import MessageList from "./MessageList";
import { useNotifications } from "@/components/NotificationProvider";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: number;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  unread?: number;
};

const STORAGE_KEY = "sav_chat_conversations_v1";

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function ChatWindow() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [typingMap, setTypingMap] = useState<Record<string, boolean>>({});
  const notif = useNotifications();


  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Conversation[];
        setConversations(parsed);
        if (parsed.length) setActiveId(parsed[0].id);
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }

    // Request notification permission early
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  // Optional WebSocket connection — uses NEXT_PUBLIC_WS_URL if provided, otherwise falls back to simulated replies
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WS_URL;
    if (!url) return; // don't open WS if not configured

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;
      ws.addEventListener("message", (ev) => {
        let data = ev.data;
        try {
          data = JSON.parse(ev.data);
        } catch {}
        handleIncomingAI(String(data?.text ?? data));
      });
      ws.addEventListener("close", () => {
        wsRef.current = null;
      });
    } catch (e) {
      console.warn("WebSocket failed to connect", e);
    }

    return () => {
      try {
        wsRef.current?.close();
      } catch {}
    };
    // Only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = useMemo(() => conversations.find((c) => c.id === activeId) || null, [conversations, activeId]);

  function createConversation(initialMessage?: string) {
    const c: Conversation = {
      id: uid("conv"),
      title: initialMessage ? initialMessage.slice(0, 30) : `Conversation ${conversations.length + 1}`,
      messages: initialMessage
        ? [
            { id: uid("m"), sender: "user", text: initialMessage, timestamp: Date.now() },
            { id: uid("m"), sender: "ai", text: "...", timestamp: Date.now() },
          ]
        : [],
      unread: 0,
    };
    setConversations((s) => [c, ...s]);
    setActiveId(c.id);
    return c;
  }

  function updateConversation(id: string, patch: Partial<Conversation> | ((c: Conversation) => Conversation)) {
    setConversations((all) =>
      all.map((c) => {
        if (c.id !== id) return c;
        if (typeof patch === "function") return patch(c);
        return { ...c, ...patch };
      })
    );
  }

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const convId = activeId ?? createConversation(text).id;
    const message: Message = { id: uid("m"), sender: "user", text: text.trim(), timestamp: Date.now() };

    updateConversation(convId, (c) => ({ ...c, messages: [...c.messages, message] }));

    // Try WebSocket if available
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "user_message", text }));
    } else {
        // Show typing indicator
        setTypingMap((s) => ({ ...s, [convId]: true }));
        // Simulate AI reply after a short delay
        setTimeout(() => {
          const reply: Message = {
            id: uid("m"),
            sender: "ai",
            text: simulateAIResponse(text),
            timestamp: Date.now(),
          };
          updateConversation(convId, (c) => ({ ...c, messages: [...c.messages, reply], unread: (c.unread ?? 0) + 1 }));
          // Clear typing indicator
          setTypingMap((s) => ({ ...s, [convId]: false }));
          // Push in-app notification
          notif.push({ title: "Nouvelle réponse de l'agent IA", body: reply.text, link: `/chat` });

        }, 900 + Math.random() * 800);
      }
    }

  function handleIncomingAI(text: string) {
    const convId = activeId ?? createConversation().id;
    const reply: Message = { id: uid("m"), sender: "ai", text, timestamp: Date.now() };
    updateConversation(convId, (c) => ({ ...c, messages: [...c.messages, reply], unread: (c.unread ?? 0) + 1 }));
    notif.push({ title: "Nouvelle réponse (WS)", body: text, link: "/chat" });
  }

  function simulateAIResponse(userText: string) {
    const lower = userText.toLowerCase();
    if (lower.includes("bonjour") || lower.includes("salut")) return "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
    if (lower.includes("erreur") || lower.includes("panne")) return "Pouvez-vous préciser le code d'erreur ou décrire les symptômes ?";
    if (lower.includes("merci")) return "Avec plaisir — bonne journée !";
    return "Merci pour votre message. Voici une suggestion : vérifiez l'alimentation et redémarrez l'appareil. Si le problème persiste, je peux ouvrir un ticket pour vous.";
  }

  function markActiveRead(id: string) {
    updateConversation(id, (c) => ({ ...c, unread: 0 }));
  }

  function deleteConversation(id: string) {
    setConversations((all) => all.filter((c) => c.id !== id));
    if (activeId === id) setActiveId((prev) => {
      const remaining = conversations.filter((c) => c.id !== id);
      return remaining.length ? remaining[0].id : null;
    });
  }

    function escalateToTicket(convId: string) {
      const conv = conversations.find((c) => c.id === convId);
      if (!conv) return alert("Conversation introuvable");
      const lastMessage = conv.messages[conv.messages.length - 1];
      if (!confirm("Créer un ticket à partir de cette conversation ?")) return;

      const TKEY = "sav_tickets_v1";
      const raw = localStorage.getItem(TKEY);
      let tickets: any[] = [];
      try {
        if (raw) tickets = JSON.parse(raw);
      } catch {}

      const ticket = {
        id: `t_${Math.random().toString(36).slice(2, 9)}`,
        title: `Escalade: ${conv.title}`,
        description: lastMessage ? `${lastMessage.sender === 'user' ? 'Client: ' : 'Agent: '}${lastMessage.text}` : "Aucun détail",
        priority: "Medium",
        status: "Open",
        createdAt: Date.now(),
      };

      tickets = [ticket, ...tickets];
      localStorage.setItem(TKEY, JSON.stringify(tickets));
      notif.push({ title: "Ticket créé", body: `${ticket.title} - ${ticket.description}`, link: "/tickets" });
      try { window.location.href = "/tickets"; } catch (e) {}
    }

  return (
    <div className="flex h-[70vh] border rounded-lg overflow-hidden">
      <aside className="w-64 bg-slate-50 border-r overflow-auto">
        <div className="p-3 flex items-center justify-between border-b">
          <strong>Conversations</strong>
          <button
            className="text-sm px-2 py-1 bg-sky-600 text-white rounded"
            onClick={() => createConversation()}
          >
            Nouvelle
          </button>
        </div>
        <div>
          {conversations.length === 0 && <div className="p-4 text-sm text-slate-500">Aucune conversation</div>}
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => { setActiveId(c.id); markActiveRead(c.id); }}
              className={`p-3 cursor-pointer hover:bg-slate-100 flex justify-between items-center ${c.id === activeId ? "bg-white font-semibold" : ""}`}
            >
              <div>
                <div className="text-sm truncate w-40">{c.title}</div>
                <div className="text-xs text-slate-400">{c.messages.length} message(s)</div>
              </div>
              <div className="text-xs text-sky-600">{c.unread ? <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">{c.unread}</span> : null}</div>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 p-4 flex flex-col">
        {!active && (
          <div className="m-auto text-center text-slate-500">
            Sélectionnez une conversation ou créez-en une nouvelle.
          </div>
        )}

        {active && (
          <>
            <div className="flex items-center justify-between border-b pb-2 mb-2">
              <div>
                <h2 className="text-lg font-semibold">{active.title}</h2>
                <div className="text-xs text-slate-500">{new Date(active.messages[active.messages.length - 1]?.timestamp ?? Date.now()).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                                className="text-sm px-2 py-1 bg-amber-400 text-slate-900 rounded"
                                onClick={() => escalateToTicket(active.id)}
                >
                                [Escalader]
                </button>
                              <button
                                className="text-sm text-slate-600 hover:text-red-600"
                                onClick={() => deleteConversation(active.id)}
                              >
                                Supprimer
                              </button>
                            </div>
            </div>

            <div className="flex-1 overflow-auto mb-4">
              <MessageList messages={active.messages} />
                          {typingMap[active.id] ? (
                            <div className="text-sm text-slate-500 mt-2 italic">L'agent IA est en train d'écrire...</div>
                          ) : null}
                        </div>

            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const val = inputRef.current?.value ?? "";
                sendMessage(val);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              <input
                ref={inputRef}
                className="flex-1 rounded border px-3 py-2"
                placeholder="Tapez votre message..."
                aria-label="message"
              />
              <button className="px-4 py-2 bg-sky-600 text-white rounded">Envoyer</button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
