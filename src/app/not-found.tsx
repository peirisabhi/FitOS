import { ErrorLayout } from "@/layouts/ErrorLayout";
import { NotFound } from "@/components/feedback/NotFound";

export default function NotFoundPage() {
  return (
    <ErrorLayout>
      <NotFound />
    </ErrorLayout>
  );
}
