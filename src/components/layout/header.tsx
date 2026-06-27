"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, LogOut, ChevronDown, Menu } from "lucide-react"; // Étape A : On ajoute l'icône "Menu"
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { useData } from "@/components/providers/data-provider";
import Link from "next/link";

// Étape B : On définit les propriétés attendues par le Header (pour ne pas bloquer TypeScript)
interface HeaderProps {
  onMenuToggle?: () => void;
}

// Étape C : On passe la fonction 'onMenuToggle' en paramètre de notre composant
export function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth();
  const { notifications } = useData();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  // Sécurité et correction dynamique de l'affichage
  const currentEmail = user?.email || "";
  const currentName = 
    currentEmail.toLowerCase() === "abrahamoweteshe@gmail.com" && user?.fullName?.includes("Mukendi")
      ? "Abraham Oweteshe"
      : (user?.fullName || "Utilisateur");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/participants?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const initials = currentName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    // Étape D : On ajoute 'gap-2' pour l'affichage mobile
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white/80 backdrop-blur-sm px-6 gap-2">
      
      {/* Étape E : On insère le bouton Burger. 
          'lg:hidden' cache le bouton sur PC. Sur téléphone, il s'affiche et déclenche 'onMenuToggle'. */}
      <button 
        type="button"
        onClick={onMenuToggle}
        className="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-50 transition shrink-0"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Tout ton reste du code reste strictement identique à l'origine */}
      <form onSubmit={handleSearch} className="relative w-full max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Rechercher un participant, une retraite..."
          className="pl-9 bg-slate-50 border-transparent focus:bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <div className="flex items-center gap-4 shrink-0">
        <Link href="/notifications" className="relative rounded-lg p-2 hover:bg-slate-100 transition-colors">
          <Bell className="h-5 w-5 text-slate-600" />
          {unread > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
              {unread}
            </Badge>
          )}
        </Link>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-100 transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={currentName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-text">{currentName}</p>
              <p className="text-xs text-slate-500">{currentEmail}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-border bg-white py-1 shadow-lg">
                <Link
                  href="/parametres"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Paramètres
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}