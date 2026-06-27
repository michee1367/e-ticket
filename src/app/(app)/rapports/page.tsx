"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/components/providers/data-provider";
import { mockPavilions, getPavilionStats, getRoomOccupants } from "@/mock-data";
import { formatPercent } from "@/lib/utils";
import { Users, UserCheck, UserX, TrendingUp, BedDouble, DoorOpen } from "lucide-react";

export default function RapportsPage() {
  const { participants, rooms, getStats } = useData();
  const stats = getStats();

  const present = participants.filter((p) => p.status === "arrive").length;
  const absent = stats.totalParticipants - present - stats.checkedOut;
  const participationRate = stats.totalParticipants > 0 ? (present / stats.totalParticipants) * 100 : 0;

  const occupiedRooms = rooms.filter((r) => getRoomOccupants(r.id, participants).length > 0).length;
  const freeRooms = rooms.length - occupiedRooms;
  const occupancyRate = rooms.length > 0 ? (occupiedRooms / rooms.length) * 100 : 0;

  const pavilionData = mockPavilions.map((p) => {
    const s = getPavilionStats(p.id, rooms, participants);
    return {
      name: p.name.replace("Pavillon ", ""),
      occupants: s.occupants,
      capacity: s.totalCapacity,
      rooms: s.roomCount,
      rate: s.opacityRate,
      color: p.color,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Rapports</h1>
        <p className="text-slate-500 text-sm mt-1">Statistiques et analyses de la retraite</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Rapport général</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div><p className="text-2xl font-bold">{stats.totalParticipants}</p><p className="text-xs text-slate-500">Total participants</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-success" />
              <div><p className="text-2xl font-bold">{present}</p><p className="text-xs text-slate-500">Présents</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <UserX className="h-8 w-8 text-danger" />
              <div><p className="text-2xl font-bold">{absent}</p><p className="text-xs text-slate-500">Absents</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-warning" />
              <div><p className="text-2xl font-bold">{formatPercent(participationRate)}</p><p className="text-xs text-slate-500">Taux participation</p></div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Rapport hébergement</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <DoorOpen className="h-8 w-8 text-primary" />
              <div><p className="text-2xl font-bold">{rooms.length}</p><p className="text-xs text-slate-500">Chambres totales</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <BedDouble className="h-8 w-8 text-success" />
              <div><p className="text-2xl font-bold">{occupiedRooms}</p><p className="text-xs text-slate-500">Occupées</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <DoorOpen className="h-8 w-8 text-slate-400" />
              <div><p className="text-2xl font-bold">{freeRooms}</p><p className="text-xs text-slate-500">Libres</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-warning" />
              <div><p className="text-2xl font-bold">{formatPercent(occupancyRate)}</p><p className="text-xs text-slate-500">Taux occupation</p></div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Rapport par pavillon</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={pavilionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value, name) => [value, name === "occupants" ? "Occupants" : "Capacité"]} />
              <Legend />
              <Bar dataKey="occupants" name="Occupants" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="capacity" name="Capacité" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {pavilionData.map((p) => (
              <div key={p.name} className="text-center p-3 rounded-lg bg-slate-50">
                <p className="font-semibold text-sm">{p.name}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: p.color }}>{formatPercent(p.rate)}</p>
                <p className="text-xs text-slate-500">{p.occupants}/{p.capacity} · {p.rooms} ch.</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
