import type { Metadata } from "next";
import { TrainersTable } from "@/features/trainers";

export const metadata: Metadata = { title: "Trainers" };

export default function TrainersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Trainers</h1>
        <p className="text-sm text-muted-foreground">Manage trainer profiles, specialties, and assignments.</p>
      </div>
      <TrainersTable />
    </div>
  );
}
