"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardContent className="pt-8 pb-8 px-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-brand-blue">Réinitialisation</h1>
            <p className="text-xs text-slate-500">
              Saisissez votre email professionnel pour recevoir les instructions
            </p>
          </div>

          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <p className="text-sm font-medium text-slate-800">
                Un e-mail de réinitialisation a été envoyé à <br />
                <span className="font-bold text-brand-blue">{email}</span>.
              </p>
              <Link href="/login" className="block pt-2">
                <Button variant="outline" className="w-full">
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Email
                </label>
                <Input
                  type="email"
                  required
                  placeholder="nom@3lm.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-50"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-bold h-10 shadow-sm"
              >
                Envoyer le lien
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-blue"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Retour à la connexion
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}