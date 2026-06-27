"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useData } from "@/components/providers/data-provider";
import { PublicRegistrationForm } from "@/features/inscription/public-registration-form";

interface PageProps {
  params: Promise<{ retreatId: string }>;
}

export default function InscriptionRetreatPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const retreatId = resolvedParams.retreatId;
  
  const { retreats } = useData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const retreat = retreats.find((r) => r.id === retreatId);

  if (!mounted) return null;

  // Si on essaie d'accéder à un ID qui n'existe pas
  if (!retreat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-sm">
          <p className="text-lg font-medium text-slate-800 mb-2">Retraite introuvable</p>
          <Link href="/inscription">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Retour
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Si tout est bon, on affiche le formulaire de ton dossier features
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto mb-6">
        <Link href="/inscription">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
          </Button>
        </Link>
      </div>
      
      <PublicRegistrationForm retreat={retreat} />
    </div>
  );
}