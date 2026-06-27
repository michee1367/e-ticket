"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Eye, Plus, Check, X, Hotel } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/components/providers/data-provider";
import { STATUS_LABELS } from "@/mock-data";
import type { Participant } from "@/types";

const statusVariant: Record<string, "default" | "success" | "secondary" | "warning" | "danger"> = {
  inscrit: "secondary",
  confirme: "default",
  arrive: "success",
  parti: "warning",
  annule: "danger",
};

export default function ParticipantsContent() {
  const { participants, rooms, updateParticipantStatus } = useData();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialQ = searchParams.get("q") || "";
  const [globalFilter, setGlobalFilter] = useState(initialQ);
  const [genderFilter, setGenderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([]);

  const getRoomLabel = (roomId?: string) => {
    if (!roomId) return "—";
    const room = rooms.find((r) => r.id === roomId);
    return room ? `Chambre ${room.number}` : "—";
  };

  const filteredData = useMemo(() => {
    return participants.filter((p) => {
      if (genderFilter !== "all" && p.gender !== genderFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (sourceFilter !== "all" && (p.source ?? "demo") !== sourceFilter) return false;
      return true;
    });
  }, [participants, genderFilter, statusFilter, sourceFilter]);

  const sourceLabel: Record<string, string> = {
    public: "Formulaire public",
    admin: "Admin",
    demo: "Démo",
  };

  // Actions de modération automatique
  const handleApprove = (participantId: string) => {
    // Retrouver les infos du participant actuel pour connaître son genre
    const currentParticipant = participants.find((p) => p.id === participantId);
    if (!currentParticipant) return;

    // 1. Calcul automatique du numéro de badge basé sur le nombre de personnes approuvées
    const approvedCount = participants.filter(
      (p) => p.status === "confirme" || p.status === "arrive" || p.status === "parti"
    ).length;
    
    const nextBadgeNumber = approvedCount + 1;
    const generatedBadgeString = String(nextBadgeNumber).padStart(3, "0");
    
    // 2. Recherche AUTOMATIQUE d'une chambre libre respectant le genre du participant
    let assignedRoomId: string | undefined = undefined;

    const availableRoom = rooms.find((room) => {
      // Vérifier si la chambre correspond au genre (homme ou femme)
      const matchesGender = room.gender === currentParticipant.gender || room.gender === "mixte";
      
      // Compter le nombre actuel d'occupants dans cette chambre
      const currentOccupantsCount = participants.filter((p) => p.roomId === room.id).length;
      
      // Il doit rester de la place disponible
      const hasSpace = currentOccupantsCount < room.capacity;

      return matchesGender && hasSpace;
    });

    if (availableRoom) {
      assignedRoomId = availableRoom.id;
    } else {
      // Optionnel: Si aucune chambre libre du bon genre n'a été trouvée, on prévient l'admin
      alert(`Attention : Aucune chambre libre disponible pour le profil (${currentParticipant.gender}). Le participant sera approuvé sans chambre.`);
    }

    // 3. Passe le statut à "confirme", injecte le badge et la chambre automatiquement
    if (updateParticipantStatus) {
      // @ts-ignore (Ajout du paramètre optionnel assignedRoomId à ta fonction globale de mise à jour)
      updateParticipantStatus(participantId, "confirme", generatedBadgeString, assignedRoomId);
    }

    // 4. Plus besoin de redirection forcée vers la page d'attribution ! On reste sur la liste propre rafraîchie.
    alert(`Participant approuvé avec succès !\nBadge : N° ${generatedBadgeString}\n${availableRoom ? 'Chambre assignée : Chambre ' + availableRoom.number : 'Chambre : Aucune place disponible'}`);
  };

  const handleReject = (participantId: string) => {
    if (confirm("Êtes-vous sûr de vouloir rejeter cette inscription ?")) {
      if (updateParticipantStatus) {
        updateParticipantStatus(participantId, "annule");
      }
    }
  };

  const columns: ColumnDef<Participant>[] = [
    {
      accessorKey: "fullName",
      header: "Nom complet",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
            {row.original.fullName.charAt(0)}
          </div>
          <span className="font-medium text-slate-900">{row.original.fullName}</span>
        </div>
      )
    },
    {
      id: "badgeNumber",
      header: "N° Badge",
      cell: ({ row }) => {
        const p = row.original;
        // @ts-ignore
        if (p.badge) return <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">{(p as any).badge}</span>;
        
        if (p.status === "confirme" || p.status === "arrive" || p.status === "parti") {
          const listApproved = participants.filter(item => item.status === "confirme" || item.status === "arrive" || item.status === "parti");
          const pos = listApproved.findIndex(item => item.id === p.id) + 1;
          const formatted = String(pos > 0 ? pos : row.index + 1).padStart(3, "0");
          return <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">{formatted}</span>;
        }
        return <span className="text-slate-400 text-xs">—</span>;
      }
    },
    { accessorKey: "phone", header: "Téléphone" },
    {
      accessorKey: "gender",
      header: "Sexe",
      cell: ({ getValue }) => (
        <span className="capitalize text-xs font-medium">{getValue() as string}</span>
      ),
    },
    { accessorKey: "church", header: "Église" },
    {
      accessorKey: "roomId",
      header: "Chambre",
      cell: ({ row }) => {
        const p = row.original;
        return <span className="text-xs font-semibold text-slate-700">{getRoomLabel(p.roomId)}</span>;
      },
    },
    {
      accessorKey: "source",
      header: "Origine",
      cell: ({ row }) => {
        const source = row.original.source ?? "demo";
        return (
          <Badge variant={source === "public" ? "success" : "secondary"} className="text-[10px]">
            {sourceLabel[source]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ getValue }) => (
        <Badge variant={statusVariant[getValue() as string]}>
          {STATUS_LABELS[getValue() as string]}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Modération & Actions",
      cell: ({ row }) => {
        const p = row.original;

        return (
          <div className="flex items-center gap-1.5">
            {p.status === "inscrit" ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 text-white"
                  onClick={() => handleApprove(p.id)}
                >
                  <Check className="h-3.5 w-3.5" /> Approuver
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleReject(p.id)}
                >
                  <X className="h-3.5 w-3.5" /> Rejeter
                </Button>
              </>
            ) : null}
            
            <Link href={`/participants/${p.id}`}>
              <Button variant="ghost" size="icon" className="h-7 w-7" title="Voir les détails">
                <Eye className="h-4 w-4 text-slate-500" />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  return (
    <div className="space-y-6">
      {/* SECTION EN-TÊTE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Participants</h1>
          <p className="text-slate-500 text-sm mt-1">{participants.length} participants enregistrés au total</p>
        </div>
        
        <Link href="/inscription">
          <Button className="flex items-center gap-2 shadow-md bg-primary text-white hover:bg-primary/95 text-sm font-semibold h-10 px-4">
            <Plus className="h-4 w-4 stroke-[3px]" /> Inscrire un participant
          </Button>
        </Link>
      </div>

      {/* BARRE DE FILTRES */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Rechercher par nom, email, téléphone..."
            className="pl-9"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        
        <select 
          value={genderFilter} 
          onChange={(e) => setGenderFilter(e.target.value)} 
          className="w-36 text-sm bg-white border border-slate-200 rounded-lg px-3 h-10 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">Tous sexes</option>
          <option value="homme">Hommes</option>
          <option value="femme">Femmes</option>
        </select>

        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)} 
          className="w-40 text-sm bg-white border border-slate-200 rounded-lg px-3 h-10 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">Tous statuts</option>
          {Object.entries(STATUS_LABELS).filter(([k]) => ["inscrit","confirme","arrive","parti","annule"].includes(k)).map(([k,v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <select 
          value={sourceFilter} 
          onChange={(e) => setSourceFilter(e.target.value)} 
          className="w-44 text-sm bg-white border border-slate-200 rounded-lg px-3 h-10 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">Toutes origines</option>
          <option value="public">Formulaire public</option>
          <option value="demo">Données démo</option>
        </select>
      </div>

      {/* COMPTEUR DE DEMANDES EN ATTENTE */}
      {participants.filter(p => p.status === "inscrit").length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-amber-800 text-sm">
          <div className="flex items-center gap-2">
            <Hotel className="h-4 w-4 text-amber-600" />
            <span>Vous avez <strong>{participants.filter(p => p.status === "inscrit").length} nouvelle(s) demande(s)</strong> en attente d'approbation et de chambre.</span>
          </div>
          <Button variant="outline" size="sm" className="border-amber-300 text-amber-900 bg-amber-100/50 hover:bg-amber-100" onClick={() => setStatusFilter("inscrit")}>
            Filtrer les attentes
          </Button>
        </div>
      )}

      {/* TABLEAU PRINCIPAL */}
      <Card>
        <CardHeader><CardTitle className="text-base">Liste des participants</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="border-b border-border bg-slate-50">
                    {hg.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3 text-left font-medium text-slate-500">
                        {header.isPlaceholder ? null : (
                          <button
                            className="flex items-center gap-1 hover:text-text"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === "asc" ? <ChevronUp className="h-3 w-3" /> :
                             header.column.getIsSorted() === "desc" ? <ChevronDown className="h-3 w-3" /> :
                             header.column.getCanSort() ? <ChevronsUpDown className="h-3 w-3 opacity-40" /> : null}
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400">Aucun participant trouvé</td></tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-slate-50/80 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-2.5 align-middle">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-slate-500">
              Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()} · {filteredData.length} résultats
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Précédent</Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Suivant</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}