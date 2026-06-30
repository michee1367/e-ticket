"use client";

import { Bell, UserPlus, BedDouble, LogIn, AlertTriangle, LogOut, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/components/providers/data-provider";
import { formatDateTime } from "@/lib/utils";
import type { NotificationType } from "@/types";

const typeConfig: Record<NotificationType, { icon: React.ReactNode; color: string }> = {
  inscription: { icon: <UserPlus className="h-4 w-4" />, color: "bg-blue-100 text-blue-600" },
  chambre: { icon: <BedDouble className="h-4 w-4" />, color: "bg-purple-100 text-purple-600" },
  arrivee: { icon: <LogIn className="h-4 w-4" />, color: "bg-green-100 text-green-600" },
  chambre_complete: { icon: <AlertTriangle className="h-4 w-4" />, color: "bg-amber-100 text-amber-600" },
  depart: { icon: <LogOut className="h-4 w-4" />, color: "bg-slate-100 text-slate-600" },
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const unread = notifications.filter((n) => !n.read);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">{unread.length} non lue{unread.length > 1 ? "s" : ""}</p>
        </div>
        {/*unread.length > 0 && (
          <Button variant="outline" size="sm" onClick={markAllNotificationsRead}>
            <CheckCheck className="h-4 w-4" /> Tout marquer comme lu
          </Button>
        )*/}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" /> Centre de notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <p className="text-center text-slate-400 py-12">Aucune notification</p>
          ) : (
            <div className="divide-y divide-border">
              {/*notifications.map((notif) => {
                const config = typeConfig[notif.type];
                return (
                  <button
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`w-full flex items-start gap-4 p-4 text-left hover:bg-slate-50 transition-colors ${!notif.read ? "bg-primary/5" : ""}`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.color}`}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{notif.title}</p>
                        {!notif.read && <Badge className="h-2 w-2 p-0 rounded-full" />}
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{notif.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatDateTime(notif.createdAt)}</p>
                    </div>
                  </button>
                );
              })*/}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
