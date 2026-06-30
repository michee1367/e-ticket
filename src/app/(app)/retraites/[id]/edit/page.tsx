"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/components/providers/data-provider";

const schema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(3),
  startDate: z.string(),
  endDate: z.string(),
  maxCapacity: z.number({ error: "Capacité requise" }).min(1),
  status: z.enum(["planifiee", "en_cours", "terminee", "annulee"]),
});

type FormData = z.infer<typeof schema>;

export default function EditRetraitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { retreats, updateRetreat } = useData();
  const router = useRouter();
  const retreat = retreats.find((r) => r.id === id);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (retreat) {
      reset({
        name: retreat.name,
        description: retreat.description,
        location: retreat.location,
        startDate: retreat.startDate,
        endDate: retreat.endDate,
        maxCapacity: retreat.maxCapacity,
        status: retreat.status,
      });
    }
  }, [retreat, reset]);

  if (!retreat) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Retraite introuvable</p>
        <Link href="/retraites"><Button className="mt-4">Retour</Button></Link>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 600));
    //updateRetreat(id, data);
    toast.success("Retraite modifiée");
    router.push(`/retraites/${id}`);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/retraites/${id}`}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold">Modifier la retraite</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>{retreat.name}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2"><Label>Nom</Label><Input {...register("name")} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea rows={4} {...register("description")} /></div>
            <div className="space-y-2"><Label>Lieu</Label><Input {...register("location")} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date début</Label><Input type="date" {...register("startDate")} /></div>
              <div className="space-y-2"><Label>Date fin</Label><Input type="date" {...register("endDate")} /></div>
            </div>
            <div className="space-y-2"><Label>Capacité</Label><Input type="number" {...register("maxCapacity", { valueAsNumber: true })} /></div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select {...register("status")}>
                <option value="planifiee">Planifiée</option>
                <option value="en_cours">En cours</option>
                <option value="terminee">Terminée</option>
                <option value="annulee">Annulée</option>
              </Select>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
