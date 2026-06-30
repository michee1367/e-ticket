"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/components/providers/data-provider";

const schema = z.object({
  name: z.string().min(3, "Nom requis"),
  description: z.string().min(10, "Description requise"),
  location: z.string().min(3, "Lieu requis"),
  startDate: z.string().min(1, "Date requise"),
  endDate: z.string().min(1, "Date requise"),
  maxCapacity: z.number({ error: "Capacité requise" }).min(1, "Capacité minimale : 1"),
});

type FormData = z.infer<typeof schema>;

export default function NouvelleRetraitePage() {
  const { addRetreat } = useData();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 800));
    //addRetreat({ ...data, status: "planifiee" });
    toast.success("Retraite créée avec succès !");
    router.push("/retraites");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/retraites"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-text">Nouvelle retraite</h1>
          <p className="text-slate-500 text-sm">Créer une nouvelle retraite spirituelle</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Informations de la retraite</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input placeholder="Retraite de Pâques 2026" {...register("name")} />
              {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Description de la retraite..." rows={4} {...register("description")} />
              {errors.description && <p className="text-xs text-danger">{errors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Lieu</Label>
              <Input placeholder="Centre Spirituel de Nsele" {...register("location")} />
              {errors.location && <p className="text-xs text-danger">{errors.location.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date début</Label>
                <Input type="date" {...register("startDate")} />
                {errors.startDate && <p className="text-xs text-danger">{errors.startDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Date fin</Label>
                <Input type="date" {...register("endDate")} />
                {errors.endDate && <p className="text-xs text-danger">{errors.endDate.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Capacité maximale</Label>
              <Input type="number" placeholder="200" {...register("maxCapacity", { valueAsNumber: true })} />
              {errors.maxCapacity && <p className="text-xs text-danger">{errors.maxCapacity.message}</p>}
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Créer la retraite
              </Button>
              <Link href="/retraites"><Button variant="outline" type="button">Annuler</Button></Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
