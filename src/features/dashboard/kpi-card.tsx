"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
  loading?: boolean;
}

export function KpiCard({ title, value, icon, trend, color = "bg-primary/10 text-primary", loading }: KpiCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numValue = typeof value === "number" ? value : parseInt(String(value)) || 0;

  useEffect(() => {
    if (loading || typeof value !== "number") return;
    let start = 0;
    const step = Math.max(1, Math.ceil(numValue / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= numValue) {
        setDisplayValue(numValue);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [numValue, loading, value]);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", color)}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-20 animate-pulse rounded bg-slate-200" />
        ) : (
          <>
            <p className="text-3xl font-bold text-text">
              {typeof value === "number" ? displayValue || numValue : value}
            </p>
            {trend !== undefined && (
              <div className="mt-1 flex items-center gap-1 text-xs">
                {trend > 0 ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : trend < 0 ? (
                  <TrendingDown className="h-3 w-3 text-danger" />
                ) : (
                  <Minus className="h-3 w-3 text-slate-400" />
                )}
                <span className={trend > 0 ? "text-success" : trend < 0 ? "text-danger" : "text-slate-400"}>
                  {Math.abs(trend)}% vs mois dernier
                </span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
