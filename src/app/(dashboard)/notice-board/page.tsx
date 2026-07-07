import type { Metadata } from "next";
import { Megaphone } from "lucide-react";
import { PlaceholderPage } from "@/shared/components";

export const metadata: Metadata = { title: "Notice Board" };

export default function NoticeBoardPage() {
  return (
    <PlaceholderPage
      title="Notice Board"
      description="Post announcements visible to staff and members."
      milestone="Milestone 4"
      icon={Megaphone}
    />
  );
}
