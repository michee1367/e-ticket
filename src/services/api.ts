const API_URL = process.env.NEXT_PUBLIC_API_URL;//
//const API_URL = "http://localhost:3001/api";

import {
  mockChurch,
  mockRetreats,
  mockRooms, // <-- On garde mockRooms uniquement pour la toute première initialisation
} from "@/mock-data";

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
}

export async function loginRequest(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Identifiants incorrects");
  
}
export async function fetchDatabase() {
  console.log(`${API_URL}/admin/database`)
  const res = await fetch(`${API_URL}/admin/database`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  // 1. Gestion des erreurs d'authentification
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("auth_token");

    const currentPath = window.location.pathname;

    // Définition des pages "publiques" où l'on ne veut PAS forcer une redirection
    const isLoginPage = currentPath === "/login";
    const isRootPage = currentPath === "/";
    const isRegisterPage = currentPath === "/register";
    const isInscriptionSubPage = currentPath.startsWith("/inscription/"); // Gère /inscription/step1, /inscription/bravo, etc.

    // Si l'utilisateur n'est sur AUCUNE de ces pages, on le redirige vers le login
    if (!isLoginPage && !isRootPage && !isRegisterPage && !isInscriptionSubPage) {
      window.location.href = "/login";
    }
    
    throw new Error("Session expirée");
  }

  // 2. Gestion des autres erreurs serveurs
  if (!res.ok) {
    throw new Error("Erreur serveur lors de la récupération des données");
  }

  // 3. Récupération et enrichissement des données
  const db = await res.json();
  db.retreats = mockRetreats;
  db.church = mockChurch;

  return db;
}