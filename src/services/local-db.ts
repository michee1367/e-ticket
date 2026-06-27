"use client";

import type {
  ActivityLog,
  Church,
  Notification,
  Participant,
  Retreat,
  Room, // <-- Ajout du type Room
} from "@/types";
import {
  mockChurch,
  mockRetreats,
  mockRooms, // <-- On garde mockRooms uniquement pour la toute première initialisation
} from "@/mock-data";

const STORAGE_KEY = "retraitespirit_local_db";
const DB_VERSION = 1;

export interface LocalDatabase {
  version: number;
  church: Church;
  retreats: Retreat[];
  participants: Participant[];
  rooms: Room[]; // <-- On ajoute les chambres à la structure de la base de données
  notifications: Notification[];
  activityLogs: ActivityLog[];
  lastUpdated: string;
}

// Initialisation de l'application à vide (0 participants) mais avec tes chambres prêtes
function createSeedDatabase(): LocalDatabase {
  return {
    version: DB_VERSION,
    church: mockChurch,
    retreats: mockRetreats,
    participants: [], // Tableau vide : aucun participant fictif
    rooms: mockRooms,  // Chargé au tout premier démarrage, mais deviendra 100% modifiable ensuite !
    notifications: [],
    activityLogs: [],
    lastUpdated: new Date().toISOString(),
  };
}

export function loadLocalDatabase(): LocalDatabase {
  if (typeof window === "undefined") {
    return createSeedDatabase();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = createSeedDatabase();
      saveLocalDatabase(seed);
      return seed;
    }

    const parsed = JSON.parse(raw) as LocalDatabase;
    if (parsed.version !== DB_VERSION) {
      const seed = createSeedDatabase();
      saveLocalDatabase(seed);
      return seed;
    }

    return parsed;
  } catch {
    const seed = createSeedDatabase();
    saveLocalDatabase(seed);
    return seed;
  }
}

export function saveLocalDatabase(data: Omit<LocalDatabase, "lastUpdated" | "version">): void {
  if (typeof window === "undefined") return;

  const payload: LocalDatabase = {
    ...data,
    version: DB_VERSION,
    lastUpdated: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function resetLocalDatabase(): LocalDatabase {
  const seed = createSeedDatabase();
  saveLocalDatabase(seed);
  return seed;
}

export function exportLocalDatabase(): string {
  const data = loadLocalDatabase();
  return JSON.stringify(data, null, 2);
}

export function getNextRegistrationNumber(participants: Participant[]): string {
  const year = new Date().getFullYear();
  if (!participants || participants.length === 0) {
    return `REG-${year}-0001`;
  }
  
  const numbers = participants
    .map((p) => p.registrationNumber ? p.registrationNumber.match(/REG-\d+-(\d+)/) : null)
    .filter(Boolean)
    .map((m) => parseInt(m![1], 10));

  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  return `REG-${year}-${String(next).padStart(4, "0")}`;
}