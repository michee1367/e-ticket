"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useData } from "@/components/providers/data-provider";
import { mockPavilions, getRoomOccupants, getRoomStatus } from "@/mock-data";
import { 
  Plus, 
  Trash2, 
  Users, 
  X, 
  Bed, 
  Building,
  MoveHorizontal 
} from "lucide-react";

const statusConfig = {
  disponible: { label: "Disponible", variant: "success" as const },
  presque_pleine: { label: "Presque pleine", variant: "warning" as const },
  complete: { label: "Complète", variant: "danger" as const },
};

export default function ChambresPage() {
  // Récupération propre des données et des fonctions globales du Provider
  const { 
    rooms: globalRooms, 
    participants, 
    deleteRoom,               
    addRoom,
    updateParticipant 
  } = useData();

  const rooms = globalRooms || [];
  
  // États locaux pour la modale et la vue détaillée
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // État local pour suivre quel participant on est en train de déplacer
  const [movingParticipantId, setMovingParticipantId] = useState<string | null>(null);

  // Formulaire de nouvelle chambre
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newRoomCapacity, setNewRoomCapacity] = useState("4");
  const [newRoomGender, setNewRoomGender] = useState<"homme" | "femme">("homme"); // Remplacement par un état genre par défaut

  // Fonction pour ajouter une chambre
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber.trim()) return;

    const newRoom = {
      number: newRoomNumber,
      capacity: parseInt(newRoomCapacity),
      // Reste compatible avec tes anciennes structures s'il cherche un pavillon par genre
      pavilionId: newRoomGender === "homme" ? "pavilion-male" : "pavilion-female",
      gender: newRoomGender,
    };

    addRoom(newRoom);

    setNewRoomNumber("");
    setNewRoomGender("homme");
    setIsAddModalOpen(false);
  };

  // Fonction pour supprimer une chambre
  const handleDeleteRoom = (roomId: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (confirm("Êtes-vous sûr de vouloir supprimer cette chambre ?")) {
      deleteRoom(roomId);
    }
  };

  // Fonction pour changer le participant de chambre
  const handleMoveParticipant = (participantId: string, targetRoomId: string) => {
    if (!targetRoomId) return;

    if (updateParticipant) {
      updateParticipant(participantId, { roomId: targetRoomId });
    }

    setMovingParticipantId(null);
    setSelectedRoom(null);
  };

  return (
    <div className="space-y-6 relative">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Chambres</h1>
          <p className="text-slate-500 text-sm mt-1">
            {rooms.length} chambres · {rooms.reduce((s, r) => s + r.capacity, 0)} places
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 self-start">
          <Plus className="h-4 w-4" /> Ajouter une chambre
        </Button>
      </div>

      {/* Grille des chambres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms.map((room) => {
          const pavilion = mockPavilions.find((p) => p.id === room.pavilionId);
          const occupants = getRoomOccupants(room.id, participants);
          const status = getRoomStatus(room, participants);
          const config = statusConfig[status] || { label: "Disponible", variant: "success" };
          const available = room.capacity - occupants.length;

          return (
            <Card 
              key={room.id} 
              className="hover:shadow-md transition-all cursor-pointer border hover:border-primary/45 group relative"
              onClick={() => setSelectedRoom({ ...room, occupants, pavilion })}
            >
              <CardHeader className="pb-3 pr-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Chambre {room.number}</CardTitle>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </div>
                {/* Affiche dynamiquement le type de chambre à la place du pavillon */}
                <p className="text-xs font-semibold capitalize text-slate-500">
                  Type : {room.gender === "homme" ? "Chambre Hommes" : "Chambre Femmes"}
                </p>
              </CardHeader>
              
              {/* Bouton supprimer au survol */}
              <button
                onClick={(e) => handleDeleteRoom(room.id, e)}
                className="absolute top-4 right-3 p-1.5 rounded-md text-slate-400 hover:text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Supprimer la chambre"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <CardContent>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-slate-500">Capacité</span>
                  <span className="font-medium">{occupants.length}/{room.capacity}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${(occupants.length / room.capacity) * 100}%`, 
                      backgroundColor: room.gender === "homme" ? '#0284c7' : '#db2777' // Bleu pour homme, Rose pour femme
                    }}
                  />
                </div>
                {occupants.length > 0 ? (
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {occupants.slice(0, 4).map((o) => (
                        <Avatar key={o.id} className="h-7 w-7 border-2 border-white">
                          <AvatarImage src={o.avatar} />
                          <AvatarFallback className="text-xs">{o.fullName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ))}
                      {occupants.length > 4 && (
                        <div className="h-7 w-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                          +{occupants.length - 4}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-primary font-medium group-hover:underline">Voir tout</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    {available} place{available > 1 ? "s" : ""} disponible{available > 1 ? "s" : ""}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* MODAL 1 : AJOUTER UNE CHAMBRE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg text-text">Nouvelle chambre</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddRoom} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Numéro de chambre / Nom</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 104, 205..."
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* PARTIE MODIFIÉE : Remplacement des pavillons par Homme / Femme */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Réservée pour :</label>
                <select
                  value={newRoomGender}
                  onChange={(e) => setNewRoomGender(e.target.value as "homme" | "femme")}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="homme">Hommes</option>
                  <option value="femme">Femmes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Capacité maximale (lits)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={newRoomCapacity}
                  onChange={(e) => setNewRoomCapacity(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Annuler</Button>
                <Button type="submit">Créer la chambre</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2 : DETAILS DE LA CHAMBRE */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div 
              className="p-6 border-b border-slate-100 flex items-center justify-between" 
              style={{ borderLeft: `6px solid ${selectedRoom.gender === "homme" ? '#0284c7' : '#db2777'}` }}
            >
              <div>
                <h3 className="font-bold text-lg text-text">Chambre {selectedRoom.number}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 capitalize">
                  <Building className="h-3 w-3" /> Réservée aux {selectedRoom.gender}s
                </p>
              </div>
              <button onClick={() => { setSelectedRoom(null); setMovingParticipantId(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between text-sm sm:text-base mb-4 bg-slate-50 p-2.5 rounded-lg">
                <span className="text-slate-500 flex items-center gap-1.5"><Users className="h-4 w-4" /> Occupants</span>
                <span className="font-semibold text-text">{selectedRoom.occupants.length} / {selectedRoom.capacity} Places occupées</span>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                {selectedRoom.occupants.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">Cette chambre est actuellement vide.</p>
                ) : (
                  selectedRoom.occupants.map((participant: any) => {
                    const isMoving = movingParticipantId === participant.id;

                    const availableTargetRooms = rooms.filter((r) => {
                      const roomOccupants = getRoomOccupants(r.id, participants);
                      // Filtre pour ne proposer que des chambres du même sexe qui ont de la place
                      return r.id !== selectedRoom.id && r.gender === participant.gender && roomOccupants.length < r.capacity;
                    });

                    return (
                      <div key={participant.id} className="flex flex-col p-2 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100 bg-white gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback>{participant.fullName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-text">{participant.fullName}</p>
                              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono font-semibold text-primary bg-primary/5 px-1 rounded text-[11px]">
                                  {participant.registrationNumber || "Sans Badge"}
                                </span>
                                <span>•</span>
                                <span>{participant.phone || "Pas de numéro"}</span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant={participant.gender === "homme" ? "default" : "secondary"} className="text-[10px]">
                              {participant.gender === "homme" ? "M" : "F"}
                            </Badge>
                            
                            <button
                              onClick={() => setMovingParticipantId(isMoving ? null : participant.id)}
                              className={`p-1.5 rounded-md border transition-colors ${isMoving ? 'bg-primary text-white border-primary' : 'text-slate-400 hover:text-primary hover:bg-primary/5 border-slate-200'}`}
                              title="Changer de chambre"
                            >
                              <MoveHorizontal className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {isMoving && (
                          <div className="mt-1 p-2 bg-slate-100 rounded-md border border-slate-200 animate-in fade-in slide-in-from-top-1 duration-100">
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">Choisir la chambre de destination :</label>
                            <select
                              defaultValue=""
                              onChange={(e) => handleMoveParticipant(participant.id, e.target.value)}
                              className="w-full h-8 px-2 rounded border border-slate-300 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                              <option value="" disabled>-- Sélectionner une chambre ({participant.gender}) --</option>
                              {availableTargetRooms.map((r) => {
                                const targetOccupants = getRoomOccupants(r.id, participants);
                                return (
                                  <option key={r.id} value={r.id}>
                                    Chambre {r.number} (Dédiée {r.gender}s - {targetOccupants.length}/{r.capacity} lits)
                                  </option>
                                );
                              })}
                              {availableTargetRooms.length === 0 && (
                                <option disabled>Aucune autre chambre de ce sexe n'a de place libre</option>
                              )}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex justify-end pt-4 mt-4 border-t border-slate-100">
                <Button onClick={() => { setSelectedRoom(null); setMovingParticipantId(null); }} className="w-full sm:w-auto">Fermer</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}