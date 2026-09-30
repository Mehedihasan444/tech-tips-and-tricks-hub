"use client";
import { useResetPassword } from "@/hooks/auth.hook";
import { Button, Input, Spinner } from "@nextui-org/react";
import { Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { FormEvent, useState } from "react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate, isPending } = useResetPassword();
  const params = useSearchParams();
  const token = params.get("token");
  const id = params.get("id");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (token && id) {
      mutate({ userId: id, newPassword: password, oldPassword, token });
    }

    setError("");
    setOldPassword("");
    setPassword("");
    setConfirmPassword("");
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-default-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            Reset your password
          </h2>
          <p className="text-default-500 text-sm">
            Please enter your new password below.
          </p>
        </div>

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
            placeholder="Enter your old password"
            variant="bordered"
            size="lg"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            isDisabled={isPending}
            startContent={<Lock className="w-5 h-5 text-default-400" />}
            endContent={
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="focus:outline-none"
              >
                {showOldPassword ? (
                  <EyeOff className="w-5 h-5 text-default-400" />
                ) : (
                  <Eye className="w-5 h-5 text-default-400" />
                )}
              </button>
            }
            classNames={{
              input: "text-base",
              inputWrapper: "border-default-200 data-[hover=true]:border-default-400"
            }}
          />

          {/* New Password */}
          <Input
            id="new-password"
            name="new-password"
            type={showNewPassword ? "text" : "password"}
            isRequired
            label="New Password"
            placeholder="Enter your new password"
            variant="bordered"
            size="lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isDisabled={isPending}
            startContent={<Lock className="w-5 h-5 text-default-400" />}
            endContent={
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="focus:outline-none"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5 text-default-400" />
                ) : (
                  <Eye className="w-5 h-5 text-default-400" />
                )}
              </button>
            }
            classNames={{
              input: "text-base",
              inputWrapper: "border-default-200 data-[hover=true]:border-default-400"
            }}
          />

          {/* Confirm Password */}
          <Input
            id="confirm-password"
            name="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            isRequired
            label="Confirm Password"
            placeholder="Confirm your new password"
            variant="bordered"
            size="lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            isDisabled={isPending}
            startContent={<Lock className="w-5 h-5 text-default-400" />}
            endContent={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-default-400" />
                ) : (
                  <Eye className="w-5 h-5 text-default-400" />
                )}
              </button>
            }
            classNames={{
              input: "text-base",
              inputWrapper: "border-default-200 data-[hover=true]:border-default-400"
            }}
          />

          {/* Error Message */}
          {error && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-full font-semibold"
            isDisabled={isPending}
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
      </div>
    </div>
  );
};

export default ResetPassword;
