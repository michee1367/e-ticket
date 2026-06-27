"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  DoorOpen,
  LogIn,
  LogOut,
  Bell,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/participants", label: "Participants", icon: Users },
  { href: "/chambres", label: "Chambres", icon: DoorOpen },
  { href: "/check-in", label: "Check-In", icon: LogIn },
  { href: "/check-out", label: "Check-Out", icon: LogOut },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/parametres", label: "Paramètres", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Arrière-plan noir transparent sur téléphone quand la barre est ouverte */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Barre latérale avec transitions fluides */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-white transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}>
        
        {/* En-tête de la Sidebar */}
        <div className="flex h-16 items-center justify-between bg-blue-600 border-b border-blue-700 px-6 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden shrink-0">
              <img 
                src="/logo-jeunesse.png" 
                alt="Logo Jeunesse" 
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Jeunesse CEPD</p>
              <p className="text-[11px] text-blue-100">Gestion d&apos;église</p>
            </div>
          </div>

          {/* Bouton de fermeture 'X' visible uniquement sur téléphone */}
          <button 
            type="button"
            onClick={onClose}
            className="lg:hidden text-blue-100 hover:text-white p-1 rounded-md hover:bg-blue-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose} // 🟢 AJOUT : Ferme automatiquement la sidebar sur mobile après le clic
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:bg-slate-50 hover:text-text"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-4">
          <p className="text-xs text-slate-400 text-center">©️ Jeunesse CEPD</p>
        </div>
      </aside>
    </>
  );
}