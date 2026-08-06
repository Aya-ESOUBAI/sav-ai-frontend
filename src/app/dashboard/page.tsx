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
  Plus
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  nom: string;
  email: string;
  role: string;
}

// Données fictives pour simuler les tickets récents (Maquette 2)
const recentTickets = [
  { id: "115", incident: "Imprimante E17", client: "Niem", date: "11/03/2026", statut: "en_cours", priorite: "Haute" },
  { id: "116", incident: "Config Routeur F17", client: "Synhru", date: "11/04/2026", statut: "ouvert", priorite: "Moyenne" },
  { id: "117", incident: "Problème Serveur PC", client: "Flapied", date: "21/05/2026", statut: "resolu", priorite: "Basse" },
  { id: "108", incident: "Erreur Connexion CRM", client: "Eixmessis", date: "15/05/2026", statut: "escalade", priorite: "Haute" },
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
      {/* 1. En-tête de bienvenue personnalisé */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
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

      {/* 2. Cartes KPI (Métriques d'activité) */}
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

      {/* 3. Section Principale : Raccourcis Rapides + Tickets Récents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Colonne Gauche (2 cols) : Tableau des tickets récents */}
        <Card className="lg:col-span-2 shadow-xs border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Tickets Récents</CardTitle>
              <CardDescription className="text-xs">Dernières demandes du support technique</CardDescription>
            </div>
            <Link href="/tickets">
              <Button variant="ghost" size="sm" className="text-xs text-brand-blue hover:text-brand-blue/80 gap-1">
                Voir tout <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Incident</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-700">#{ticket.id}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">{ticket.incident}</td>
                      <td className="py-3 px-4 text-slate-600">{ticket.client}</td>
                      <td className="py-3 px-4">
                        <Badge variant={ticket.statut as any}>
                          {ticket.statut.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{ticket.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Colonne Droite (1 col) : Raccourcis Rapides vers les fonctionnalités */}
        <div className="space-y-4">
          <Card className="shadow-xs border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Raccourcis Rapides</CardTitle>
              <CardDescription className="text-xs">Accès direct aux modules clés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              
              {/* Raccourci Chat IA */}
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

              {/* Raccourci Tickets */}
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

              {/* Raccourci Produits */}
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