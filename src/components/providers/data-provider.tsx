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
import { mockUsers, getRoomOccupants, getPavilionStats,
  mockChurch,
  mockRetreats } from "@/mock-data";
import { fetchDatabase } from "@/services/api";

const API_ADMIN_URL = process.env.NEXT_PUBLIC_API_ADMIN_URL;
//const API_ADMIN_URL = "http://localhost:3001/api/admin";

const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL;
//const API_PUBLIC_URL = "http://localhost:3001/api/public";



interface DataContextType {
  isReady: boolean;
  church: Church;
  retreats: Retreat[];
  participants: Participant[];
  rooms: Room[];
  users: User[];
  notifications: Notification[];
  activityLogs: ActivityLog[];
  updateParticipantStatus: (participantId: string, status: string) => void;
  updateParticipant?: (id: string, data: Partial<Participant>) => void;
  assignRoomToParticipant: (participantId: string, roomId: string | null | undefined) => void;
  assignRoom: (participantId: string, roomId: string | null | undefined) => void;
  confirmParticipationFee: (participantId: string) => void;
  checkIn: (participantId: string) => void;
  checkOut: (participantId: string) => void;
  markNotificationRead?: (id: string) => void;
  markAllNotificationsRead?: () => void;
  updateChurch: (data: Partial<Church>) => void;
  addRoom: (room: Omit<Room, "id">) => void;
  updateRoom: (id: string, data: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  registerPublicParticipant: (data: PublicRegistrationInput) => Promise<Participant>;
  getStats: () => any;
  getUnassignedParticipants: () => Participant[];
  resetDatabase?: () => void;
  getRoomWithOccupants: (roomId: string) => { room: Room; occupants: Participant[] };
  getPavilionStats: (id: string) => { roomCount: number; occupants: number };
  addRetreat?: (retreat: Omit<Retreat, "id">) => void;
  updateRetreat?: (id: string, data: Partial<Retreat>) => void;
  deleteRetreat?: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [church, setChurch] = useState<Church>({ name: "", address: "", phone: "", email: "" });
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users] = useState<User[]>(mockUsers);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Hydratation initiale depuis MySQL via l'API
  useEffect(() => {
    async function loadData() {
      try {
        console.log("load data")
        const db = await fetchDatabase();
        console.log(db)
        setChurch(db.church || mockChurch);
        setRetreats(db.retreats || mockRetreats);
        setParticipants(db.participants || []);
        setRooms(db.rooms || []);
        setNotifications(db.notifications || []);
        setActivityLogs(db.activityLogs || []);
        setIsReady(true);
      } catch (error) {
        setChurch(mockChurch);
        setRetreats( mockRetreats);
        setParticipants( []);
        setRooms( []);
        setNotifications( []);
        setActivityLogs( []);
        setIsReady(true);
        console.log("error data")
        console.error("Erreur de chargement de l'API", error);
      }
    }
    loadData();
  }, []);

  // 🛠️ ACTIONS INTERMUTÉES AVEC L'API NODE.JS + APPROCHE OPTIMISTE POUR LE UI

  const addRoom = useCallback(async (room: Omit<Room, "id">) => {
    const res = await fetch(`${API_ADMIN_URL}/rooms`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(room),
    });
    const newRoom = await res.json();
    setRooms((prev) => [...prev, newRoom]);
  }, []);

  const updateRoom = useCallback(async (id: string, data: Partial<Room>) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    await fetch(`${API_ADMIN_URL}/rooms/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }, []);

  const deleteRoom = useCallback(async (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    await fetch(`${API_ADMIN_URL}/rooms/${id}`, { method: "DELETE", headers: getAuthHeaders() });
  }, []);

  const updateParticipantStatus = useCallback(async (participantId: string, status: string) => {
    setParticipants((prev) => prev.map((p) => (p.id === participantId ? { ...p, status: status as any } : p)));
    await fetch(`${API_ADMIN_URL}/participants/${participantId}/status`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
  }, []);

  const assignRoom = useCallback(async (participantId: string, roomId: string | null | undefined) => {
    setParticipants((prev) => prev.map((p) => (p.id === participantId ? { ...p, roomId: roomId || undefined } : p)));
    await fetch(`${API_ADMIN_URL}/participants/${participantId}/assign-room`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ roomId: roomId || null }),
    });
  }, []);

  const confirmParticipationFee = useCallback(async (participantId: string) => {
    setParticipants((prev) => prev.map((p) => p.id === participantId ? { ...p, feePaid: true, status: "confirme" } : p));
    await fetch(`${API_ADMIN_URL}/participants/${participantId}/confirm-fee`, { method: "PUT", headers: getAuthHeaders() });
  }, []);

  const checkIn = useCallback(async (participantId: string) => {
    setParticipants((prev) => prev.map((p) => p.id === participantId ? { ...p, status: "arrive" } : p));
    await fetch(`${API_ADMIN_URL}/participants/${participantId}/checkin`, { method: "PUT", headers: getAuthHeaders() });
  }, []);

  const checkOut = useCallback(async (participantId: string) => {
    setParticipants((prev) => prev.map((p) => p.id === participantId ? { ...p, status: "parti", roomId: undefined } : p));
    await fetch(`${API_ADMIN_URL}/participants/${participantId}/checkout`, { method: "PUT", headers: getAuthHeaders() });
  }, []);

  const updateChurch = useCallback(async (data: Partial<Church>) => {
    setChurch((prev) => ({ ...prev, ...data }));
    await fetch(`${API_ADMIN_URL}/church`, { method: "PUT", headers: getAuthHeaders(), body: JSON.stringify(data) });
  }, []);

  // Formulaire d'inscription public (Sans Token dans le header)
  const registerPublicParticipant = useCallback(async (data: PublicRegistrationInput): Promise<Participant> => {
    const res = await fetch(`${API_PUBLIC_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const newParticipant = await res.json();
    setParticipants((prev) => [...prev, newParticipant]);
    return newParticipant;
  }, []);

  // 📊 LOGIQUE DE CALCULS ET STATS FRONTEND (Inchangé)
  const getStats = useCallback(() => {
    const active = participants.filter((p) => p.status !== "annule");
    const occupiedRooms = rooms.filter((r) => getRoomOccupants(r.id, participants).length > 0).length;
    return {
      totalParticipants: active.length,
      men: active.filter((p) => p.gender === "homme").length,
      women: active.filter((p) => p.gender === "femme").length,
      availableRooms: rooms.length - occupiedRooms,
      occupiedRooms,
      registered: active.filter((p) => p.status === "inscrit" || p.status === "confirme").length,
      arrived: active.filter((p) => p.status === "arrive").length,
      checkedOut: active.filter((p) => p.status === "parti").length,
    };
  }, [participants, rooms]);

  const getUnassignedParticipants = useCallback(() => {
    return participants.filter((p) => !p.roomId && p.status !== "annule" && p.status !== "parti");
  }, [participants]);

  const getRoomWithOccupants = useCallback((roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    const targetRoom: Room = room || { id: roomId, number: "Inconnue", capacity: 4, pavilionId: "1", gender: "mixte" };
    return { room: targetRoom, occupants: getRoomOccupants(roomId, participants) };
  }, [rooms, participants]);

  const value = useMemo(() => ({
    isReady, church, retreats, participants, rooms, users, notifications, activityLogs,
    updateParticipantStatus, assignRoomToParticipant: assignRoom, assignRoom, confirmParticipationFee,
    checkIn, checkOut, updateChurch, addRoom, updateRoom, deleteRoom, registerPublicParticipant,
    getStats, getUnassignedParticipants, getRoomWithOccupants, getPavilionStats: (id: string) => getPavilionStats(id, rooms, participants)
  }), [isReady, church, retreats, participants, rooms, users, notifications, activityLogs, assignRoom, updateParticipantStatus, confirmParticipationFee, checkIn, checkOut, updateChurch, addRoom, updateRoom, deleteRoom, registerPublicParticipant, getStats, getUnassignedParticipants, getRoomWithOccupants]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Connexion sécurisée à la base MySQL...</p>
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