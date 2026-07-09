import { useState } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";
import type { AxiosError } from "axios";

import type { Role, User } from "../../types";
import { updateUserRoleRequest } from "../../api/user.api";
import { Button } from "../ui/Button";

interface RoleActionProps {
  user: User;
  isSelf: boolean;
  onChanged: (updated: User) => void;
}

interface ApiError {
  message: string;
}

export const RoleAction = ({
  user,
  isSelf,
  onChanged,
}: RoleActionProps) => {
  const [isBusy, setIsBusy] = useState(false);
  const [, setError] = useState<string | null>(null);

  if (isSelf) {
    return <span className="text-xs text-ink-soft">You</span>;
  }

  const nextRole: Role =
    user.role === "MANAGER" ? "TEAM_MEMBER" : "MANAGER";

  const isPromotion = nextRole === "MANAGER";

  const handleClick = async () => {
    const message = isPromotion
      ? `Make ${user.name} a manager? They'll get access to the team dashboard and project management.`
      : `Remove ${user.name}'s manager access? They'll only be able to manage their own reports.`;

    if (!window.confirm(message)) return;

    setError(null);
    setIsBusy(true);

    try {
      const response = await updateUserRoleRequest(user.id, nextRole);

      onChanged(response.data.data);
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      setError(
        error.response?.data?.message ??
          "Could not update the user's role."
      );
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={handleClick}
      isLoading={isBusy}
      disabled={isBusy}
    >
      {isPromotion ? (
        <>
          <ShieldCheck className="h-3.5 w-3.5" />
          Make manager
        </>
      ) : (
        <>
          <ShieldOff className="h-3.5 w-3.5" />
          Remove manager
        </>
      )}
    </Button>
  );
};