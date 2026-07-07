import type { Metadata } from "next";
import { ErrorLayout } from "@/layouts/ErrorLayout";
import { PermissionDenied } from "@/components/feedback/PermissionDenied";

export const metadata: Metadata = { title: "Access denied" };

export default function ForbiddenPage() {
  return (
    <ErrorLayout>
      <PermissionDenied />
    </ErrorLayout>
  );
}
