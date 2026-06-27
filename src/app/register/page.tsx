"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

// Schéma avec les contraintes existantes (min 8 caractères, etc.)
const schema = z.object({
  fullName: z.string().min(3, "Nom complet requis (min. 3 caractères)"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Minimum 8 caractères"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

function PasswordRule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-xs", ok ? "text-success" : "text-slate-400")}>
      {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {label}
    </div>
  );
}

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password", "");

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    // Simulation d'un léger délai de traitement réseau
    setTimeout(async () => {
      const targetEmail = data.email.toLowerCase();

      // 1. Sécurité : Empêcher d'écraser le compte principal par défaut d'Abraham
      if (targetEmail === "abrahamoweteshe@gmail.com") {
        setLoading(false);
        toast.error("Cet email est réservé au compte administrateur principal.");
        return;
      }

      // 2. Récupération des comptes créés localement
      const existingUsersJson = localStorage.getItem("local_users");
      const users = existingUsersJson ? JSON.parse(existingUsersJson) : [];

      // 3. Vérification si l'email existe déjà dans la liste locale
      if (users.some((u: any) => u.email.toLowerCase() === targetEmail)) {
        setLoading(false);
        toast.error("Cet email est déjà utilisé.");
        return;
      }

      // 4. Sauvegarde du nouveau compte simulé
      users.push({
        name: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone
      });
      localStorage.setItem("local_users", JSON.stringify(users));

      // Appel de la méthode globale de ton provider si nécessaire pour le cycle de vie de l'app
      await registerUser({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        password: data.password,
      });

      setLoading(false);
      toast.success("Compte créé avec succès !");
      router.push("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          {/* Remplacement par le conteneur et logo officiel Jeunesse CEPD */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 p-2.5 mb-4 shadow-lg">
            <img 
              src="/logo-jeunesse.png" 
              alt="Logo Jeunesse" 
              className="h-full w-full object-contain" 
            />
          </div>
          <h1 className="text-2xl font-bold text-text">Jeunesse CEPD</h1>
          <p className="text-slate-500 text-sm mt-1">Créer votre compte administrateur</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Création de compte</CardTitle>
            <CardDescription>Remplissez le formulaire pour vous inscrire</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input id="fullName" placeholder="Pasteur Jean Mukendi" {...register("fullName")} />
                {errors.fullName && <p className="text-xs text-danger">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" placeholder="+243 81 000 0000" {...register("phone")} />
                {errors.phone && <p className="text-xs text-danger">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="votre@email.com" {...register("email")} />
                {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="space-y-1 mt-2">
                  <PasswordRule ok={password.length >= 8} label="Au moins 8 caractères" />
                  <PasswordRule ok={/[A-Z]/.test(password)} label="Une majuscule" />
                  <PasswordRule ok={/[0-9]/.test(password)} label="Un chiffre" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="text-xs text-danger">{errors.confirmPassword.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Créer mon compte
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}