"use client";
import {
  Activity,
  ArrowRight,
  BookOpenText,
  BriefcaseBusiness,
  CheckCircle2,
  Database,
  FileText,
  Lock,
  MessageSquareText,
  Plus,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const roleCards = [
  {
    name: "Client",
    icon: Users,
    accent: "text-sky-600 bg-sky-50 border-sky-200",
    pages: [
      "Connexion / Inscription",
      "Tableau de bord personnel",
      "Chat IA",
      "Mes tickets",
      "Mes produits",
      "Profil",
    ],
    permissions: "Accès uniquement à ses propres données. Aucune vue sur les autres comptes.",
    badge: "ouvert",
  },
  {
    name: "Technicien",
    icon: Wrench,
    accent: "text-amber-600 bg-amber-50 border-amber-200",
    pages: [
      "Connexion",
      "Dashboard technicien",
      "Détail d'un ticket",
      "Historique d'interventions",
      "Profil",
    ],
    permissions: "Accès aux tickets assignés, modification du statut et gestion des pièces détachées.",
    badge: "en_cours",
  },
  {
    name: "Responsable SAV",
    icon: BriefcaseBusiness,
    accent: "text-violet-600 bg-violet-50 border-violet-200",
    pages: [
      "Connexion",
      "Dashboard SAV",
      "Gestion globale des tickets",
      "Réaffectation",
      "Gestion des produits & garanties",
      "Profil",
    ],
    permissions: "Vue globale des tickets et techniciens, sans gestion des comptes ni configuration système.",
    badge: "escalade",
  },
  {
    name: "Administrateur",
    icon: ShieldCheck,
    accent: "text-emerald-600 bg-emerald-50 border-emerald-200",
    pages: [
      "Gestion des utilisateurs et rôles",
      "Gestion documentaire",
      "Paramètres de la plateforme",
      "Dashboard global",
      "Profil",
    ],
    permissions: "Accès complet à toutes les données et fonctionnalités de la plateforme.",
    badge: "resolu",
  },
];

const users = [
  { name: "Aya ESOUBAI", role: "Administrateur", status: "Actif", activity: "Il y a 12 min" },
  { name: "Samir EL ALAOUI", role: "Responsable SAV", status: "Actif", activity: "Il y a 21 min" },
  { name: "Nadia BENSALAH", role: "Technicien", status: "Actif", activity: "Il y a 37 min" },
  { name: "Yassine RAHAL", role: "Technicien", status: "En pause", activity: "Hier" },
  { name: "Lina KAMEL", role: "Client", status: "Actif", activity: "Il y a 1 h" },
  { name: "Omar CHERIF", role: "Client", status: "Désactivé", activity: "Il y a 3 jours" },
];

const channels = [
  { name: "WhatsApp", enabled: true, status: "Connecté" },
  { name: "Teams", enabled: true, status: "Connecté" },
  { name: "Slack", enabled: false, status: "Désactivé" },
  { name: "Site web", enabled: true, status: "En ligne" },
];

const documents = [
  { title: "FAQ produits", type: "Support client", items: 248, updated: "2 jours" },
  { title: "Manuels techniques", type: "Interventions", items: 134, updated: "1 semaine" },
  { title: "Procédures SAV", type: "Triage & escalade", items: 92, updated: "Aujourd'hui" },
  { title: "Base RAG IA", type: "Réponses assistées", items: 807, updated: "12 min" },
];

const iaSettings = [
  "Modèle IA principal : GPT-4.1 / RAG interne",
  "Fréquence de mise à jour du corpus documentaire : quotidienne",
  "Limite de réponses générées par session : 8",
  "Mémorisation du contexte client : activée",
  "Contrôle d'accès des réponses : strict sur les rôles",
];

export default function AdminPage() {
  const [action, setAction] = useState<"invite" | "settings" | "users" | null>(null);
  const [userRows, setUserRows] = useState(users);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    setUserRows((current) => [
      {
        name: inviteName.trim(),
        role: "Client",
        status: "Actif",
        activity: "À l'instant",
      },
      ...current,
    ]);
    setInviteName("");
    setInviteEmail("");
    setAction("users");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue"></p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Interface d&apos;administration</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestion des utilisateurs et rôles, paramètres de la plateforme et base documentaire.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={() => setAction("invite")} className="bg-brand-blue hover:bg-brand-blue/90 text-white gap-2">
            <Plus className="h-4 w-4" />
            Inviter un utilisateur
          </Button>
          <Button type="button" variant="outline" onClick={() => setAction("settings")} className="gap-2 border-slate-300">
            <Settings2 className="h-4 w-4" />
            Paramètres
          </Button>
        </div>
      </div>

      {action && (
        <Card className="border-brand-blue/30 bg-brand-blue/5 shadow-xs" role="dialog" aria-label="Action d'administration">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-900">
                  {action === "invite"
                    ? "Inviter un utilisateur"
                    : action === "settings"
                      ? "Configuration IA & RAG"
                      : "Gérer les utilisateurs"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {action === "invite"
                    ? "Ajoutez un compte à la liste locale de démonstration."
                    : action === "settings"
                      ? "Les paramètres sont prêts à être reliés à l'API de configuration."
                      : "Consultez et gérez les comptes depuis cette vue."}
                </p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => setAction(null)}>
                Fermer
              </Button>
            </div>
            {action === "invite" && (
              <form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleInvite}>
                <label className="flex-1 text-xs font-medium text-slate-700">
                  Nom
                  <input
                    value={inviteName}
                    onChange={(event) => setInviteName(event.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="Nom complet"
                    required
                  />
                </label>
                <label className="flex-1 text-xs font-medium text-slate-700">
                  Email
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="nom@exemple.com"
                    required
                  />
                </label>
                <Button type="submit">Ajouter</Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-l-4 border-l-brand-blue shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-slate-500">Utilisateurs actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">128</div>
            <p className="mt-1 text-[11px] text-emerald-600 font-medium">+8,4% vs. semaine précédente</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-600 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-slate-500">Rôles configurés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">4</div>
            <p className="mt-1 text-[11px] text-slate-500">Client, Technicien, SAV, Admin</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-slate-500">Documents indexés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1,431</div>
            <p className="mt-1 text-[11px] text-amber-600 font-medium">+204 nouveaux ce mois</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-slate-500">Canaux connectés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">3/4</div>
            <p className="mt-1 text-[11px] text-emerald-600 font-medium">WhatsApp, Teams, Site web actifs</p>
          </CardContent>
        </Card>

      </div>

      <Card className="shadow-xs border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Gestion des utilisateurs et rôles</CardTitle>
              <CardDescription>Détail par rôle et permissions d&apos;accès.</CardDescription>
            </div>
            <Badge variant="outline" className="w-fit border-slate-200 text-slate-600">
              Sécurité & accès
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 xl:grid-cols-2">
            {roleCards.map((role) => {
              const Icon = role.icon;

              return (
                <div key={role.name} className={`rounded-xl border p-4 ${role.accent}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-white p-2 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{role.name}</h3>
                        <p className="text-xs text-slate-500">Permissions métier</p>
                      </div>
                    </div>
                    <Badge variant={role.badge as "ouvert" | "en_cours" | "escalade" | "resolu"} className="text-[10px]">
                      {role.name}
                    </Badge>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Pages accessibles</p>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700">
                      {role.pages.map((page) => (
                        <li key={page} className="flex items-start gap-2">
                          <ArrowRight className="mt-0.5 h-3.5 w-3.5 text-slate-500" />
                          <span>{page}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 border-t border-slate-200/80 pt-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Permissions</p>
                    <p className="mt-2 text-sm text-slate-700">{role.permissions}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="shadow-xs border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Utilisateurs & comptes</CardTitle>
                <CardDescription>Liste des comptes et leur statut.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setAction("users")} className="gap-2 border-slate-300">
                <UserCog className="h-4 w-4" />
                Gérer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2.5 text-left font-semibold text-slate-600">Utilisateur</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-slate-600">Rôle</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-slate-600">Statut</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-slate-600">Activité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {userRows.map((user) => (
                    <tr key={user.name} className="hover:bg-slate-50/80">
                      <td className="px-3 py-3 font-medium text-slate-800">{user.name}</td>
                      <td className="px-3 py-3 text-slate-600">{user.role}</td>
                      <td className="px-3 py-3">
                        <Badge
                          variant={
                            user.status === "Actif"
                              ? "resolu"
                              : user.status === "En pause"
                                ? "en_cours"
                                : user.status === "Désactivé"
                                  ? "outline"
                                  : "default"
                          }
                          className={user.status === "Désactivé" ? "border-slate-200 text-slate-600" : ""}
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-slate-500">{user.activity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xs border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-slate-900">Permissions clés</CardTitle>
            <CardDescription>Règles de sécurité et de gouvernance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Accès limité aux propres données pour le Client.",
              "Les techniciens voient uniquement les tickets assignés.",
              "Le Responsable SAV a une vue globale sans droits de configuration.",
              "L'Administrateur valide les comptes, rôles et paramètres système.",
            ].map((rule) => (
              <div key={rule} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span className="text-sm text-slate-700">{rule}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="shadow-xs border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Paramètres de la plateforme</CardTitle>
                <CardDescription>Canaux connectés et configuration globale.</CardDescription>
              </div>
              <Settings2 className="h-5 w-5 text-slate-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {channels.map((channel) => (
              <div key={channel.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div>
                  <p className="font-medium text-slate-800">{channel.name}</p>
                  <p className="text-xs text-slate-500">{channel.status}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex h-2.5 w-2.5 rounded-full ${channel.enabled ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <Badge variant={channel.enabled ? "resolu" : "outline"} className={channel.enabled ? "" : "border-slate-200 text-slate-600"}>
                    {channel.enabled ? "Activé" : "Désactivé"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Configuration IA & RAG</CardTitle>
                <CardDescription>Paramètres de l&apos;assistant et du moteur de réponses.</CardDescription>
              </div>
              <Sparkles className="h-5 w-5 text-brand-blue" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {iaSettings.map((setting) => (
              <div key={setting} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
                <MessageSquareText className="mt-0.5 h-4 w-4 text-brand-blue" />
                <span className="text-sm text-slate-700">{setting}</span>
              </div>
            ))}
            <div className="rounded-xl bg-brand-blue/5 border border-brand-blue/15 p-3">
              <div className="flex items-center gap-2 text-brand-blue">
                <Activity className="h-4 w-4" />
                <span className="text-sm font-semibold">Système en bon état</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">Taux de résolution IA : 84% — aucune anomalie détectée sur la base documentaire.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="shadow-xs border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Gestion de la base documentaire</CardTitle>
                <CardDescription>Manuels, FAQ, procédures et sources utilisées par le RAG.</CardDescription>
              </div>
              <BookOpenText className="h-5 w-5 text-slate-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {documents.map((document) => (
                <div key={document.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-brand-blue" />
                      <span className="font-medium text-slate-800">{document.title}</span>
                    </div>
                    <Badge variant="outline" className="border-slate-200 text-slate-600">
                      {document.type}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{document.items} documents</span>
                    <span>Màj {document.updated}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Actions de gouvernance</CardTitle>
                <CardDescription>Vérifications et contrôles administratifs.</CardDescription>
              </div>
              <Database className="h-5 w-5 text-slate-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-slate-800">Contrôle d&apos;accès</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">Tout changement de rôle ou d&apos;état de compte est consigné et vérifiable.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-slate-800">Audit documentaire</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">La base documentaire est surveillée pour détecter les doublons et les sources obsolètes.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-brand-blue" />
                <span className="font-medium text-slate-800">Maintenance</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">Plan de sauvegarde quotidien, validation des droits et mise à jour du corpus programmable.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
