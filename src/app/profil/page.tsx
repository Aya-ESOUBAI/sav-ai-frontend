"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileUpdateSchema, ProfileUpdateFormData } from "@/types/auth";
import { authService } from "@/lib/auth-service";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, ShieldCheck, Key, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

// Dictionnaire de style et libellés par rôle utilisateur (Conception SAV)
const roleConfig: Record<string, { label: string; badgeClass: string; desc: string }> = {
  ADMINISTRATEUR: {
    label: "Administrateur",
    badgeClass: "bg-red-600 text-white border-transparent",
    desc: "Gestion globale de la plateforme, sécurité, utilisateurs et base documentaire.",
  },
  RESPONSABLE_SAV: {
    label: "Responsable SAV",
    badgeClass: "bg-brand-blue text-white border-transparent",
    desc: "Supervision des tickets, statistiques de performance SAV et base de connaissances RAG.",
  },
  TECHNICIEN: {
    label: "Technicien Support",
    badgeClass: "bg-amber-500 text-white border-transparent",
    desc: "Traitement des tickets escaladés et résolution des pannes complexes.",
  },
  CLIENT: {
    label: "Client",
    badgeClass: "bg-emerald-600 text-white border-transparent",
    desc: "Assistance IA interactive, consultation des garanties et suivi de tickets.",
  },
};

export default function ProfilePage() {
  const [user, setUser] = useState<{ id?: string; nom: string; email: string; role: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(ProfileUpdateSchema),
  });

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
        setValue("nom", parsedUser.nom || "");
        setValue("email", parsedUser.email || "");
      } catch (e) {
        console.error("Erreur de lecture du profil utilisateur", e);
      }
    }
  }, [setValue]);

  const onSubmit = async (data: ProfileUpdateFormData) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await authService.updateProfile(data);
      
      // Mettre à jour l'état local
      if (user) {
        setUser({ ...user, nom: data.nom });
      }
      setSuccessMessage("Profil mis à jour avec succès !");
    } catch (error: any) {
      if (process.env.NODE_ENV === "development") {
        // Simulation locale
        if (user) {
          const updated = { ...user, nom: data.nom };
          setUser(updated);
          Cookies.set("user", JSON.stringify(updated), { expires: 7 });
        }
        setSuccessMessage("Profil mis à jour avec succès (mode simulation dev) !");
      } else {
        setErrorMessage(error.message || "Erreur lors de la mise à jour du profil.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const currentRoleInfo = roleConfig[user?.role || "RESPONSABLE_SAV"] || roleConfig.RESPONSABLE_SAV;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mon Profil</h1>
        <p className="text-sm text-slate-500">
          Gérez vos informations personnelles et vérifiez vos autorisations de rôle.
        </p>
      </div>

      {/* Alerte succès ou erreur */}
      {successMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Carte de gauche : Résumé du rôle et statut */}
        <Card className="shadow-xs border-slate-200 md:col-span-1">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 rounded-full bg-brand-blue text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md ring-4 ring-brand-blue/10 mb-3">
              {user?.nom ? user.nom.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "3L"}
            </div>
            <CardTitle className="text-lg font-bold text-slate-900">{user?.nom || "Aya ESOUBAI"}</CardTitle>
            <CardDescription className="text-xs">{user?.email || "aya.esoubai@3lm.ma"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0 border-t border-slate-100 mt-2">
            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Rôle attribué :</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${currentRoleInfo.badgeClass}`}>
                  {currentRoleInfo.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200/60 leading-relaxed">
                {currentRoleInfo.desc}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Carte de droite (2 cols) : Formulaire de modification */}
        <Card className="shadow-xs border-slate-200 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-blue" />
              Modifier les informations
            </CardTitle>
            <CardDescription className="text-xs">
              Mettez à jour votre nom d'affichage ou modifiez votre mot de passe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Nom complet */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Nom Complet</label>
                <Input
                  type="text"
                  {...register("nom")}
                  className="bg-slate-50 border-slate-200"
                />
                {errors.nom && (
                  <p className="text-[11px] text-red-500">{errors.nom.message}</p>
                )}
              </div>

              {/* Email (Lecture seule) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700">Adresse Email</label>
                  <span className="text-[10px] text-slate-400 font-medium">Non modifiable</span>
                </div>
                <Input
                  type="email"
                  disabled
                  {...register("email")}
                  className="bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                />
              </div>

              <div className="h-px bg-slate-100 my-4" />

              {/* Section Changement de mot de passe */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  Changer le mot de passe (optionnel)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Mot de passe actuel</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...register("currentPassword")}
                      className="bg-slate-50 border-slate-200"
                    />
                    {errors.currentPassword && (
                      <p className="text-[11px] text-red-500">{errors.currentPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Nouveau mot de passe</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...register("newPassword")}
                      className="bg-slate-50 border-slate-200"
                    />
                    {errors.newPassword && (
                      <p className="text-[11px] text-red-500">{errors.newPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="pt-3 flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold h-9 px-6 shadow-xs"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer les modifications"
                  )}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}