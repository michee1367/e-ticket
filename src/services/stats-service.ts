import type { DashboardStats, Participant, Room } from "@/types";
import { getRoomOccupants } from "@/mock-data";

export function computeDashboardStats(participants: Participant[], rooms: Room[]): DashboardStats {
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
}
