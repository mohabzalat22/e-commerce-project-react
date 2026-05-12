import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AuthUser } from "../services/authApi";
import { logoutRequest, sessionRequest } from "../services/authApi";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  const loadSession = useCallback(async () => {
    setLoading(true);
    try {
      const s = await sessionRequest();
      if (s.authenticated) {
        setUser(s.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  async function handleSignOut() {
    try {
      await logoutRequest();
      setUser(null);
      toast.success("Signed out");
      navigate("/");
    } catch {
      toast.error("Could not sign out");
    }
  }

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-gray-500">
        Loading your profile…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12">
        <h1 className="text-2xl font-semibold text-gray-900">Your profile</h1>
        <p className="mt-4 max-w-md text-sm text-gray-600">
          Sign in to view your account details and manage your session.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/login"
            className="inline-flex rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="inline-flex rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <h1 className="text-2xl font-semibold text-gray-900">Your profile</h1>
      <p className="mt-1 text-sm text-gray-500">
        Account information from your current session.
      </p>

      <dl className="mt-10 max-w-md space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Name
          </dt>
          <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Email
          </dt>
          <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Account ID
          </dt>
          <dd className="mt-1 font-mono text-sm text-gray-700">{user.id}</dd>
        </div>
      </dl>

      <div className="mt-10">
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
