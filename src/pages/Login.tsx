import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthSplitLayout from "../components/auth/AuthSplitLayout";
import { loginRequest } from "../services/authApi";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await loginRequest(email.trim(), password, keepSignedIn);
      toast.success("Signed in");
      const from = (location.state as { from?: { pathname?: string } } | null)
        ?.from?.pathname;
      navigate(
        from && from !== "/login" && from !== "/signup" ? from : "/",
        { replace: true },
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthSplitLayout
      title="Log in"
      subtitle="Enter your credentials to access your account"
    >
      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs font-medium uppercase tracking-wide text-gray-700"
          >
            Email Address
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="yourname@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-2">
            <label
              htmlFor="login-password"
              className="block text-xs font-medium uppercase tracking-wide text-gray-700"
            >
              Password
            </label>
            <a
              href="#forgot"
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              Forgot password?
            </a>
          </div>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
          <input
            type="checkbox"
            checked={keepSignedIn}
            onChange={(e) => setKeepSignedIn(e.target.checked)}
            className="h-4 w-4 rounded border-gray-400 text-gray-900 focus:ring-gray-900"
          />
          Keep me signed in
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-gray-900 py-3 text-sm font-medium lowercase tracking-wide text-white transition hover:bg-gray-800 disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "login"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        New here?{" "}
        <Link to="/signup" className="text-gray-800 underline-offset-2 hover:underline">
          Sign up
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
