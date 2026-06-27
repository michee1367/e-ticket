"use client";

import { useState } from "react";
import { Search, LogOut, CheckCircle2, Loader2, IdCard } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useData } from "@/components/providers/data-provider";
import { mockPavilions } from "@/mock-data";
import type { Participant } from "@/types";

export default function CheckOutPage() {
  const { participants, rooms, checkOut } = useData();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setCheckedOut(false);
    await new Promise((r) => setTimeout(r, 500));

    const q = query.toLowerCase();
    const found = participants.find(
      (p) =>
        (p.fullName.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.registrationNumber.toLowerCase().includes(q)) &&
        p.status === "arrive"
    );

    setResult(found || null);
    setLoading(false);
    if (!found) toast.error("Aucun participant arrivé trouvé avec ces critères");
  };

  const handleCheckOut = async () => {
    if (!result) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    checkOut(result.id);
    setCheckedOut(true);
    setLoading(false);
    toast.success(`Départ confirmé pour ${result.fullName}`);
  };

  const room = result?.roomId ? rooms.find((r) => r.id === result.roomId) : null;
  const pavilion = room ? mockPavilions.find((p) => p.id === room.pavilionId) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10 mb-4">
          <LogOut className="h-8 w-8 text-warning" />
        </div>
        <h1 className="text-2xl font-bold text-text">Check-Out</h1>
        <p className="text-slate-500 text-sm mt-1">Validation des départs</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Rechercher un participant</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Nom, téléphone ou n° inscription..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Rechercher"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={result.avatar} alt={result.fullName} />
                <AvatarFallback>{result.fullName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-xl font-bold leading-none">{result.fullName}</h2>
                {/* MODIFICATION : Harmonisation graphique du numéro de badge avec l'icône IdCard */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <Badge variant="outline" className="font-mono font-bold text-xs bg-slate-50 border-slate-200 text-primary px-1.5 py-0.5">
                    <IdCard className="h-3 w-3 mr-1 text-slate-400" />
                    {result.registrationNumber || "Sans Badge"}
                  </Badge>
                </div>
              </div>
              {checkedOut ? (
                <Badge variant="warning" className="ml-auto flex items-center gap-1 self-start mt-1">
                  <CheckCircle2 className="h-3 w-3" /> Départ confirmé
                </Badge>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-6 p-4 rounded-lg bg-slate-50">
              <div><span className="text-slate-500">Chambre :</span> <span className="font-semibold">{room?.number || "—"}</span></div>
              <div><span className="text-slate-500">Pavillon :</span> {pavilion?.name || "—"}</div>
            </div>

            {!checkedOut && (
              <Button className="w-full flex items-center justify-center gap-2" variant="outline" onClick={handleCheckOut} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                Valider le départ
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}