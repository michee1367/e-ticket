"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar"; // Ajuste le chemin si nécessaire
import { Header } from "./header";   // Ajuste le chemin si nécessaire

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  // 1. On crée l'état pour piloter l'ouverture de la Sidebar sur mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 2. On connecte la Sidebar à l'état et à la fonction de fermeture */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 3. Décalage automatique sur PC (lg:pl-64) pour laisser la place à la Sidebar fixe */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        
        {/* 4. On passe la fonction d'ouverture au Header pour son bouton Burger */}
        <Header onMenuToggle={() => setSidebarOpen(true)} />

        {/* 5. Contenu principal de l'application */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}