"use client";

import Link from "next/link";
import { Building2, DoorOpen, BedDouble, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useData } from "@/components/providers/data-provider";
import { mockPavilions, getPavilionStats } from "@/mock-data";
import { formatPercent } from "@/lib/utils";

export default function HebergementPage() {
  const { rooms, participants } = useData();

  const totalRooms = rooms.length;
  const totalCapacity = rooms.reduce((s, r) => s + r.capacity, 0);
  const totalOccupants = participants.filter((p) => p.roomId && p.status !== "parti" && p.status !== "annule").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Hébergement</h1>
        <p className="text-slate-500 text-sm mt-1">Vue d&apos;ensemble de l&apos;hébergement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockPavilions.length}</p>
              <p className="text-sm text-slate-500">Pavillons</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
              <DoorOpen className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalRooms}</p>
              <p className="text-sm text-slate-500">Chambres</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <BedDouble className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalOccupants}/{totalCapacity}</p>
              <p className="text-sm text-slate-500">Occupants</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockPavilions.map((pavilion) => {
          const stats = getPavilionStats(pavilion.id, rooms, participants);
          return (
            <Card key={pavilion.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: pavilion.color }} />
                  <CardTitle className="text-base">{pavilion.name}</CardTitle>
                </div>
                <p className="text-sm text-slate-500">{pavilion.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div><p className="text-xl font-bold">{stats.roomCount}</p><p className="text-xs text-slate-500">Chambres</p></div>
                  <div><p className="text-xl font-bold">{stats.occupants}</p><p className="text-xs text-slate-500">Occupants</p></div>
                  <div><p className="text-xl font-bold">{formatPercent(stats.opacityRate)}</p><p className="text-xs text-slate-500">Occupation</p></div>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${stats.opacityRate}%`, backgroundColor: pavilion.color }} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Link href="/pavillons"><Button variant="outline">Voir les pavillons</Button></Link>
        <Link href="/chambres"><Button variant="outline">Voir les chambres</Button></Link>
        <Link href="/attribution"><Button>Attribution des chambres <ArrowRight className="h-4 w-4" /></Button></Link>
      </div>
    </div>
  );
}
