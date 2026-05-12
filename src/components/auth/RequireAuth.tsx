import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { sessionRequest } from "../../services/authApi";

type Props = {
  children: React.ReactNode;
};

/**
 * Route guard: only renders children when the session is authenticated.
 */
export default function RequireAuth({ children }: Props) {
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void sessionRequest()
      .then((s) => {
        if (!cancelled) {
          setAuthenticated(s.authenticated);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAuthenticated(false);
          setReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="py-16 text-center text-sm text-gray-500">
        Checking your session…
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
