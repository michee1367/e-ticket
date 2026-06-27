import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ParticipantsPage from "./participants-content";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-96 w-full" />
      </div>
    }>
      <ParticipantsPage />
    </Suspense>
  );
}
