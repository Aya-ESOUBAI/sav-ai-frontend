import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-brand-blue">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-brand-blue">3LM SOLUTIONS</CardTitle>
            <Badge variant="en_cours">En cours</Badge>
          </div>
          <CardDescription>
            Plateforme IA SAV & Support Technique
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Recherche documentaire / Diagnostic</label>
            <Input placeholder="Ex: Problème d'impression erreur E17..." />
          </div>

          <div className="flex gap-2">
            <Button className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white">
              Envoyer à l'IA
            </Button>
            <Button variant="outline" className="w-full">
              Créer un ticket
            </Button>
          </div>

          <div className="pt-2 flex gap-2 flex-wrap text-xs">
            <Badge variant="ouvert">Ouvert</Badge>
            <Badge variant="en_cours">En cours</Badge>
            <Badge variant="resolu">Résolu</Badge>
            <Badge variant="escalade">Escaladé</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}