"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import type {
  Church,
  Notification,
  Participant,
  PublicRegistrationInput,
  Retreat,
  Room,
  User,
  ActivityLog,
} from "@/types";
import {
  mockRooms,
  mockUsers,
  getRoomOccupants,
  getPavilionStats,
} from "@/mock-data";
import {
  loadLocalDatabase,
  saveLocalDatabase,
  resetLocalDatabase,
  getNextRegistrationNumber,
} from "@/services/local-db";

interface DataContextType {
  isReady: boolean;
  church: Church;
  retreats: Retreat[];
  participants: Participant[];
  updateParticipantStatus: (participantId: string, status: string) => void;
  assignRoomToParticipant: (participantId: string, roomId: string | null | undefined) => void;
  rooms: Room[];
  users: User[];
  notifications: Notification[];
  activityLogs: ActivityLog[];
  addRetreat: (retreat: Omit<Retreat, "id">) => void;
  updateRetreat: (id: string, data: Partial<Retreat>) => void;
  deleteRetreat: (id: string) => void;
  updateParticipant: (id: string, data: Partial<Participant>) => void;
  assignRoom: (participantId: string, roomId: string | null | undefined) => void;
  confirmParticipationFee: (participantId: string) => void;
  checkIn: (participantId: string) => void;
  checkOut: (participantId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateChurch: (data: Partial<Church>) => void;
  registerPublicParticipant: (data: PublicRegistrationInput) => Participant;
  resetDatabase: () => void;
  getStats: () => {
    totalParticipants: number;
    men: number;
    women: number;
    availableRooms: number;
    occupiedRooms: number;
    registered: number;
    arrived: number;
    checkedOut: number;
  };
  getUnassignedParticipants: () => Participant[];
  getRoomWithOccupants: (roomId: string) => { room: Room; occupants: Participant[] };
  getPavilionStats: (id: string) => { roomCount: number; occupants: number };
  addRoom: (room: Omit<Room, "id">) => void;
  updateRoom: (id: string, data: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

type PersistableState = {
  church: Church;
  retreats: Retreat[];
  participants: Participant[];
  rooms: Room[];
  notifications: Notification[];
  activityLogs: ActivityLog[];
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [church, setChurch] = useState<Church>({ name: "", address: "", phone: "", email: "" });
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users] = useState<User[]>(mockUsers);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const persist = useCallback((state: PersistableState) => {
    saveLocalDatabase(state);
  }, []);

  useEffect(() => {
    const db = loadLocalDatabase() as any;
    setChurch(db.church);
    setRetreats(db.retreats);
    setParticipants(db.participants);
    // Correction ici : Accepte un tableau vide sans recharger les mockRooms par défaut
    setRooms(Array.isArray(db.rooms) ? db.rooms : mockRooms);
    setNotifications(db.notifications);
    setActivityLogs(db.activityLogs);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    persist({ church, retreats, participants, rooms, notifications, activityLogs });
  }, [church, retreats, participants, rooms, notifications, activityLogs, isReady, persist]);

  const addRetreat = useCallback((retreat: Omit<Retreat, "id">) => {
    const newRetreat: Retreat = { ...retreat, id: `ret-${Date.now()}` };
    setRetreats((prev) => [...prev, newRetreat]);
    setActivityLogs((prev) => [
      {
        id: `act-${Date.now()}`,
        retreatId: newRetreat.id,
        action: "Création",
        description: `Retraite "${newRetreat.name}" créée`,
        timestamp: new Date().toISOString(),
        userId: "user-1",
      },
      ...prev,
    ]);
  }, []);

  const updateRetreat = useCallback((id: string, data: Partial<Retreat>) => {
    setRetreats((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  }, []);

  const deleteRetreat = useCallback((id: string) => {
    setRetreats((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateParticipant = useCallback((id: string, data: Partial<Participant>) => {
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }, []);

  const addRoom = useCallback((room: Omit<Room, "id">) => {
    const newRoom: Room = { 
      ...room, 
      id: `room-${Date.now()}`
    };
    setRooms((prev) => [...prev, newRoom]);
  }, []);

  const updateRoom = useCallback((id: string, data: Partial<Room>) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  }, []);

  const deleteRoom = useCallback((id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    setParticipants((prev) =>
      prev.map((p) => (p.roomId === id ? { ...p, roomId: undefined } : p))
    );
  }, []);

  const updateParticipantStatus = useCallback((participantId: string, status: string) => {
    const participant = participants.find((p) => p.id === participantId);
    
    setParticipants((prev) =>
      prev.map((p) => (p.id === participantId ? { ...p, status: status as any } : p))
    );

    if (participant) {
      setActivityLogs((prev) => [
        {
          id: `act-${Date.now()}`,
          retreatId: participant.retreatId,
          action: "Mise à jour statut",
          description: `Statut de ${participant.fullName} modifié en "${status}"`,
          timestamp: new Date().toISOString(),
          userId: "user-1",
        },
        ...prev,
      ]);
    }
  }, [participants]);

  const assignRoomToParticipant = useCallback((participantId: string, roomId: string | null | undefined) => {
    const participant = participants.find((p) => p.id === participantId);
    const room = roomId ? rooms.find((r) => r.id === roomId) : undefined;

    setParticipants((prev) =>
      prev.map((p) => (p.id === participantId ? { ...p, roomId: roomId || undefined } : p))
    );

    if (participant && room) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: "chambre",
          title: "Chambre assignée",
          message: `${participant.fullName} a reçu la chambre ${room.number}.`,
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  }, [participants, rooms]);

  const assignRoom = useCallback((participantId: string, roomId: string | null | undefined) => {
    const participant = participants.find((p) => p.id === participantId);
    const room = roomId ? rooms.find((r) => r.id === roomId) : undefined;

    setParticipants((prev) =>
      prev.map((p) => (p.id === participantId ? { ...p, roomId: roomId || undefined } : p))
    );

    if (participant && room) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: "chambre",
          title: "Chambre attribuée",
          message: `${participant.fullName} a été assigné(e) à la chambre ${room.number}.`,
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setActivityLogs((prev) => [
        {
          id: `act-${Date.now()}`,
          retreatId: participant.retreatId,
          action: "Attribution chambre",
          description: `Chambre ${room.number} attribuée à ${participant.fullName}`,
          timestamp: new Date().toISOString(),
          userId: "user-1",
        },
        ...prev,
      ]);
    } else if (participant && !roomId) {
      setActivityLogs((prev) => [
        {
          id: `act-${Date.now()}`,
          retreatId: participant.retreatId,
          action: "Retrait chambre",
          description: `${participant.fullName} a été retiré(e) de sa chambre`,
          timestamp: new Date().toISOString(),
          userId: "user-1",
        },
        ...prev,
      ]);
    }
  }, [participants, rooms]);

  const confirmParticipationFee = useCallback((participantId: string) => {
    const participant = participants.find((p) => p.id === participantId);
    if (!participant || participant.feePaid) return;

    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId
          ? {
              ...p,
              feePaid: true,
              feePaidAt: new Date().toISOString(),
              status: p.status === "inscrit" ? ("confirme" as const) : p.status,
            }
          : p
      )
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: "inscription",
        title: "Paiement confirmé",
        message: `Les frais de participation de ${participant.fullName} ont été confirmés.`,
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    setActivityLogs((prev) => [
      {
        id: `act-${Date.now()}`,
        retreatId: participant.retreatId,
        action: "Paiement",
        description: `Frais de participation confirmés pour ${participant.fullName}`,
        timestamp: new Date().toISOString(),
        userId: "user-1",
      },
      ...prev,
    ]);
  }, [participants]);

  const checkIn = useCallback((participantId: string) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId
          ? { ...p, status: "arrive" as const, checkedInAt: new Date().toISOString() }
          : p
      )
    );
  }, []);

  const checkOut = useCallback((participantId: string) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId
          ? { ...p, status: "parti" as const, checkedOutAt: new Date().toISOString(), roomId: undefined }
          : p
      )
    );
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const updateChurch = useCallback((data: Partial<Church>) => {
    setChurch((prev) => ({ ...prev, ...data }));
  }, []);

  const registerPublicParticipant = useCallback((data: PublicRegistrationInput): Participant => {
    const registrationNumber = getNextRegistrationNumber(participants);
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=${data.gender === "homme" ? "2563EB" : "DB2777"}&color=fff&size=128`;

    const newParticipant: Participant = {
      id: `part-${Date.now()}`,
      registrationNumber,
      badgeNumber:undefined,
      fullName: data.fullName,
      email: data.email?.trim() || "—",
      phone: data.phone,
      gender: data.gender,
      church: church.name,
      retreatId: data.retreatId,
      status: "inscrit",
      avatar,
      registeredAt: new Date().toISOString(),
      emergencyContact: data.emergencyContact,
      notes: data.notes,
      source: "public",
    };

    setParticipants((prev) => [...prev, newParticipant]);

    const retreat = retreats.find((r) => r.id === data.retreatId);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: "inscription",
        title: "Nouvelle inscription publique",
        message: `${data.fullName} vient de réserver sa place pour ${retreat?.name ?? "une retraite"}.`,
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    setActivityLogs((prev) => [
      {
        id: `act-${Date.now()}`,
        retreatId: data.retreatId,
        action: "Inscription publique",
        description: `${data.fullName} (${registrationNumber}) inscrit(e) via le formulaire public`,
        timestamp: new Date().toISOString(),
        userId: "public",
      },
      ...prev,
    ]);

    return newParticipant;
  }, [participants, retreats, church.name]);

  const resetDatabase = useCallback(() => {
    const seed = resetLocalDatabase() as any;
    setChurch(seed.church);
    setRetreats(seed.retreats);
    setParticipants(seed.participants);
    setRooms(seed.rooms || mockRooms);
    setNotifications(seed.notifications);
    setActivityLogs(seed.activityLogs);
  }, []);

  const getStats = useCallback(() => {
    const active = participants.filter((p) => p.status !== "annule");
    const men = active.filter((p) => p.gender === "homme").length;
    const women = active.filter((p) => p.gender === "femme").length;
    const occupiedRooms = rooms.filter((r) => getRoomOccupants(r.id, participants).length > 0).length;
    return {
      totalParticipants: active.length,
      men,
      women,
      availableRooms: rooms.length - occupiedRooms,
      occupiedRooms,
      registered: active.filter((p) => p.status === "inscrit" || p.status === "confirme").length,
      arrived: active.filter((p) => p.status === "arrive").length,
      checkedOut: active.filter((p) => p.status === "parti").length,
    };
  }, [participants, rooms]);

  const getUnassignedParticipants = useCallback(() => {
    return participants.filter(
      (p) => !p.roomId && p.status !== "annule" && p.status !== "parti"
    );
  }, [participants]);

  const getRoomWithOccupants = useCallback(
    (roomId: string) => {
      const room = rooms.find((r) => r.id === roomId);
      const targetRoom: Room = room || { 
        id: roomId, 
        number: "Inconnue", 
        capacity: 4, 
        pavilionId: "1",
        gender: "mixte" as const
      };
      return { room: targetRoom, occupants: getRoomOccupants(roomId, participants) };
    },
    [rooms, participants]
  );

  const value = useMemo(
    () => ({
      isReady,
      church,
      retreats,
      participants,
      rooms,
      users,
      notifications,
      activityLogs,
      addRetreat,
      updateRetreat,
      deleteRetreat,
      updateParticipant,
      updateParticipantStatus,
      assignRoomToParticipant,
      assignRoom,
      confirmParticipationFee,
      checkIn,
      checkOut,
      markNotificationRead,
      markAllNotificationsRead,
      updateChurch,
      registerPublicParticipant,
      resetDatabase,
      getStats,
      getUnassignedParticipants,
      getRoomWithOccupants,
      getPavilionStats: (id: string) => getPavilionStats(id, rooms, participants),
      addRoom,
      updateRoom,
      deleteRoom,
    }),
    [
      isReady,
      church,
      retreats,
      participants,
      rooms,
      users,
      notifications,
      activityLogs,
      addRetreat,
      updateRetreat,
      deleteRetreat,
      updateParticipant,
      updateParticipantStatus,
      assignRoomToParticipant,
      assignRoom,
      confirmParticipationFee,
      checkIn,
      checkOut,
      markNotificationRead,
      markAllNotificationsRead,
      updateChurch,
      registerPublicParticipant,
      resetDatabase,
      getStats,
      getUnassignedParticipants,
      getRoomWithOccupants,
      addRoom,
      updateRoom,
      deleteRoom,
    ]
  );

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}