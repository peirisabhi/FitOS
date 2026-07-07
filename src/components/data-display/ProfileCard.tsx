import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/types/role.types";
import type { AuthUser } from "@/types/user.types";

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ProfileCard({ user }: { user: AuthUser }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-4">
      <Avatar className="h-11 w-11">
        <AvatarImage src={user.avatarUrl} alt={user.name} />
        <AvatarFallback>{initials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        <div className="flex flex-wrap gap-1 pt-0.5">
          {user.roles.map((role) => (
            <Badge key={role} variant="secondary">
              {ROLE_LABELS[role]}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
