"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Package,
  ArrowRight,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  nom: string;
  email: string;
  role: string;
}

const recentTickets = [
  { id: "115", incident: "Imprimante E17", client: "Niem", date: "11/03/2026", statut: "en_cours", priorite: "Haute" },
  { id: "116", incident: "Config Routeur F17", client: "Synhru", date: "11/04/2026", statut: "ouvert", priorite: "Moyenne" },
  { id: "117", incident: "Problème Serveur PC", client: "Flapied", date: "21/05/2026", statut: "resolu", priorite: "Basse" },
  { id: "108", incident: "Erreur Connexion CRM", client: "Eixmessis", date: "15/05/2026", statut: "escalade", priorite: "Haute" },
];

const ticketVolumeData = [
  { month: "Jan", tickets: 82 },
  { month: "Fév", tickets: 96 },
  { month: "Mar", tickets: 88 },
  { month: "Avr", tickets: 112 },
  { month: "Mai", tickets: 125 },
  { month: "Jui", tickets: 138 },
];

const resolutionTrend = [
  { month: "Jan", temps: 4.2 },
  { month: "Fév", temps: 3.9 },
  { month: "Mar", temps: 3.6 },
  { month: "Avr", temps: 3.1 },
  { month: "Mai", temps: 2.7 },
  { month: "Jui", temps: 2.3 },
];

const satisfactionData = [
  { sujet: "Qualité", score: 92 },
  { sujet: "Vitesse", score: 88 },
  { sujet: "Suivi", score: 95 },
  { sujet: "Clarté", score: 90 },
];

export default function DashboardPage() {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">
            Bonjour, {user?.nom || "Aya ESOUBAI"} 👋
          </h1>
          <p className="text-sm text-slate-500">
            Aperçu global de votre activité SAV et des performances de l'Assistant IA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/chat">
            <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white gap-2 shadow-sm">
              <MessageSquare className="w-4 h-4" />
              Lancer Chat IA
            </Button>
          </Link>
          <Link href="/tickets">
            <Button variant="outline" className="gap-2 border-slate-300">
              <Plus className="w-4 h-4" />
              Nouveau Ticket
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-brand-blue shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-500">Tickets Ouverts</CardTitle>
            <Ticket className="w-4 h-4 text-brand-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">125</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">↑ +12% ce mois-ci</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-500">Moyenne Résolution</CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">2h 15m</div>
            <p className="text-[11px] text-slate-500 mt-1">Objectif: &lt; 4h</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-brand-cyan shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-500">Taux Résolution IA</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">84%</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Moteur RAG performant</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-500">Tickets Escaladés</CardTitle>
            <AlertTriangle className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">8%</div>
            <p className="text-[11px] text-purple-600 font-medium mt-1">Transférés aux techniciens</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 shadow-xs border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Volume de tickets</CardTitle>
              <CardDescription className="text-xs">Évolution sur les 6 derniers mois</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-semibold">+18.4%</span>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ticketVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="tickets" stroke="#2563eb" strokeWidth={3} fill="url(#colorTickets)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold text-slate-900">Satisfaction client</CardTitle>
            <CardDescription className="text-xs">Indice moyen sur le dernier trimestre</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-brand-blue to-brand-cyan p-4 text-white">
              <div className="text-xs uppercase tracking-[0.16em] text-blue-100">Score global</div>
              <div className="mt-3 text-4xl font-bold">91%</div>
              <div className="mt-1 text-sm text-blue-100">Très satisfaits</div>
            </div>

            <div className="space-y-3">
              {satisfactionData.map((item) => (
                <div key={item.sujet}>
                  <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
                    <span>{item.sujet}</span>
                    <span>{item.score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-gradient-to-r from-brand-blue to-emerald-500" style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-xs border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Temps moyen de résolution</CardTitle>
              <CardDescription className="text-xs">Evolution par mois (en heures)</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-brand-blue">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-semibold">-45%</span>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="temps" stroke="#0f172a" strokeWidth={3} dot={{ r: 4, fill: "#0f172a" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold text-slate-900">Réseau support</CardTitle>
            <CardDescription className="text-xs">Performances globales de l’équipe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-brand-blue/10 p-2 text-brand-blue">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Agents actifs</div>
                  <div className="text-lg font-bold text-slate-900">24</div>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">+6</Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Escalades</div>
                  <div className="text-lg font-bold text-slate-900">18</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-amber-600">8% du total</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Résolution</div>
                  <div className="text-lg font-bold text-slate-900">84%</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600">Objectif atteint</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-xs border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold text-slate-900">Tickets récents</CardTitle>
            <CardDescription className="text-xs">Dernières demandes du support technique</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Incident</th>
                    <th className="py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-700">#{ticket.id}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">{ticket.incident}</td>
                      <td className="py-3 px-4">
                        <Badge variant={ticket.statut as any}>{ticket.statut.replace("_", " ")}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-xs border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Répartition des demandes</CardTitle>
              <CardDescription className="text-xs">Par catégorie de problèmes</CardDescription>
            </div>
            <Package className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: "Matériel", value: 42 }, { name: "Logiciel", value: 31 }, { name: "Réseau", value: 17 }, { name: "Sécurité", value: 10 }]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card className="shadow-xs border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Raccourcis Rapides</CardTitle>
              <CardDescription className="text-xs">Accès direct aux modules clés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/chat" className="block group">
                <div className="p-3 rounded-lg border border-slate-200 hover:border-brand-blue hover:bg-blue-50/50 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Assistant IA Chat</p>
                      <p className="text-[11px] text-slate-500">Diagnostic & Recherche RAG</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>

              <Link href="/tickets" className="block group">
                <div className="p-3 rounded-lg border border-slate-200 hover:border-brand-blue hover:bg-blue-50/50 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Gestion des Tickets</p>
                      <p className="text-[11px] text-slate-500">Suivi & Escalades techniciens</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>

              <Link href="/produits" className="block group">
                <div className="p-3 rounded-lg border border-slate-200 hover:border-brand-blue hover:bg-blue-50/50 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Produits & Garanties</p>
                      <p className="text-[11px] text-slate-500">Catalogue & Pièces détachées</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}