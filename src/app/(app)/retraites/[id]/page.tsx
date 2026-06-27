"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Users, BedDouble, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/components/providers/data-provider";
import { STATUS_LABELS, mockPavilions, getPavilionStats, getRoomOccupants } from "@/mock-data";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function RetraiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { retreats, participants, rooms, activityLogs, users } = useData();
  const retreat = retreats.find((r) => r.id === id);

  if (!retreat) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Retraite introuvable</p>
        <Link href="/retraites"><Button className="mt-4">Retour</Button></Link>
      </div>
    );
  }

  const retreatParticipants = participants.filter((p) => p.retreatId === id);
  const men = retreatParticipants.filter((p) => p.gender === "homme").length;
  const women = retreatParticipants.filter((p) => p.gender === "femme").length;
  const logs = activityLogs.filter((l) => l.retreatId === id);

  const roomStats = mockPavilions.map((p) => {
    const stats = getPavilionStats(p.id, rooms, participants);
    return { ...p, ...stats };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/retraites"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text">{retreat.name}</h1>
            <Badge>{STATUS_LABELS[retreat.status]}</Badge>
          </div>
          <p className="text-slate-500 text-sm mt-1">{retreat.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Participants</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-3xl font-bold">{retreatParticipants.length}</span>
              <span className="text-slate-400">/ {retreat.maxCapacity}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Répartition H/F</CardTitle></CardHeader>
          <CardContent>
            <p className="text-lg"><span className="font-bold text-blue-600">{men}</span> hommes · <span className="font-bold text-pink-600">{women}</span> femmes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Dates</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm">{formatDate(retreat.startDate)} → {formatDate(retreat.endDate)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><BedDouble className="h-4 w-4" /> Occupation des chambres</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {roomStats.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{p.name}</span>
                  <span className="text-slate-500">{p.occupants}/{p.totalCapacity}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${p.opacityRate}%`, backgroundColor: p.color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Informations générales</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 leading-relaxed">{retreat.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500">Lieu :</span> {retreat.location}</div>
              <div><span className="text-slate-500">Capacité :</span> {retreat.maxCapacity}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4" /> Historique des activités</CardTitle></CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">Aucune activité enregistrée</p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => {
                const user = users.find((u) => u.id === log.userId);
                return (
                  <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-slate-500">{log.description}</p>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      <p>{formatDateTime(log.timestamp)}</p>
                      <p>{user?.fullName}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
