"use client";

import { useEffect, useState } from "react";
import {
  Users, BedDouble, DoorOpen, LogIn, LogOut, UserPlus, Mars, Venus,
} from "lucide-react";
import { KpiCard } from "@/features/dashboard/kpi-card";
import { DashboardCharts } from "@/features/dashboard/charts";
import { useData } from "@/components/providers/data-provider";

export default function DashboardPage() {
  const { getStats, participants, rooms = [] } = useData();
  const [loading, setLoading] = useState(true);
  const stats = getStats();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Calcul direct des places occupées et de la capacité totale par genre (Homme / Femme)
  const roomData = [
    {
      name: "Chambres Hommes",
      capacity: rooms
        .filter((r) => r.gender === "homme")
        .reduce((sum, r) => sum + r.capacity, 0),
      occupied: participants.filter((p) => {
        const room = rooms.find((r) => r.id === p.roomId);
        return room && room.gender === "homme";
      }).length,
    },
    {
      name: "Chambres Femmes",
      capacity: rooms
        .filter((r) => r.gender === "femme")
        .reduce((sum, r) => sum + r.capacity, 0),
      occupied: participants.filter((p) => {
        const room = rooms.find((r) => r.id === p.roomId);
        return room && room.gender === "femme";
      }).length,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Tableau de bord</h1>
        <p className="text-slate-500 text-sm mt-1">Vue d&apos;ensemble de la retraite en cours</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <KpiCard title="Total participants" value={stats.totalParticipants} icon={<Users className="h-4 w-4" />} trend={12} loading={loading} />
        <KpiCard title="Hommes" value={stats.men} icon={<Mars className="h-4 w-4" />} color="bg-blue-100 text-blue-600" loading={loading} />
        <KpiCard title="Femmes" value={stats.women} icon={<Venus className="h-4 w-4" />} color="bg-pink-100 text-pink-600" loading={loading} />
        <KpiCard title="Chambres disponibles" value={stats.availableRooms} icon={<DoorOpen className="h-4 w-4" />} color="bg-green-100 text-green-600" loading={loading} />
        <KpiCard title="Chambres occupées" value={stats.occupiedRooms} icon={<BedDouble className="h-4 w-4" />} color="bg-amber-100 text-amber-600" loading={loading} />
        <KpiCard title="Inscrits" value={stats.registered} icon={<UserPlus className="h-4 w-4" />} trend={8} loading={loading} />
        <KpiCard title="Arrivés" value={stats.arrived} icon={<LogIn className="h-4 w-4" />} color="bg-green-100 text-green-600" trend={15} loading={loading} />
        <KpiCard title="Départs enregistrés" value={stats.checkedOut} icon={<LogOut className="h-4 w-4" />} color="bg-slate-100 text-slate-600" loading={loading} />
      </div>

      <DashboardCharts men={stats.men} women={stats.women} roomData={roomData} />
    </div>
  );
}