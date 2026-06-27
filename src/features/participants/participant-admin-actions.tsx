"use client";

import { useState, useMemo, useEffect } from "react";
import { BedDouble, CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useData } from "@/components/providers/data-provider";
import { mockPavilions, getRoomOccupants } from "@/mock-data";
import { formatDateTime } from "@/lib/utils";
import type { Participant } from "@/types";

interface ParticipantAdminActionsProps {
  participant: Participant;
}

export function ParticipantAdminActions({ participant }: ParticipantAdminActionsProps) {
  const { rooms, participants, assignRoom, confirmParticipationFee } = useData();
  const [selectedRoomId, setSelectedRoomId] = useState(participant.roomId ?? "");
  const [assigning, setAssigning] = useState(false);
  const [confirmingFee, setConfirmingFee] = useState(false);

  useEffect(() => {
    setSelectedRoomId(participant.roomId ?? "");
  }, [participant.roomId]);

  const availableRooms = useMemo(() => {
    return rooms.filter((room) => {
      const genderOk = room.gender === "mixte" || room.gender === participant.gender;
      if (!genderOk) return false;
      const occupants = getRoomOccupants(room.id, participants).filter((p) => p.id !== participant.id);
      return occupants.length < room.capacity;
    });
  }, [rooms, participants, participant.id, participant.gender]);

  const handleAssignRoom = async () => {
    if (!selectedRoomId) {
      toast.error("Veuillez sélectionner une chambre");
      return;
    }
    setAssigning(true);
    await new Promise((r) => setTimeout(r, 500));
    assignRoom(participant.id, selectedRoomId);
    const room = rooms.find((r) => r.id === selectedRoomId);
    setAssigning(false);
    toast.success(`Chambre ${room?.number} attribuée à ${participant.fullName}`);
  };

  const handleRemoveRoom = async () => {
    setAssigning(true);
    await new Promise((r) => setTimeout(r, 400));
    assignRoom(participant.id, undefined);
    setSelectedRoomId("");
    setAssigning(false);
    toast.success("Attribution de chambre retirée");
  };

  const handleConfirmFee = async () => {
    setConfirmingFee(true);
    await new Promise((r) => setTimeout(r, 600));
    confirmParticipationFee(participant.id);
    setConfirmingFee(false);
    toast.success("Paiement des frais de participation confirmé");
  };

  const currentRoom = participant.roomId ? rooms.find((r) => r.id === participant.roomId) : null;
  const currentPavilion = currentRoom ? mockPavilions.find((p) => p.id === currentRoom.pavilionId) : null;

  return (
    <Card className="md:col-span-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-base">Actions administratives</CardTitle>
        <CardDescription>Gérer le paiement et l&apos;attribution de chambre</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Paiement des frais */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-sm">Frais de participation</h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg bg-slate-50 p-4">
            <div>
              <p className="text-sm font-medium">
                {participant.feePaid ? "Paiement confirmé" : "En attente de paiement"}
              </p>
              {participant.feePaid && participant.feePaidAt && (
                <p className="text-xs text-slate-500 mt-1">
                  Confirmé le {formatDateTime(participant.feePaidAt)}
                </p>
              )}
              {!participant.feePaid && (
                <p className="text-xs text-slate-500 mt-1">
                  Confirmez une fois que le participant a réglé ses frais sur place.
                </p>
              )}
            </div>
            {participant.feePaid ? (
              <Badge variant="success" className="flex items-center gap-1 w-fit">
                <CheckCircle2 className="h-3 w-3" /> Payé
              </Badge>
            ) : (
              <Button
                variant="success"
                size="sm"
                onClick={handleConfirmFee}
                disabled={confirmingFee || participant.status === "annule" || participant.status === "parti"}
              >
                {confirmingFee ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Confirmer le paiement
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Attribution chambre */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-sm">Attribution de chambre</h3>
          </div>

          {currentRoom && (
            <div className="rounded-lg border border-border bg-white p-3 text-sm">
              <span className="text-slate-500">Chambre actuelle : </span>
              <span className="font-medium">{currentRoom.number}</span>
              {currentPavilion && (
                <span className="text-slate-500"> · {currentPavilion.name}</span>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
            <div className="space-y-2">
              <Label htmlFor="roomSelect">Sélectionner une chambre</Label>
              <Select
                id="roomSelect"
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                disabled={participant.status === "annule" || participant.status === "parti"}
              >
                <option value="">— Choisir une chambre —</option>
                {availableRooms.map((room) => {
                  const pavilion = mockPavilions.find((p) => p.id === room.pavilionId);
                  const occupants = getRoomOccupants(room.id, participants).filter((p) => p.id !== participant.id);
                  const places = room.capacity - occupants.length;
                  return (
                    <option key={room.id} value={room.id}>
                      {room.number} · {pavilion?.name} · {places} place{places > 1 ? "s" : ""} libre{places > 1 ? "s" : ""}
                    </option>
                  );
                })}
              </Select>
              {availableRooms.length === 0 && !currentRoom && (
                <p className="text-xs text-amber-600">Aucune chambre compatible disponible</p>
              )}
            </div>
            <Button
              onClick={handleAssignRoom}
              disabled={assigning || !selectedRoomId || participant.status === "annule" || participant.status === "parti"}
            >
              {assigning ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Attribuer
            </Button>
            {currentRoom && (
              <Button variant="outline" onClick={handleRemoveRoom} disabled={assigning}>
                Retirer
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
