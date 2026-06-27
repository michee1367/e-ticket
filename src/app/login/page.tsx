"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(4, "Minimum 4 caractères"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    // Mise à jour de l'identifiant par défaut avec le compte d'Abraham Oweteshe
    defaultValues: { email: "abrahamoweteshe@gmail.com", password: "admin123" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    // 1. Définition du compte administrateur unique par défaut
    const ADMIN_EMAIL = "abrahamoweteshe@gmail.com";
    const ADMIN_PASSWORD = "admin123";

    let isAuthorized = false;

    // 2. Vérification s'il s'agit du compte par défaut d'Abraham
    if (data.email.toLowerCase() === ADMIN_EMAIL && data.password === ADMIN_PASSWORD) {
      isAuthorized = true;
    } else {
      // 3. Sinon, on cherche dans le localStorage si un compte local correspond
      const localUsersJson = localStorage.getItem("local_users");
      if (localUsersJson) {
        const localUsers = JSON.parse(localUsersJson);
        // On cherche un utilisateur avec cet email et ce mot de passe
        const foundUser = localUsers.find(
          (u: any) => u.email.toLowerCase() === data.email.toLowerCase() && u.password === data.password
        );
        if (foundUser) {
          isAuthorized = true;
        }
      }
    }

    // 4. Gestion de la connexion ou du rejet
    if (isAuthorized) {
      // On appelle la fonction de ton provider pour simuler l'état connecté globale au niveau de ton app
      await login(data.email, data.password);
      setLoading(false);
      toast.success("Connexion réussie !");
      router.push("/dashboard");
    } else {
      setLoading(false);
      toast.error("Identifiants incorrects ou compte inexistant");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          {/* Conteneur arrondi en bleu royal avec le logo blanc au centre */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 p-2.5 mb-4 shadow-lg">
            <img 
              src="/logo-jeunesse.png" 
              alt="Logo Jeunesse" 
              className="h-full w-full object-contain" 
            />
          </div>
          <h1 className="text-2xl font-bold text-text">Jeunesse CEPD</h1>
          <p className="text-slate-500 text-sm mt-1">Gestion des retraites d&apos;église</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>Accédez à votre espace de gestion</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
              </div>

              <div className="text-right">
                <Link href="#" className="text-sm text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Se connecter
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Pas encore de compte ?{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Créer un compte
              </Link>
            </p>

            <div className="mt-4 pt-4 border-t border-border text-center">
              <Link href="/inscription" className="text-sm text-slate-500 hover:text-primary transition-colors">
                Vous souhaitez vous inscrire à une retraite ? <span className="font-medium text-primary">Réserver ma place →</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}