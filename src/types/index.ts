export type UserRole =
  | "super_admin"
  | "admin"
  | "hebergement"
  | "accueil";

export type RetreatStatus = "planifiee" | "en_cours" | "terminee" | "annulee";

export type ParticipantStatus =
  | "inscrit"
  | "confirme"
  | "arrive"
  | "parti"
  | "annule";

export type RoomStatus = "disponible" | "presque_pleine" | "complete";

export type NotificationType =
  | "inscription"
  | "chambre"
  | "arrivee"
  | "chambre_complete"
  | "depart";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  password?: string;
}

export interface Church {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Pavilion {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Room {
  id: string;
  number: string;
  pavilionId: string;
  capacity: number;
  gender: "homme" | "femme" | "mixte";
}

export interface Retreat {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  status: RetreatStatus;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface Participant {
  id: string;
  registrationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  gender: "homme" | "femme";
  church: string;
  retreatId: string;
  roomId?: string;
  qrCode?: string;
  status: ParticipantStatus;
  avatar: string;
  registeredAt: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  emergencyContact: EmergencyContact;
  notes?: string;
  source?: "public" | "admin" | "demo";
  feePaid?: boolean;
  feePaidAt?: string;
}

export interface ActivityLog {
  id: string;
  retreatId: string;
  action: string;
  description: string;
  timestamp: string;
  userId: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalParticipants: number;
  men: number;
  women: number;
  availableRooms: number;
  occupiedRooms: number;
  registered: number;
  arrived: number;
  checkedOut: number;
}

export interface PublicRegistrationInput {
  retreatId: string;
  fullName: string;
  email?: string;
  phone: string;
  gender: "homme" | "femme";
  emergencyContact: EmergencyContact;
  notes?: string;
}
