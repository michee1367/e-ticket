"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Calendar, MapPin, Users, Loader2, CheckCircle2,
  ArrowLeft, User, Phone, Heart, ClipboardList, Church, Briefcase, Printer
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/components/providers/data-provider";
import { getRetreatSpotsRemaining } from "@/mock-data";
import { formatDate } from "@/lib/utils";
import type { Participant, Retreat } from "@/types";
import Image from 'next/image';

// Types
interface PublicRegistrationFormProps {
  retreat: Retreat;
}

// Schéma de validation Zod
const schema = z.object({
  // I. Informations Personnelles
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  postName: z.string().optional(),
  gender: z.enum(["M", "F"], { message: "Veuillez sélectionner votre sexe" }),
  civilStatus: z.enum(["Célibataire", "Marié(e)", "Veuf(ve)", "Divorcé(e)"], {
    message: "Veuillez sélectionner votre état civil",
  }),
  address: z.string().min(5, "L'adresse physique est requise"),
  phone: z.string().min(10, "Numéro de téléphone invalide (min 10 chiffres)"),
  ageGroup: z.enum(["15-19", "20-24", "25-29", "30-34", "35-39", "40 et plus"], {
    message: "Veuillez sélectionner votre tranche d'âge",
  }),
  profession: z.string().min(2, "La profession est requise"),

  // II. Informations Complémentaires
  churchName: z.string().min(2, "L'église d'attache est requise"),
  churchFunction: z.string().min(2, "La fonction dans l'église est requise"),
  hasAllergies: z.enum(["Oui", "Non"], { message: "Veuillez cocher Oui ou Non" }),
  allergiesDetails: z.string().optional(),
  hasMedicalTreatment: z.enum(["Oui", "Non"], { message: "Veuillez cocher Oui ou Non" }),
  medicalTreatmentDetails: z.string().optional(),

  // III. Tuteur / Contact d'urgence
  emergencyFirstName: z.string().min(2, "Le prénom du tuteur est requis"),
  emergencyLastName: z.string().min(2, "Le nom du tuteur est requis"),
  emergencyPhone: z.string().min(10, "Le téléphone du tuteur est requis"),
  emergencyRelationship: z.string().min(2, "Le lien de parenté est requis"),

  // Engagement
  acceptTerms: z.boolean().refine((v) => v === true, {
    message: "Vous devez vous engager à respecter les règles de la retraite",
  }),
});

type FormData = z.infer<typeof schema>;

export function PublicRegistrationForm({ retreat }: PublicRegistrationFormProps) {
  const { participants, registerPublicParticipant } = useData();
  const router = useRouter();
  const [confirmed, setConfirmed] = useState<Participant | null>(null);

  const spotsLeft = getRetreatSpotsRemaining(retreat, participants);
  const isFull = spotsLeft <= 0;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { 
      acceptTerms: false,
      hasAllergies: "Non",
      hasMedicalTreatment: "Non"
    },
  });

  // Surveillance des états pour affichage dynamique
  const watchAllergies = watch("hasAllergies");
  const watchTreatment = watch("hasMedicalTreatment");

  const onSubmit = async (data: FormData) => {
    if (isFull) {
      toast.error("Désolé, cette retraite est complète.");
      return;
    }

    // On attend la fin du petit délai de chargement visuel
    await new Promise((r) => setTimeout(r, 1250));

    const fullNameParts = [data.firstName, data.lastName, data.postName].filter(Boolean);
    const fullName = fullNameParts.join(' ');

    // 1. Enregistrement direct dans le context global (Page participants)
    const newParticipant = await registerPublicParticipant({
      retreatId: retreat.id,
      fullName,
      phone: data.phone,
      gender: data.gender === "M" ? "homme" : "femme",
      emergencyContact: {
        name: `${data.emergencyFirstName} ${data.emergencyLastName}`,
        phone: data.emergencyPhone,
        relationship: data.emergencyRelationship,
      },
      notes: `État civil: ${data.civilStatus} | Âge: ${data.ageGroup} | Profession: ${data.profession} | Église: ${data.churchName} (${data.churchFunction}) | Allergies: ${data.hasAllergies} ${data.allergiesDetails ? `(${data.allergiesDetails})` : "(Aucune)"} | Traitement: ${data.hasMedicalTreatment} ${data.medicalTreatmentDetails ? `(${data.medicalTreatmentDetails})` : "(Aucun)"}`,
    });

    // 2. Assignation locale pour afficher l'écran de succès
    setConfirmed(newParticipant);
    toast.success("Réservation confirmée !");
  };

  // ÉCRAN DE SUCCÈS (Après validation)
  if (confirmed) {
    return (
      <div className="min-h-screen bg-slate-50 py-3 sm:py-5 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-emerald-500/30 shadow-xl overflow-hidden bg-white">
            <div className="h-2 bg-emerald-500" />
            <CardHeader className="text-center p-6">
              <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-black text-emerald-600">
                Inscription confirmée !
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Merci de vous être enregistré pour votre participation à la retraite, vous recevrez votre badje d’accès lors de votre confirmation ( paiement) à la table de littérature De L’Église la présence de Dieu m’accompagne
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3 print:bg-white print:border-none">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base border-b border-slate-200/60 pb-1.5">
                  Récapitulatif du ticket :
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-800">Participant :</span> {confirmed.fullName}</p>
                  <p><span className="font-semibold text-slate-800">Téléphone :</span> {confirmed.phone}</p>
                  <p className="sm:col-span-2"><span className="font-semibold text-slate-800">Retraite :</span> {retreat.name}</p>
                  <p className="sm:col-span-2"><span className="font-semibold text-slate-800">Dates :</span> 02 août au 08 août</p>
                  <p className="sm:col-span-2"><span className="font-semibold text-slate-800">Lieu :</span> {retreat.location}</p>
                </div>
              </div>
              {confirmed?.qrCode && (
                <div className="flex flex-col items-center p-4">
                  <div className="relative border p-2 bg-white rounded-lg">
                    <Image
                      src={confirmed.qrCode}
                      alt="QR Code d'inscription"
                      width={256}
                      height={256}
                      priority
                      unoptimized
                    />
                  </div>

                  <p>{confirmed.registrationNumber}</p>
                  
                  {/* Optionnel : Le bouton de téléchargement dont on a parlé juste en dessous 
                  <a 
                    href={confirmed.qrCode} 
                    download={`qrcode-${confirmed.registrationNumber || 'inscription'}.png`}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
                  >
                    Télécharger mon QR Code
                  </a>*/}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2 print:hidden">
                {/* Le bouton "Voir d'autres retraites" a été supprimé ici */}
                <Button 
                  variant="default" 
                  className="w-full font-bold h-12 gap-2 text-base"
                  onClick={() => window.print()}
                >
                  <Printer className="h-5 w-5" />
                  Imprimer le ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // FORMULAIRE D'INSCRIPTION PRINCIPAL
  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Barre de navigation */}
      

      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        {/* En-tête descriptif */}
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="h-1.5 bg-slate-900" />
          <CardHeader className="text-center p-4 sm:p-6">
            <Badge variant="secondary" className="w-fit mx-auto mb-2 bg-slate-100 text-slate-800 font-bold border border-slate-200 text-[10px] sm:text-xs uppercase tracking-wider">
              Fiche d'enregistrement
            </Badge>
            <CardTitle className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
              La Grande Retraite Annuelle et Internationale (GRAI)
            </CardTitle>
            <CardDescription className="font-bold text-slate-600 text-xs sm:text-sm mt-1">
              {retreat.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-slate-50/60 border-t border-slate-100 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                02 août 2026 - 08 août 2026
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                {retreat.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-slate-400 shrink-0" />
                {isFull ? (
                  <span className="text-red-600 font-bold">Complet</span>
                ) : (
                  <span><strong>{spotsLeft}</strong> places restantes</span>
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        {!isFull ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* SECTION I : INFORMATIONS PERSONNELLES */}
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
                <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-slate-900">
                  <User className="h-4 w-4 text-slate-500" /> I. INFORMATIONS PERSONNELLES
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-xs font-semibold text-slate-700">Prénom *</Label>
                    <Input id="firstName" {...register("firstName")} className="h-10 text-sm" />
                    {errors.firstName && (
                      <p className="text-[11px] font-medium text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-xs font-semibold text-slate-700">Nom *</Label>
                    <Input id="lastName" {...register("lastName")} className="h-10 text-sm" />
                    {errors.lastName && (
                      <p className="text-[11px] font-medium text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="postName" className="text-xs font-semibold text-slate-700">Post-nom</Label>
                    <Input id="postName" {...register("postName")} className="h-10 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="gender" className="text-xs font-semibold text-slate-700">Sexe *</Label>
                    <select
                      id="gender"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer"
                      {...register("gender")}
                      defaultValue=""
                    >
                      <option value="" disabled>Sélectionner votre sexe</option>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                    {errors.gender && (
                      <p className="text-[11px] font-medium text-red-600">{errors.gender.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="civilStatus" className="text-xs font-semibold text-slate-700">État Civil *</Label>
                    <select
                      id="civilStatus"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer"
                      {...register("civilStatus")}
                      defaultValue=""
                    >
                      <option value="" disabled>Sélectionner votre état civil</option>
                      <option value="Célibataire">Célibataire</option>
                      <option value="Marié(e)">Marié(e)</option>
                      <option value="Veuf(ve)">Veuf(ve)</option>
                      <option value="Divorcé(e)">Divorcé(e)</option>
                    </select>
                    {errors.civilStatus && (
                      <p className="text-[11px] font-medium text-red-600">{errors.civilStatus.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs font-semibold text-slate-700">Adresse physique *</Label>
                  <Input 
                    id="address" 
                    placeholder="N°, Avenue, Quartier, Commune / Ville" 
                    {...register("address")} 
                    className="h-10 text-sm"
                  />
                  {errors.address && (
                    <p className="text-[11px] font-medium text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">N° Téléphone *</Label>
                    <Input id="phone" placeholder="Ex: 0812345678" {...register("phone")} className="h-10 text-sm" />
                    {errors.phone && (
                      <p className="text-[11px] font-medium text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="ageGroup" className="text-xs font-semibold text-slate-700">Tranche d'âge *</Label>
                    <select
                      id="ageGroup"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer"
                      {...register("ageGroup")}
                      defaultValue=""
                    >
                      <option value="" disabled>Sélectionner votre âge</option>
                      <option value="15-19">13-14 ans</option>
                      <option value="15-19">15-19 ans</option>
                      <option value="20-24">20-24 ans</option>
                      <option value="25-29">25-29 ans</option>
                      <option value="30-34">30-34 ans</option>
                      <option value="35-39">35-39 ans</option>
                      <option value="40 et plus">40 ans et plus</option>
                    </select>
                    {errors.ageGroup && (
                      <p className="text-[11px] font-medium text-red-600">{errors.ageGroup.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profession" className="text-xs font-semibold text-slate-700">Profession *</Label>
                  <Input id="profession" placeholder="Ex: Étudiant, Comptable, Entrepreneur..." {...register("profession")} className="h-10 text-sm" />
                  {errors.profession && (
                    <p className="text-[11px] font-medium text-red-600">{errors.profession.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* SECTION II : INFORMATIONS COMPLÉMENTAIRES */}
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
                <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-slate-900">
                  <ClipboardList className="h-4 w-4 text-slate-500" /> II. INFORMATIONS COMPLÉMENTAIRES
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="churchName" className="text-xs font-semibold text-slate-700">Église d'attache *</Label>
                    <div className="relative">
                      <Church className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input id="churchName" className="pl-9 h-10 text-sm" placeholder="Nom de votre communauté" {...register("churchName")} />
                    </div>
                    {errors.churchName && (
                      <p className="text-[11px] font-medium text-red-600">{errors.churchName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="churchFunction" className="text-xs font-semibold text-slate-700">Fonction dans l'église *</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input id="churchFunction" className="pl-9 h-10 text-sm" placeholder="Ex: Membre, Protocole, Choriste..." {...register("churchFunction")} />
                    </div>
                    {errors.churchFunction && (
                      <p className="text-[11px] font-medium text-red-600">{errors.churchFunction.message}</p>
                    )}
                  </div>
                </div>

                {/* Bloc Allergies */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <Label className="text-xs font-semibold text-slate-700 block">Avez-vous des allergies ? *</Label>
                  <div className="flex gap-6 items-center mt-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer select-none">
                      <input 
                        type="radio" 
                        value="Oui" 
                        {...register("hasAllergies")} 
                        className="h-4 w-4 border-slate-300 text-slate-900 focus:ring-slate-900" 
                      /> 
                      Oui
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer select-none">
                      <input 
                        type="radio" 
                        value="Non" 
                        {...register("hasAllergies")} 
                        className="h-4 w-4 border-slate-300 text-slate-900 focus:ring-slate-900" 
                      /> 
                      Non
                    </label>
                  </div>
                  {errors.hasAllergies && (
                    <p className="text-[11px] font-medium text-red-600">{errors.hasAllergies.message}</p>
                  )}
                  
                  {watchAllergies === "Oui" && (
                    <div className="space-y-1.5 pt-1.5 animate-in slide-in-from-top-1 duration-200">
                      <Label htmlFor="allergiesDetails" className="text-xs font-medium text-slate-600">Si oui, veuillez préciser :</Label>
                      <Input 
                        id="allergiesDetails" 
                        placeholder="Médicaments, aliments, poussière..." 
                        {...register("allergiesDetails")} 
                        className="h-10 text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Bloc Traitement Médical */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <Label className="text-xs font-semibold text-slate-700 block">Prenez-vous un traitement médical régulier ? *</Label>
                  <div className="flex gap-6 items-center mt-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer select-none">
                      <input 
                        type="radio" 
                        value="Oui" 
                        {...register("hasMedicalTreatment")} 
                        className="h-4 w-4 border-slate-300 text-slate-900 focus:ring-slate-900" 
                      /> 
                      Oui
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer select-none">
                      <input 
                        type="radio" 
                        value="Non" 
                        {...register("hasMedicalTreatment")} 
                        className="h-4 w-4 border-slate-300 text-slate-900 focus:ring-slate-900" 
                      /> 
                      Non
                    </label>
                  </div>
                  {errors.hasMedicalTreatment && (
                    <p className="text-[11px] font-medium text-red-600">{errors.hasMedicalTreatment.message}</p>
                  )}
                  
                  {watchTreatment === "Oui" && (
                    <div className="space-y-1.5 pt-1.5 animate-in slide-in-from-top-1 duration-200">
                      <Label htmlFor="medicalTreatmentDetails" className="text-xs font-medium text-slate-600">Si oui, précisez les détails :</Label>
                      <Input 
                        id="medicalTreatmentDetails" 
                        placeholder="Nom des médicaments, fréquence..." 
                        {...register("medicalTreatmentDetails")} 
                        className="h-10 text-sm"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* SECTION III : TUTEUR OU CONTACT D'URGENCE */}
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
                <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-slate-900">
                  <Heart className="h-4 w-4 text-slate-500" /> III. CONTACT D'URGENCE / TUTEUR
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="emergencyFirstName" className="text-xs font-semibold text-slate-700">Prénom du tuteur *</Label>
                    <Input id="emergencyFirstName" {...register("emergencyFirstName")} className="h-10 text-sm" />
                    {errors.emergencyFirstName && (
                      <p className="text-[11px] font-medium text-red-600">{errors.emergencyFirstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="emergencyLastName" className="text-xs font-semibold text-slate-700">Nom du tuteur *</Label>
                    <Input id="emergencyLastName" {...register("emergencyLastName")} className="h-10 text-sm" />
                    {errors.emergencyLastName && (
                      <p className="text-[11px] font-medium text-red-600">{errors.emergencyLastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="emergencyPhone" className="text-xs font-semibold text-slate-700">N° Téléphone du tuteur *</Label>
                    <Input id="emergencyPhone" placeholder="Ex: 0899999999" {...register("emergencyPhone")} className="h-10 text-sm" />
                    {errors.emergencyPhone && (
                      <p className="text-[11px] font-medium text-red-600">{errors.emergencyPhone.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="emergencyRelationship" className="text-xs font-semibold text-slate-700">Lien de parenté *</Label>
                    <Input 
                      id="emergencyRelationship" 
                      placeholder="Ex: Père, Mère, Oncle, Époux..." 
                      {...register("emergencyRelationship")} 
                      className="h-10 text-sm"
                    />
                    {errors.emergencyRelationship && (
                      <p className="text-[11px] font-medium text-red-600">{errors.emergencyRelationship.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ENGAGEMENT LEGAL */}
            <Card className="border-slate-300 bg-slate-100/80 shadow-sm">
              <CardContent className="p-4 sm:p-5">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 transition-all" 
                    {...register("acceptTerms")} 
                  />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    Je m'engage solennellement à respecter les règles de la retraite, la ponctualité aux horaires, 
                    les consignes de la coordination ainsi que l'esprit de communion fraternelle durant toute la période. *
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="text-xs font-bold text-red-600 mt-2 pl-7">{errors.acceptTerms.message}</p>
                )}
              </CardContent>
            </Card>

            {/* BOUTONS DE SOUMISSION */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                size="lg" 
                className="flex-1 font-semibold h-12" 
                onClick={() => router.push("/inscription")}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                size="lg" 
                className="flex-1 font-bold h-12" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Enregistrement en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Valider mon inscription
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          /* CAS OÙ LA RETRAITE EST COMPLÈTE */
          <Card className="bg-amber-50 border-amber-200 shadow-sm">
            <CardContent className="p-6 text-center space-y-4">
              <p className="text-amber-800 font-bold text-sm sm:text-base">
                Désolé, les inscriptions pour cette retraite sont malheureusement closes (Complet).
              </p>
              <Button 
                variant="outline" 
                className="border-amber-200 hover:bg-amber-100 text-amber-950 font-semibold"
                onClick={() => router.push("/inscription")}
              >
                Découvrir les autres sessions
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}