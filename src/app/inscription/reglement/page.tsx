"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, ScrollText, ArrowLeft, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ReglementPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10 px-3 sm:px-6 lg:px-8 text-slate-600">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Bouton Retour - Plus accessible sur Mobile */}
        <div>
          <Link href="/inscription">
            <Button variant="ghost" size="sm" className="gap-2 text-slate-600 hover:text-slate-900 px-2 sm:px-3 text-xs sm:text-sm">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>

        {/* En-tête principal - Aligné au centre sur Phone */}
        <div className="text-center md:text-left space-y-2 px-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Documents Officiels GRAI 2026
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Veuillez lire attentivement le règlement intérieur et les conditions logistiques de la retraite.
          </p>
        </div>

        {/* Système d'Onglets Fluide et Réactif */}
        <Tabs defaultValue="roi" className="w-full space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto md:mx-0 bg-slate-200/60 p-1 rounded-xl h-auto">
            
            <TabsTrigger value="roi">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-2 px-4 rounded-lg text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-xs sm:text-sm font-medium transition-all cursor-pointer w-full h-full">
                <Scale className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate">Règlement Intérieur</span>
              </div>
            </TabsTrigger>

            <TabsTrigger value="conditions">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-2 px-4 rounded-lg text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-xs sm:text-sm font-medium transition-all cursor-pointer w-full h-full">
                <ScrollText className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate">Conditions & Logistique</span>
              </div>
            </TabsTrigger>

          </TabsList>

          {/* Onglet 1 : Règlement d'Ordre Intérieur */}
          <TabsContent value="roi" className="outline-none">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-white p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-600 shrink-0" />
                  Règlement d'Ordre Intérieur (R.O.I)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 bg-white text-slate-600 space-y-5 sm:space-y-6 leading-relaxed">
                
                <section className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">I. DISPOSITIONS GÉNÉRALES</h3>
                  <p className="text-xs sm:text-sm"><strong>1. Objectif :</strong> La retraite est un temps mis à part pour la rencontre avec Dieu. Tout comportement doit favoriser la consécration, la communion fraternelle et la croissance spirituelle.</p>
                  <p className="text-xs sm:text-sm"><strong>2. Acceptation :</strong> L'inscription à la retraite vaut acceptation sans réserve du présent règlement.</p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">II. VIE SPIRITUELLE ET DISCIPLINE</h3>
                  <p className="text-xs sm:text-sm"><strong>3. Ponctualité :</strong> La présence à toutes les sessions (prières, enseignements, ateliers) est obligatoire. Le respect des horaires est une forme de respect envers le Saint-Esprit et la communauté.</p>
                  <p className="text-xs sm:text-sm"><strong>4. Attitude :</strong> Un comportement digne et respectueux est exigé envers les orateurs, les responsables et les autres retraitants.</p>
                  <p className="text-xs sm:text-sm"><strong>5. Silence :</strong> Les temps de silence (méditation ou repos) doivent être scrupuleusement respectés pour favoriser l'écoute intérieure et le développement de la sensibilité spirituelle.</p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">III. VIE EN COMMUNAUTÉ</h3>
                  <p className="text-xs sm:text-sm"><strong>6. Logement :</strong> La mixité dans les chambres ou dortoirs est strictement interdite. L'accès aux dortoirs du sexe opposé est formellement prohibé sous peine d'exclusion immédiate.</p>
                  <p className="text-xs sm:text-sm"><strong>7. Tenue Vestimentaire :</strong> Une tenue correcte, décente et modeste est requise en tout temps. Les tenues extravagantes ou provocatrices ne sont pas adaptées au cadre de la retraite.</p>
                  <p className="text-xs sm:text-sm"><strong>8. Langage :</strong> Les propos injurieux, vulgaires ou déplacés sont interdits. Priorité à l'édification mutuelle.</p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">IV. GESTION DES APPAREILS ÉLECTRONIQUES</h3>
                  <p className="text-xs sm:text-sm"><strong>9. Téléphones :</strong> L'usage du téléphone est limité qu'à l'équipe de la communication et aux responsables. Les téléphones doivent être en mode "Avion" ou "Silencieux" durant toutes les sessions. Des plages horaires spécifiques seront communiquées pour les urgences familiales et les externes.</p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">V. SÉCURITÉ ET HYGIÈNE</h3>
                  <p className="text-xs sm:text-sm"><strong>10. Sorties :</strong> Aucune sortie du site de la retraite n'est autorisée sans l'accord préalable du responsable de l'organisation (Coordons).</p>
                  <p className="text-xs sm:text-sm"><strong>11. Propreté :</strong> Chaque retraitant est responsable de la propreté de son espace de couchage et des lieux communs (sanitaires, salle de conférence).</p>
                  <p className="text-xs sm:text-sm"><strong>12. Substances interdites :</strong> La consommation des repas et boisson externes, d'alcool, de tabac ou de toute substance illicite est strictement interdite sur l'ensemble du site. Le retraitant est invité à signaler tout régime particulier.</p>
                  <p className="text-xs sm:text-sm"><strong>13. Objets interdits :</strong> Les objets tranchants, le miroir, une somme d'argent colossale, les bijoux de grande valeur ou tout autre objet similaires sont strictement interdits. Si besoin se présente, le retraitant peut faire consigner ses objets de valeur ou ses sommes auprès des responsables.</p>
                  <p className="text-[11px] sm:text-xs text-amber-600 italic bg-amber-50 p-3 rounded-lg border border-amber-200 mt-2">
                    En cas de non-respect de consignes, la coordination décline toute responsabilité en cas de perte ou de dégradation d'un objet de valeur ou d'une somme colossale quelconque.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">VI. CAS PARTICULIER DES MINEURS (15-17 ANS)</h3>
                  <p className="text-xs sm:text-sm"><strong>14. Autorisation :</strong> Les mineurs doivent impérativement fournir une autorisation parentale signée.</p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">VII. SANCTIONS</h3>
                  <div className="p-3 sm:p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 sm:gap-3">
                    <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-red-800">
                      <strong>15. Sanction :</strong> Tout manquement grave au présent règlement (vol, comportement immoral, insubordination répétée) entraînera une sanction pouvant aller du blâme à l'expulsion définitive de la retraite, sans remboursement, et avec information des parents ou des tuteurs.
                    </p>
                  </div>
                </section>

              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet 2 : Conditions de Participation */}
          <TabsContent value="conditions" className="outline-none">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-white p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                  <ScrollText className="h-5 w-5 text-pink-600 shrink-0" />
                  Conditions de Participation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 bg-white text-slate-600 space-y-6 leading-relaxed">
                
                {/* Contribution Financière - S'empile proprement sur Mobile */}
                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">1. Contribution financière</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Frais obligatoires de participation</p>
                  </div>
                  <span className="text-lg sm:text-xl font-black text-blue-600 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-blue-100 text-center sm:text-left">
                    30 USD <span className="text-xs font-normal text-slate-400 block sm:inline sm:ml-1">(Trente dollars américains)</span>
                  </span>
                </div>

                {/* Éléments à apporter obligatoirement */}
                <section className="space-y-3">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    2. À apporter obligatoirement :
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm pl-1">
                    <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">• Bible, bloc note et stylo ;</li>
                    <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">• Pièce d'identification <span className="text-[11px] text-slate-400 block sm:inline">(Badges remis après enregistrement)</span> ;</li>
                    <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">• Vêtements et sous-vêtements pour toute la durée ;</li>
                    <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">• Vêtements contre le froid (Pull-over ou autres) ;</li>
                    <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">• Babouches, sandales, baskets et/ou chaussures ;</li>
                    <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">• Brosse à dents, pâte dentifrice ;</li>
                    <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">• Serviette, savon, gants, lait de beauté, Seau de douche ;</li>
                    <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">• Draps, couverture, oreillers si nécessaire ;</li>
                    <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">• Mousse ou natte ne dépassant pas 5cm d'épaisseur ;</li>
                    <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">• Gobelet ou tasses ;</li>
                    <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">• Assiette, cuillère ;</li>
                    <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">• Médicaments personnels prescrits <span className="text-[11px] text-slate-400">(le cas échéant)</span>.</li>
                  </ul>
                </section>

                {/* Objets non admis */}
                <section className="space-y-3">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    3. Les objets non admis :
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm pl-1">
                    <li className="bg-amber-50/40 p-2.5 rounded-lg border border-amber-100 text-amber-900">• Nourriture et boisson extérieure ;</li>
                    <li className="bg-amber-50/40 p-2.5 rounded-lg border border-amber-100 text-amber-900">• Téléphone et tout autre appareil électronique ;</li>
                    <li className="bg-amber-50/40 p-2.5 rounded-lg border border-amber-100 text-amber-900">• Objets tranchants, dangerous et miroir ;</li>
                    <li className="bg-amber-50/40 p-2.5 rounded-lg border border-amber-100 text-amber-900">• Bijoux de valeur, importante somme d'argent ;</li>
                    <li className="bg-amber-50/40 p-2.5 rounded-lg border border-amber-100 text-amber-900">• Substances illicites ;</li>
                    <li className="bg-amber-50/40 p-2.5 rounded-lg border border-amber-100 text-amber-900">• Tout support contraire aux valeurs chrétiennes.</li>
                  </ul>
                </section>

                {/* Comportements non admis */}
                <section className="space-y-3">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                    4. Comportements non admis :
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm pl-5 list-disc text-slate-600">
                    <li>Retards répétés aux activités ;</li>
                    <li>Absences non justifiées aux enseignements et prières ;</li>
                    <li>Propos injurieux, agressifs ou discriminatoires ;</li>
                    <li>Bagarres ou violences sous toutes leurs formes ;</li>
                    <li>Création de clans ou de divisions ;</li>
                    <li>Non-respect des responsables, des serviteurs ou des participants.</li>
                  </ul>
                  
                  <div className="p-3.5 sm:p-4 rounded-lg bg-slate-900 text-white flex items-start gap-3 mt-4">
                    <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] sm:text-xs text-slate-300 leading-normal">
                      <strong>NB :</strong> Tout manquement grave à ces règles pourra entraîner des mesures disciplinaires pouvant aller jusqu'à l'exclusion de la retraite.
                    </p>
                  </div>
                </section>

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
      </div>
    </div>
  );
}