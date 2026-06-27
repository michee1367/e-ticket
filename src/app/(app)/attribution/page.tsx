"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { toast } from "sonner";
import { GripVertical, Users, BedDouble } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/components/providers/data-provider";
import { mockPavilions, getRoomOccupants } from "@/mock-data";
import type { Participant } from "@/types";

function DraggableParticipant({ 
  participant, 
  isHighlighted 
}: { 
  participant: Participant; 
  isHighlighted: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: participant.id,
    data: { participant },
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, opacity: isDragging ? 0.5 : 1 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-grab active:cursor-grabbing ${
        isHighlighted 
          ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-md animate-pulse" 
          : "border-border bg-white hover:shadow-sm"
      }`}
      {...listeners}
      {...attributes}
    >
      <GripVertical className={`h-4 w-4 shrink-0 ${isHighlighted ? "text-emerald-500" : "text-slate-300"}`} />
      <Avatar className="h-8 w-8">
        <AvatarImage src={participant.avatar} />
        <AvatarFallback>{participant.fullName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isHighlighted ? "text-emerald-900" : "text-text"}`}>
          {participant.fullName}
        </p>
        {/* AJOUT : Affichage du numéro de badge à la place du genre seul */}
        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
          <span className="font-mono font-semibold text-primary bg-primary/5 px-1 rounded text-[10px]">
            {participant.registrationNumber || "Sans Badge"}
          </span>
          <span className="capitalize text-[11px]">• {participant.gender}</span>
        </p>
      </div>
      {isHighlighted && (
        <Badge variant="success" className="text-[10px] bg-emerald-600 animate-bounce">
          À placer !
        </Badge>
      )}
    </div>
  );
}

function DroppableRoom({
  roomId,
  number,
  pavilionName,
  capacity,
  occupants,
  color,
}: {
  roomId: string;
  number: string;
  pavilionName: string;
  capacity: number;
  occupants: Participant[];
  color: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: roomId });
  const available = capacity - occupants.length;
  const isFull = available <= 0;

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-xl border-2 border-dashed transition-colors ${
        isOver ? "border-primary bg-primary/5" : isFull ? "border-red-200 bg-red-50/50" : "border-border bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-semibold text-sm">Chambre {number}</p>
          <p className="text-xs text-slate-500">{pavilionName}</p>
        </div>
        <Badge variant={isFull ? "danger" : available === 1 ? "warning" : "success"}>
          {occupants.length}/{capacity}
        </Badge>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-3">
        <div className="h-full rounded-full transition-all" style={{ width: `${(occupants.length / capacity) * 100}%`, backgroundColor: color }} />
      </div>
      <div className="space-y-1.5 min-h-[40px]">
        {occupants.map((o) => (
          <div key={o.id} className="flex items-center justify-between gap-2 p-1 rounded hover:bg-slate-50 border border-transparent transition-colors">
            <div className="flex items-center gap-2 text-xs min-w-0 flex-1">
              <Avatar className="h-5 w-5">
                <AvatarImage src={o.avatar} />
                <AvatarFallback className="text-[10px]">{o.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="truncate font-medium">{o.fullName}</span>
            </div>
            {/* AJOUT : Numéro de badge discret à droite du nom dans l'occupant de la chambre */}
            <span className="font-mono text-[9px] text-slate-400 bg-slate-100 px-1 rounded shrink-0">
              {o.registrationNumber || "N/A"}
            </span>
          </div>
        ))}
        {!isFull && (
          <p className="text-xs text-slate-400 text-center py-1">
            {available} place{available > 1 ? "s" : ""} restante{available > 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}

function AttributionContent() {
  const { rooms, participants, assignRoom, getUnassignedParticipants } = useData();
  const [activeParticipant, setActiveParticipant] = useState<Participant | null>(null);
  
  const searchParams = useSearchParams();
  const selectedParticipantId = searchParams.get("select");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const sortedUnassigned = useMemo(() => {
    const unassignedList = getUnassignedParticipants();
    if (!selectedParticipantId) return unassignedList;

    return [...unassignedList].sort((a, b) => {
      if (a.id === selectedParticipantId) return -1;
      if (b.id === selectedParticipantId) return 1;
      return 0;
    });
  }, [participants, selectedParticipantId]);

  const handleDragStart = (event: DragStartEvent) => {
    const p = participants.find((p) => p.id === event.active.id);
    if (p) setActiveParticipant(p);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveParticipant(null);
    const { active, over } = event;
    if (!over) return;

    const participantId = active.id as string;
    const roomId = over.id as string;
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    const occupants = getRoomOccupants(roomId, participants);
    if (occupants.length >= room.capacity) {
      toast.error("Cette chambre est complète");
      return;
    }

    assignRoom(participantId, roomId);
    const p = participants.find((p) => p.id === participantId);
    toast.success(`${p?.fullName} assigné(e) à la chambre ${room.number}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Attribution des chambres</h1>
        <p className="text-slate-500 text-sm mt-1">Glissez-déposez les participants dans les chambres</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Non affectés ({sortedUnassigned.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
              {sortedUnassigned.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">Tous les participants sont affectés</p>
              ) : (
                sortedUnassigned.map((p) => (
                  <DraggableParticipant 
                    key={p.id} 
                    participant={p} 
                    isHighlighted={p.id === selectedParticipantId} 
                  />
                ))
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BedDouble className="h-4 w-4" />
                Chambres disponibles
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
              {rooms.map((room) => {
                const pavilion = mockPavilions.find((p) => p.id === room.pavilionId);
                const occupants = getRoomOccupants(room.id, participants);
                return (
                  <DroppableRoom
                    key={room.id}
                    roomId={room.id}
                    number={room.number}
                    pavilionName={pavilion?.name || ""}
                    capacity={room.capacity}
                    occupants={occupants}
                    color={pavilion?.color || "#2563EB"}
                  />
                );
              })}
            </CardContent>
          </Card>
        </div>

        <DragOverlay>
          {activeParticipant && (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-primary bg-white shadow-lg opacity-90">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activeParticipant.avatar} />
                <AvatarFallback>{activeParticipant.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium">{activeParticipant.fullName}</p>
                {/* AJOUT : Badge également visible sur l'élément volant pendant le drag */}
                <p className="text-[10px] font-mono text-primary font-semibold">
                  {activeParticipant.registrationNumber || "Sans Badge"}
                </p>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default function AttributionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Chargement de l'attribution...</div>}>
      <CardContent className="p-0">
        <AttributionContent />
      </CardContent>
    </Suspense>
  );
}