import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthSplitLayout from "../components/auth/AuthSplitLayout";
import { signupRequest } from "../services/authApi";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSubmitting(true);
    try {
      await signupRequest(name.trim(), email.trim(), password, keepSignedIn);
      toast.success("Account created");
      navigate("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not sign up");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthSplitLayout
      title="Create account"
      subtitle="Join MIS EAGLES to shop and track your orders"
    >
      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div>
          <label
            htmlFor="signup-name"
            className="block text-xs font-medium uppercase tracking-wide text-gray-700"
          >
            Full name
          </label>
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Alex Carter"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="block text-xs font-medium uppercase tracking-wide text-gray-700"
          >
            Email Address
          </label>
          <input
            id="signup-email"
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
          <label
            htmlFor="signup-password"
            className="block text-xs font-medium uppercase tracking-wide text-gray-700"
          >
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="signup-confirm"
            className="block text-xs font-medium uppercase tracking-wide text-gray-700"
          >
            Confirm password
          </label>
          <input
            id="signup-confirm"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Repeat password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
          {submitting ? "Creating account…" : "create account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="text-gray-800 underline-offset-2 hover:underline">
          Log in
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
