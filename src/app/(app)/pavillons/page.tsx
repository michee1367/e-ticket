"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/components/providers/data-provider";
import { Users, DoorOpen } from "lucide-react";

// Données statiques des pavillons
const pavilions = [
  {
    id: "pavilion-male",
    name: "Pavillon Hommes",
    description: "Hébergement réservé aux hommes",
    color: "#3b82f6", // bleu
    gender: "homme",
  },
  {
    id: "pavilion-female",
    name: "Pavillon Femmes",
    description: "Hébergement réservé aux femmes",
    color: "#ec4899", // rose
    gender: "femme",
  },
];

export default function PavillonsPage() {
  // On récupère participants ET getPavilionStats du Contexte
  const { participants, getPavilionStats } = useData();

  // Filtrer les participants globaux par sexe pour le récapitulatif
  const maleParticipants = participants.filter(p => p.gender === "homme");
  const femaleParticipants = participants.filter(p => p.gender === "femme");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pavillons</h1>
        <p className="text-slate-500 text-sm mt-1">
          {pavilions.length} pavillons d'hébergement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pavilions.map((pavilion) => {
          // Appel de la fonction globale pour récupérer les données du pavillon
          const stats = getPavilionStats(pavilion.id);
          
          return (
            <Card key={pavilion.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-1.5" style={{ backgroundColor: pavilion.color }} />
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">{pavilion.name}</CardTitle>
                <p className="text-sm text-slate-500">{pavilion.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {/* Nombre de chambres */}
                  <div className="text-center p-4 rounded-lg bg-slate-50">
                    <DoorOpen className="h-6 w-6 mx-auto mb-2 text-slate-500" />
                    <p className="text-3xl font-bold text-slate-800">{stats.roomCount}</p>
                    <p className="text-xs text-slate-500 mt-1">Chambres</p>
                  </div>
                  
                  {/* Nombre d'occupants réels */}
                  <div className="text-center p-4 rounded-lg bg-slate-50">
                    <Users className="h-6 w-6 mx-auto mb-2 text-slate-500" />
                    <p className="text-3xl font-bold text-slate-800">{stats.occupants}</p>
                    <p className="text-xs text-slate-500 mt-1">Occupants</p>
                  </div>
                </div>

                {/* Message récapitulatif */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-400">
                    {pavilion.gender === "homme" ? "Hommes" : "Femmes"} logé(e)s : {stats.occupants} / {pavilion.gender === "homme" ? maleParticipants.length : femaleParticipants.length} inscrit(e)s
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Carte récapitulative globale */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {maleParticipants.length}
              </p>
              <p className="text-xs text-slate-500">Hommes inscrits</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-600">
                {femaleParticipants.length}
              </p>
              <p className="text-xs text-slate-500">Femmes inscrites</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200 text-center">
            <p className="text-sm font-medium text-slate-600">
              Total participants inscrits : {participants.length}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}