import type {
  ActivityLog,
  Church,
  Notification,
  Participant,
  Pavilion,
  Retreat,
  Room,
  User,
} from "@/types";

const FIRST_NAMES_M = [""];
const FIRST_NAMES_F = [""];
const LAST_NAMES = [""];

export const CHURCHES = [
  "Communauté Evangélique la présence de Dieu",
];

const LOCATIONS = [
  "Ascitech pigeon",
  "Retraite de Kinkole",
  "Domaine de Mbanza-Ngungu",
  "Centre La Grâce - Kisantu",
  "Camp de Matadi-Kibala",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function phone(): string {
  const prefix = pick(["+243 81", "+243 82", "+243 97", "+243 99"]);
  const num = Math.floor(Math.random() * 9000000 + 1000000);
  return `${prefix} ${String(num).slice(0, 3)} ${String(num).slice(3)}`;
}

function avatarUrl(name: string, gender: "homme" | "femme"): string {
  const bg = gender === "homme" ? "2563EB" : "DB2777";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=128`;
}

export const mockChurch: Church = {
  name: "Communauté Évangélique La Présence de Dieu",
  address: "M733+447, Kinshasa",
  phone: "+243 998 212 613 ",
  email: "contact@laprésencedeDieu.cd",
};

// Tableau des pavillons supprimé pour laisser place à la gestion Homme / Femme
export const mockPavilions: Pavilion[] = [];

export const mockRetreats: Retreat[] = [
  {
    id: "ret-1",
    name: "Grande Retraite Annuelle 2026",
    description: "Temps de partage, prière et enseignement.",
    location: LOCATIONS[0],
    startDate: "2026-02-08",
    endDate: "2026-08-08",
    maxCapacity: 550,
    status: "planifiee",
  },
  {
    id: "ret-2",
    name: "Retraite des Jeunes 2026",
    description: "Rencontre annuelle des jeunes de l'église pour la croissance spirituelle.",
    location: LOCATIONS[1],
    startDate: "2026-08-02",
    endDate: "2026-08-08",
    maxCapacity: 180,
    status: "planifiee",
  },
  {
    id: "ret-3",
    name: "Retraite des Leaders",
    description: "Formation et ressourcement pour les responsables d'église et leaders de cellules.",
    location: LOCATIONS[4],
    startDate: "2026-03-02",
    endDate: "2026-08-08",
    maxCapacity: 80,
    status: "en_cours",
  },
  {
    id: "ret-4",
    name: "Retraite de Noël 2025",
    description: "Célébration et méditation de l'avent en communion fraternelle.",
    location: LOCATIONS[2],
    startDate: "2026-08-02",
    endDate: "2025-08-08",
    maxCapacity: 200,
    status: "terminee",
  },
  {
    id: "ret-5",
    name: "Retraite des Femmes de Foi",
    description: "Temps de partage, prière et enseignement dédié aux femmes de l'église.",
    location: LOCATIONS[3],
    startDate: "2026-08-02",
    endDate: "2026-08-08",
    maxCapacity: 120,
    status: "planifiee",
  },
];

// MODIFICATION : Plus aucune chambre n'est créée automatiquement ici
export const mockRooms: Room[] = [];

function generateParticipants(): Participant[] {
  const participants: Participant[] = [];
  const activeRetreat = mockRetreats.find((r) => r.status === "en_cours")!;

  for (let i = 0; i < 200; i++) {
    const isMale = i % 2 === 0;
    const firstName = isMale ? pick(FIRST_NAMES_M) : pick(FIRST_NAMES_F);
    const lastName = pick(LAST_NAMES);
    const fullName = `${firstName} ${lastName}`;
    const gender = isMale ? "homme" : "femme";

    let status: Participant["status"] = "inscrit";
    if (i < 50) status = "arrive";
    else if (i < 70) status = "parti";
    else if (i < 120) status = "confirme";
    else if (i < 140) status = "inscrit";

    const regDate = new Date(2026, 0, 15 + (i % 30));

    participants.push({
      id: `part-${String(i + 1).padStart(4, "0")}`,
      registrationNumber: `REG-2026-${String(i + 1).padStart(4, "0")}`,
      fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.cd`,
      phone: phone(),
      gender,
      church: pick(CHURCHES),
      retreatId: activeRetreat.id,
      roomId: undefined, // Commencent tous sans chambre attribuée au départ
      status,
      avatar: avatarUrl(fullName, gender),
      registeredAt: regDate.toISOString(),
      checkedInAt: status === "arrive" || status === "parti"
        ? new Date(2026, 2, 1, 8 + (i % 6), i % 60).toISOString()
        : undefined,
      checkedOutAt: status === "parti"
        ? new Date(2026, 2, 3, 10 + (i % 4), i % 60).toISOString()
        : undefined,
      emergencyContact: {
        name: `${pick(FIRST_NAMES_M)} ${lastName}`,
        phone: phone(),
        relationship: pick(["Époux/se", "Parent", "Frère/Sœur", "Ami(e)", "Pasteur"]),
      },
    });
  }

  return participants;
}

export const mockParticipants: Participant[] = generateParticipants();

export const mockUsers: User[] = [
  {
    id: "user-1",
    fullName: "Abraham Oweteshe",
    email: "abrahamoweteshe@gmail.com",
    phone: "+243 81 111 0001",
    role: "super_admin",
    avatar: avatarUrl("Abraham Oweteshe", "homme"),
    password: "admin123",
  }
];

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "inscription",
    title: "Nouvelle inscription",
    message: "Thomas Mukendi vient de s'inscrire à la Retraite des Leaders.",
    read: false,
    createdAt: new Date(2026, 2, 7, 14, 30).toISOString(),
  },
  {
    id: "notif-2",
    type: "chambre",
    title: "Chambre attribuée",
    message: "Marie Kabongo a été assignée à une chambre de Femmes.",
    read: false,
    createdAt: new Date(2026, 2, 7, 13, 15).toISOString(),
  },
  {
    id: "notif-3",
    type: "arrivee",
    title: "Participant arrivé",
    message: "Jean-Pierre Tshibanda a effectué son check-in à 09:45.",
    read: true,
    createdAt: new Date(2026, 2, 7, 9, 45).toISOString(),
  },
  {
    id: "notif-5",
    type: "depart",
    title: "Départ enregistré",
    message: "Grace Mbuyi a validé son départ et libéré sa chambre.",
    read: true,
    createdAt: new Date(2026, 2, 6, 16, 20).toISOString(),
  },
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: "act-1",
    retreatId: "ret-3",
    action: "Inscription",
    description: "15 nouveaux participants inscrits",
    timestamp: new Date(2026, 1, 28, 10, 0).toISOString(),
    userId: "user-1",
  },
  {
    id: "act-3",
    retreatId: "ret-3",
    action: "Check-in",
    description: "50 participants enregistrés à l'arrivée",
    timestamp: new Date(2026, 2, 1, 9, 0).toISOString(),
    userId: "user-1",
  },
];

export function getRetreatParticipantCount(retreatId: string, participants: Participant[]): number {
  return participants.filter((p) => p.retreatId === retreatId && p.status !== "annule").length;
}

export function getRetreatSpotsRemaining(
  retreat: Retreat,
  participants: Participant[]
): number {
  return Math.max(0, retreat.maxCapacity - getRetreatParticipantCount(retreat.id, participants));
}

export function isRetreatOpenForRegistration(retreat: Retreat): boolean {
  return retreat.status === "planifiee" || retreat.status === "en_cours";
}

export function getRoomOccupants(roomId: string, participants: Participant[]): Participant[] {
  return participants.filter((p) => p.roomId === roomId && p.status !== "annule" && p.status !== "parti");
}

export function getRoomStatus(room: Room, participants: Participant[]): "disponible" | "presque_pleine" | "complete" {
  const occupants = getRoomOccupants(room.id, participants).length;
  if (occupants === 0) return "disponible";
  if (occupants >= room.capacity) return "complete";
  if (occupants >= room.capacity - 1) return "presque_pleine";
  return "disponible";
}

export function getPavilionStats(pavilionId: string, rooms: Room[], participants: Participant[]) {
  const pavilionRooms = rooms.filter((r) => r.pavilionId === pavilionId);
  const totalCapacity = pavilionRooms.reduce((sum, r) => sum + r.capacity, 0);
  const occupants = pavilionRooms.reduce(
    (sum, r) => sum + getRoomOccupants(r.id, participants).length,
    0
  );
  return {
    roomCount: pavilionRooms.length,
    occupants,
    totalCapacity,
    opacityRate: totalCapacity > 0 ? (occupants / totalCapacity) * 100 : 0,
  };
}

export const registrationTrend = [
  { date: "Jan", inscriptions: 12 },
  { date: "Fév", inscriptions: 28 },
  { date: "Mar", inscriptions: 45 },
  { date: "Avr", inscriptions: 18 },
  { date: "Mai", inscriptions: 32 },
  { date: "Jun", inscriptions: 25 },
];

export const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Administrateur",
  admin: "Administrateur",
  hebergement: "Responsable Hébergement",
  accueil: "Responsable Accueil",
};

export const STATUS_LABELS: Record<string, string> = {
  planifiee: "Planifiée",
  en_cours: "En cours",
  terminee: "Terminée",
  annulee: "Annulée",
  inscrit: "Inscrit",
  confirme: "Confirmé",
  arrive: "Arrivé",
  parti: "Parti",
  annule: "Annulé",
};