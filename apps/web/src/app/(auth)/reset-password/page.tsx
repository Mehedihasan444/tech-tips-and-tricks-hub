"use client";
import { useResetPassword } from "@/hooks/auth.hook";
import { Button, Input, Spinner } from "@heroui/react";
import { Lock, Eye, EyeOff, KeyRound, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { FormEvent, Suspense, useState } from "react";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [succeeded, setSucceeded] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate, isPending } = useResetPassword();
  const params = useSearchParams();
  const token = params.get("token");
  const id = params.get("id");
  const hasResetLink = Boolean(token && id);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!hasResetLink) {
      setError("This reset link is incomplete. Please request a new one.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    mutate(
      { userId: id, newPassword: password, oldPassword, token },
      {
        onSuccess: () => {
          setSucceeded(true);
          setOldPassword("");
          setPassword("");
          setConfirmPassword("");
        },
        // On failure the typed values are kept so nothing is lost.
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-default-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-primary-fg" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Reset your password</h2>
          <p className="text-default-500 text-sm">Please enter your new password below.</p>
        </div>

        {/* Incomplete-link warning */}
        {!hasResetLink && !succeeded && (
          <div
            role="alert"
            className="flex items-start gap-2 bg-warning-50 dark:bg-warning-500/10 border border-warning-200 text-warning-700 dark:text-warning-300 px-4 py-3 rounded-lg text-sm"
          >
            <TriangleAlert className="w-5 h-5 shrink-0" />
            <span>
              This page was opened without a reset link. Please request a new reset link from{" "}
              <Link href="/forget-password" className="font-semibold underline">
                Forgot password
              </Link>
              .
            </span>
          </div>
        )}

        {/* Success panel */}
        {succeeded ? (
          <div className="mt-8 space-y-5 bg-content1 p-8 rounded-2xl shadow-lg border border-divider text-center">
            <div role="status" className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Password reset complete</h2>
              <p className="text-default-500 text-sm">
                You can now sign in with your new password.
              </p>
            </div>
            <Button
              as={Link}
              href="/login"
              color="primary"
              size="lg"
              className="w-full font-semibold"
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <form
            className="mt-8 space-y-5 bg-content1 p-8 rounded-2xl shadow-lg border border-divider"
            onSubmit={handleSubmit}
          >
            {/* Old Password */}
            <Input
              id="old-password"
              name="old-password"
              type={showOldPassword ? "text" : "password"}
              isRequired
              label="Old Password"
              variant="bordered"
              size="lg"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              isDisabled={isPending}
              classNames={{
                input: "text-base",
                inputWrapper: "border-default-200 data-[hover=true]:border-default-400",
              }}
              startContent={<Lock className="w-5 h-5 text-default-500" />}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowOldPassword((v) => !v)}
                  aria-label={showOldPassword ? "Hide old password" : "Show old password"}
                  aria-pressed={showOldPassword}
                  className="rounded-md p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {showOldPassword ? (
                    <EyeOff className="w-5 h-5 text-default-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-default-500" />
                  )}
                </button>
              }
            />

            {/* New Password */}
            <Input
              id="new-password"
              name="new-password"
              type={showNewPassword ? "text" : "password"}
              isRequired
              label="New Password"
              variant="bordered"
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isDisabled={isPending}
              classNames={{
                input: "text-base",
                inputWrapper: "border-default-200 data-[hover=true]:border-default-400",
              }}
              startContent={<Lock className="w-5 h-5 text-default-500" />}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                  aria-pressed={showNewPassword}
                  className="rounded-md p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5 text-default-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-default-500" />
                  )}
                </button>
              }
            />

            {/* Confirm Password */}
            <Input
              id="confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              isRequired
              label="Confirm Password"
              variant="bordered"
              size="lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isDisabled={isPending}
              classNames={{
                input: "text-base",
                inputWrapper: "border-default-200 data-[hover=true]:border-default-400",
              }}
              startContent={<Lock className="w-5 h-5 text-default-500" />}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={
                    showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                  }
                  aria-pressed={showConfirmPassword}
                  className="rounded-md p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-default-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-default-500" />
                  )}
                </button>
              }
            />

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="bg-danger-50 dark:bg-danger-500/10 border border-danger-200 text-danger-700 dark:text-danger-300 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              color="primary"
              size="lg"
              className="w-full font-semibold"
              isDisabled={isPending || !hasResetLink}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" color="current" />
                  <span>Resetting...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5" />
                  <span>Reset Password</span>
                </div>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default function ResetPassword() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
