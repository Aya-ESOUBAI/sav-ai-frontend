"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginFormData } from "@/types/auth";
import { authService } from "@/lib/auth-service";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Configuration de React Hook Form avec le résolveur Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "RESPONSABLE_SAV",
    },
  });

  // Soumission du formulaire
  const onSubmit = async (data: LoginFormData) => {
  setErrorMessage(null);
  setIsLoading(true);

  try {
    // Tentative de connexion réelle à l'API FastAPI
    await authService.login(data);
    window.location.href = "/dashboard";
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.warn("API indisponible. Mode simulation activé pour le dev.");
      
      // 1. Définition explicite des cookies de test
      Cookies.set("token", "fake-dev-jwt-token", { expires: 1, path: "/" });
      Cookies.set("user", JSON.stringify({
        id: "dev-1",
        nom: "Aya ESOUBAI",
        email: data.email,
        role: data.role
      }), { expires: 1, path: "/" });

      // 2. Redirection matérielle pour transmettre le cookie au middleware
      window.location.href = "/dashboard";
    } else {
      setErrorMessage(
        error.message || "Impossible de se connecter. Vérifiez vos identifiants."
      );
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border border-slate-100 rounded-2xl bg-white/95">
        <CardContent className="pt-8 pb-8 px-8 space-y-6">
          {/* Logo 3LM SOLUTIONS */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl text-white mx-auto shadow-md border-0 bg-gradient-to-br from-brand-blue to-brand-cyan">
              3LM
            </div>
            <h1 className="text-2xl font-bold text-brand-blue tracking-tight">
              3LM SOLUTIONS
            </h1>
            <p className="text-xs text-slate-500">Plateforme IA SAV & Support Technique</p>
          </div>

          {/* Message d'erreur global */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulaire de Connexion */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Champ Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Email</label>
              <Input
                type="email"
                placeholder="email@example.com"
                {...register("email")}
                className="bg-slate-50"
              />
              {errors.email && (
                <p className="text-[11px] text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Mot de passe
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="bg-slate-50"
              />
              {errors.password && (
                <p className="text-[11px] text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Champ Rôle */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Rôle</label>
              <select
                {...register("role")}
                className="w-full h-9 px-3 text-sm rounded-md border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="RESPONSABLE_SAV">Responsable SAV</option>
                <option value="TECHNICIEN">Technicien</option>
                <option value="CLIENT">Client</option>
                <option value="ADMINISTRATEUR">Administrateur</option>
              </select>
              {errors.role && (
                <p className="text-[11px] text-red-500">{errors.role.message}</p>
              )}
            </div>

            {/* Bouton Connexion */}
            <Button
              type="submit"
              disabled={isLoading}
            className="w-full bg-gradient-to-r from-brand-blue to-brand-cyan hover:opacity-95 text-white font-bold h-10 shadow-lg mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Connexion"
              )}
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/forgot-password"
                className="text-xs text-slate-500 hover:text-brand-blue underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}