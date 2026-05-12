import React, { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { isAdminRole, sessionRequest } from "../../services/authApi";

type Props = {
  children: React.ReactNode;
};

type GateState = "loading" | "guest" | "forbidden" | "ok";

/**
 * Route guard: authenticated users with role admin only.
 */
export default function RequireAdmin({ children }: Props) {
  const location = useLocation();
  const [state, setState] = useState<GateState>("loading");
  const warnedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    void sessionRequest()
      .then((s) => {
        if (cancelled) return;
        if (!s.authenticated) {
          setState("guest");
          return;
        }
        if (!isAdminRole(s.user)) {
          if (!warnedRef.current) {
            warnedRef.current = true;
            toast.error("Administrator access is required for this area.");
          }
          setState("forbidden");
          return;
        }
        setState("ok");
      })
      .catch(() => {
        if (!cancelled) setState("guest");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="py-16 text-center text-sm text-gray-500">
        Checking your session…
      </div>
    );
  }

  if (state === "guest") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (state === "forbidden") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
