"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Eye, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/components/providers/data-provider";
import { getRetreatParticipantCount, STATUS_LABELS } from "@/mock-data";
import { formatDate } from "@/lib/utils";

const statusVariant: Record<string, "default" | "success" | "secondary" | "warning" | "danger"> = {
  planifiee: "secondary",
  en_cours: "success",
  terminee: "default",
  annulee: "danger",
};

export default function RetraitesPage() {
  const { retreats, participants, deleteRetreat } = useData();
  const [search, setSearch] = useState("");

  const filtered = retreats.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Supprimer la retraite "${name}" ?`)) {
      deleteRetreat(id);
      toast.success("Retraite supprimée");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Retraites</h1>
          <p className="text-slate-500 text-sm mt-1">{retreats.length} retraites enregistrées</p>
        </div>
        <Link href="/retraites/nouvelle">
          <Button><Plus className="h-4 w-4" /> Nouvelle retraite</Button>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input placeholder="Rechercher..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Liste des retraites</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-slate-50">
                  <th className="px-6 py-3 text-left font-medium text-slate-500">Nom</th>
                  <th className="px-6 py-3 text-left font-medium text-slate-500">Date début</th>
                  <th className="px-6 py-3 text-left font-medium text-slate-500">Date fin</th>
                  <th className="px-6 py-3 text-left font-medium text-slate-500">Lieu</th>
                  <th className="px-6 py-3 text-left font-medium text-slate-500">Capacité</th>
                  <th className="px-6 py-3 text-left font-medium text-slate-500">Inscrits</th>
                  <th className="px-6 py-3 text-left font-medium text-slate-500">Statut</th>
                  <th className="px-6 py-3 text-right font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((retreat) => (
                  <tr key={retreat.id} className="border-b border-border hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{retreat.name}</td>
                    <td className="px-6 py-4 text-slate-600">{formatDate(retreat.startDate)}</td>
                    <td className="px-6 py-4 text-slate-600">{formatDate(retreat.endDate)}</td>
                    <td className="px-6 py-4 text-slate-600">{retreat.location}</td>
                    <td className="px-6 py-4">{retreat.maxCapacity}</td>
                    <td className="px-6 py-4">{getRetreatParticipantCount(retreat.id, participants)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant[retreat.status]}>{STATUS_LABELS[retreat.status]}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/retraites/${retreat.id}`}>
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                        </Link>
                        <Link href={`/retraites/${retreat.id}/edit`}>
                          <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(retreat.id, retreat.name)}>
                          <Trash2 className="h-4 w-4 text-danger" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
