import type { Metadata } from "next";
import { NoticeBoardList } from "@/features/notice-board";

export const metadata: Metadata = { title: "Notice Board" };

export default function NoticeBoardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notice Board</h1>
        <p className="text-sm text-muted-foreground">Post announcements visible to staff and members.</p>
      </div>
      <NoticeBoardList />
    </div>
  );
}
