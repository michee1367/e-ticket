"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Building2, Users, Loader2, Database, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useData } from "@/components/providers/data-provider";
import { ROLE_LABELS } from "@/mock-data";
import { exportLocalDatabase } from "@/services/local-db";

const churchSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  phone: z.string().min(10),
  email: z.string().email(),
});

type ChurchForm = z.infer<typeof churchSchema>;

export default function ParametresPage() {
  const { church, users, participants, updateChurch, resetDatabase } = useData();

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<ChurchForm>({
    resolver: zodResolver(churchSchema),
    defaultValues: church,
  });

  const onSubmit = async (data: ChurchForm) => {
    await new Promise((r) => setTimeout(r, 600));
    updateChurch(data);
    toast.success("Informations mises à jour");
  };

  const handleExport = () => {
    const json = exportLocalDatabase();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `retraitespirit-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export téléchargé");
  };

  const handleReset = () => {
    if (confirm("Réinitialiser toutes les données locales ? Les inscriptions publiques seront perdues.")) {
      resetDatabase();
      toast.success("Base de données réinitialisée");
    }
  };

  const publicCount = participants.filter((p) => p.source === "public").length;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Paramètres</h1>
        <p className="text-slate-500 text-sm mt-1">Configuration de l&apos;église et des utilisateurs</p>
      </div>

      <Tabs defaultValue="church">
        <TabsList>
          <TabsTrigger value="church"><Building2 className="h-4 w-4 mr-1" /> Église</TabsTrigger>
          <TabsTrigger value="users"><Users className="h-4 w-4 mr-1" /> Utilisateurs</TabsTrigger>
          <TabsTrigger value="data"><Database className="h-4 w-4 mr-1" /> Données locales</TabsTrigger>
        </TabsList>

        <TabsContent value="church">
          <Card>
            <CardHeader><CardTitle>Informations de l&apos;église</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input {...register("name")} />
                </div>
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input {...register("address")} />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input {...register("phone")} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" {...register("email")} />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Enregistrer
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader><CardTitle>Gestion des utilisateurs</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center gap-4 p-4 hover:bg-slate-50">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.fullName}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Base de données locale</CardTitle>
              <CardDescription>
                Les inscriptions du formulaire public sont enregistrées dans le navigateur (localStorage).
                Elles restent visibles dans l&apos;admin même après rechargement de la page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{participants.length}</p>
                  <p className="text-xs text-slate-500">Participants total</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-bold text-success">{publicCount}</p>
                  <p className="text-xs text-slate-500">Inscriptions publiques</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-bold">{participants.length - publicCount}</p>
                  <p className="text-xs text-slate-500">Données démo / admin</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4" /> Exporter (JSON)
                </Button>
                <Button variant="destructive" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4" /> Réinitialiser les données
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
