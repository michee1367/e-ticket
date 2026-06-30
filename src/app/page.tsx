"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Calendar, MapPin, ArrowRight, Sparkles, 
  ShieldCheck, Heart, Music, Coffee, Camera, Gift, FileText,
  Users, Clock, Star, BookOpen, Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/components/providers/data-provider";
import { isRetreatOpenForRegistration } from "@/mock-data";
import { formatDate } from "@/lib/utils";

export default function InscriptionPage() {
  const router = useRouter();
  const { retreats, church } = useData();
  const [mounted, setMounted] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | null>(null);

  const openRetreats = retreats.filter(isRetreatOpenForRegistration).slice(0, 1);
  const activeRetreat = openRetreats[0];

  const facts = [
    "✨ 94% des participants reviennent l'année suivante",
    "🔥 Une ambiance fraternelle et chaleureuse",
    "🙏 Des enseignements inspirants vous attendent",
    "💫 Des moments de partage inoubliables",
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % facts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSecretClick = () => {
    if (activeTimer) {
      clearTimeout(activeTimer);
    }

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount === 5) {
      setClickCount(0);
      
      const CODE_SECRET_ATTENDU = "2026"; 
      const codeSaisi = prompt("🔐 Entrez le code d'accès administrateur (4 chiffres) :");

      if (codeSaisi === CODE_SECRET_ATTENDU) {
        router.push("/login"); 
      } else if (codeSaisi !== null) {
        alert("❌ Code incorrect. Accès refusé.");
      }
      return;
    }

    const newTimer = setTimeout(() => {
      setClickCount(0);
    }, 3000);
    
    setActiveTimer(newTimer);
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* ========== NAVIGATION ========== */}
      <header className="sticky top-0 z-40 bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          <div 
            onClick={handleSecretClick}
            className="flex items-center gap-3 cursor-pointer select-none active:scale-95 transition-transform"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg overflow-hidden shrink-0 p-1.5 bg-blue-500/20">
              <img 
                src="/logo_CEPD.png" 
                alt="Logo Jeunesse" 
                className="h-full w-full object-contain brightness-0 invert" 
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Jeunesse CEPD</p>
              <p className="text-[10px] text-slate-400 truncate max-w-[180px] sm:max-w-none">{church?.name || "Communauté Évangélique"}</p>
            </div>
          </div>
          {/* Bouton Connexion (Droite) 
          <div className="flex items-center">
            <Link href="/login">
              <Button 
                variant="ghost" 
                className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-full px-4 py-2 transition-all"
              >
                Connexion
              </Button>
            </Link>
          </div>*/}

        </div>
      </header>

      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Fond de la retraite"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/80" />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16 md:pt-20 pb-8 sm:pb-12 md:pb-16 text-center relative z-10">
          <Badge className="mb-4 sm:mb-6 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-0 px-4 py-1.5">
            ✨ Édition Spéciale 2026
          </Badge>
          
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-white max-w-3xl mx-auto leading-tight mb-4 sm:mb-5">
            Grande retraite Annuelle et Internationale 
            <span className="font-semibold text-blue-400 block mt-1 sm:mt-2 text-2xl sm:text-5xl md:text-6xl">
              {church?.name || "Communauté Évangélique"}
            </span>
          </h1>
          
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
            6 jours de ressourcement, de partage et de communion fraternelle.
            Rejoignez notre communauté pour un moment unique.
          </p>

          <div className="flex justify-center px-2 sm:px-0">
            <Link href="/inscription/reglement" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 py-5 sm:py-2.5 text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all">
                <FileText className="h-4 w-4 shrink-0" />
                <span>Règlement & Conditions de participation</span>
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-8">
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">500+ participants</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">6 jours d'immersion</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Star className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">Note 4.9/5</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ACTIVITIES SECTION ========== */}
      <section id="activities" className="relative py-12 sm:py-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/activities-bg.jpg"
            alt="Fond des activités"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/80" />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <Badge className="mb-3 bg-blue-500/20 text-blue-300 border-0">
              🌟 Immersion totale
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Au cœur du <span className="text-blue-400">programme</span>
            </h2>
            <p className="text-slate-400 mt-1 sm:mt-2 text-xs sm:text-sm">
              Des moments forts pour votre édification spirituelle
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: Heart,
                title: "Prière & Recueillement",
                desc: "Moments sacrés de méditation et d'intercession profonde.",
              },
              {
                icon: Music,
                title: "Louange Vibrante",
                desc: "Atmosphère d'adoration menée par nos chorales inspirées.",
              },
              {
                icon: BookOpen,
                title: "Parole & Enseignement",
                desc: "Études bibliques profondes et enseignements inspirants.",
              },
              {
                icon: Brain,
                title: "Méditation Guidée",
                desc: "Sessions de méditation pour une connexion spirituelle intense.",
              },
              {
                icon: Coffee,
                title: "Partage Fraternel",
                desc: "Échanges authentiques et ateliers thématiques conviviaux.",
              },
              {
                icon: Camera,
                title: "Souvenirs Éternels",
                desc: "Photos, surprises et éternisation des liens créés.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 sm:p-8 text-center shadow-lg hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors duration-300">
                  <item.icon className="h-6 w-6 text-blue-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-white text-base group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {mounted && (
            <div className="mt-8 sm:mt-12 text-center px-4">
              <div className="inline-flex items-center gap-2 bg-slate-800/40 backdrop-blur-sm rounded-full px-4 sm:px-5 py-2 shadow-lg max-w-full">
                <Sparkles className="h-3 w-3 text-blue-400 shrink-0 animate-pulse" />
                <p className="text-[11px] sm:text-xs text-slate-300 font-medium truncate">
                  {facts[factIndex]}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========== RETREAT CARD SECTION ========== */}
      <section id="retreat-card" className="relative py-12 sm:py-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/retreat-bg.jpg"
            alt="Fond de l'inscription"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/80" />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          {!activeRetreat ? (
            <Card className="max-w-md mx-auto bg-slate-800/40 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="py-12 sm:py-16 text-center">
                <div className="text-4xl mb-3">⏳</div>
                <p className="text-white font-medium mb-1">Aucune session disponible</p>
                <p className="text-sm text-slate-400">Les inscriptions ouvriront bientôt</p>
              </CardContent>
            </Card>
          ) : (
            <div className="max-w-xl mx-auto">
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-3 sm:mb-4">
                  <Sparkles className="h-3 w-3 text-blue-400 animate-pulse" />
                  <span className="text-xs font-medium text-blue-300">🔥 Inscriptions ouvertes</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white px-2">
                  {activeRetreat.name}
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 px-4">
                  {activeRetreat.description || "Un rendez-vous spirituel incontournable"}
                </p>
              </div>

              <Card className="bg-slate-800/40 backdrop-blur-sm border-0 shadow-xl mx-1 sm:mx-0 hover:shadow-2xl transition-shadow">
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-1 sm:gap-0 pb-2 sm:pb-0">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-400 shrink-0" />
                      <span className="text-slate-400">📅 Dates</span>
                    </div>
                    <span className="font-medium text-white sm:text-right">
                      02 août 2026 - 08 août 2026
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-1 sm:gap-0">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
                      <span className="text-slate-400">📍 Lieu</span>
                    </div>
                    <span className="font-medium text-white sm:text-right">{activeRetreat.location}</span>
                  </div>

                  <div className="pt-4">
                    <Link href={"/inscription/" + activeRetreat.id}> 
                      <Button className="w-full h-11 text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all group">
                        🎯 Je m'inscris maintenant
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <ShieldCheck className="h-3 w-3 text-blue-400" />
                      <p className="text-center text-[11px] sm:text-xs text-slate-400">
                        Ouverte à tous — Lisez les conditions avant de valider
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-slate-900/60 backdrop-blur-sm py-6 sm:py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-3">
            <p className="text-[11px] sm:text-xs text-slate-400">
              ©️ 2026 {church?.name || "Communauté Évangélique"} — RetraiteSpirit
            </p>
            <span className="hidden sm:inline text-slate-700">|</span>
            <Link href="/inscription/reglement" className="text-[11px] sm:text-xs text-blue-400 hover:text-blue-300 transition-colors hover:underline">
              📋 Règlement Intérieur & Conditions
            </Link>
          </div>
          <div className="flex gap-4 sm:gap-5">
            <p className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5 hover:text-slate-300 transition-colors">
              <ShieldCheck className="h-3 w-3 text-blue-400" /> Inscription sécurisée
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5 hover:text-slate-300 transition-colors">
              <Gift className="h-3 w-3 text-blue-400" /> Édition Spéciale
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}