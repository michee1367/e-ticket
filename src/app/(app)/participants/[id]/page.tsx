"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useData } from "@/components/providers/data-provider";
import { ParticipantAdminActions } from "@/features/participants/participant-admin-actions";
import { mockPavilions, STATUS_LABELS } from "@/mock-data";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function ParticipantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { participants, rooms } = useData();
  const participant = participants.find((p) => p.id === id);

  if (!participant) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Participant introuvable</p>
        <Link href="/participants"><Button className="mt-4">Retour</Button></Link>
      </div>
    );
  }

  const room = participant.roomId ? rooms.find((r) => r.id === participant.roomId) : null;
  const pavilion = room ? mockPavilions.find((p) => p.id === room.pavilionId) : null;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Link href="/participants"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <Avatar className="h-14 w-14">
          <AvatarImage src={participant.avatar} />
          <AvatarFallback>{participant.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-text">{participant.fullName}</h1>
          <p className="text-slate-500 text-sm">{participant.registrationNumber}</p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <Badge>{STATUS_LABELS[participant.status]}</Badge>
          {participant.source === "public" && (
            <Badge variant="success">Inscription publique</Badge>
          )}
          {participant.feePaid ? (
            <Badge variant="success">Frais payés</Badge>
          ) : (
            <Badge variant="warning">Frais en attente</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" /> Informations personnelles</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" />{participant.phone}</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" />{participant.email}</div>
            <div><span className="text-slate-500">Sexe :</span> <span className="capitalize">{participant.gender}</span></div>
            <div><span className="text-slate-500">Église :</span> {participant.church}</div>
            <div><span className="text-slate-500">Inscription :</span> {formatDate(participant.registeredAt)}</div>
            {participant.notes && (
              <div><span className="text-slate-500">Remarques :</span> {participant.notes}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Heart className="h-4 w-4" /> Contact d&apos;urgence</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div><span className="text-slate-500">Nom :</span> {participant.emergencyContact.name}</div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" />{participant.emergencyContact.phone}</div>
            <div><span className="text-slate-500">Lien :</span> {participant.emergencyContact.relationship}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" /> Hébergement</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {room ? (
              <>
                <div><span className="text-slate-500">Pavillon :</span> {pavilion?.name}</div>
                <div><span className="text-slate-500">Chambre :</span> {room.number}</div>
              </>
            ) : (
              <p className="text-slate-400">Aucune chambre attribuée</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Présence</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Statut arrivée</span>
              {participant.checkedInAt ? (
                <Badge variant="success">Arrivé · {formatDateTime(participant.checkedInAt)}</Badge>
              ) : (
                <Badge variant="secondary">En attente</Badge>
              )}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Statut départ</span>
              {participant.checkedOutAt ? (
                <Badge variant="warning">Parti · {formatDateTime(participant.checkedOutAt)}</Badge>
              ) : (
                <Badge variant="secondary">Non parti</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <ParticipantAdminActions participant={participant} />
      </div>
    </div>
  );
}
