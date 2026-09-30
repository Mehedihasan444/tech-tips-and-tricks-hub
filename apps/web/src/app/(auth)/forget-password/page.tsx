"use client";
import { useForgetPassword } from "@/hooks/auth.hook";
import { Button, Input, Spinner } from "@nextui-org/react";
import { Mail, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { mutate, isPending } = useForgetPassword();
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate({ email });
    setMessage(
      "If this email exists, you will receive a password reset link shortly."
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-default-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            Forgot your password?
          </h2>
          <p className="text-default-500 text-sm">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form 
          className="mt-8 space-y-6 bg-content1 p-8 rounded-2xl shadow-lg border border-divider" 
          onSubmit={handleSubmit}
        >
          <Input
            id="email-address"
            name="email"
            type="email"
            isRequired
            label="Email Address"
            placeholder="you@example.com"
            variant="bordered"
            size="lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            startContent={<Mail className="w-5 h-5 text-default-400" />}
            isDisabled={isPending}
            classNames={{
              input: "text-base",
              inputWrapper: "border-default-200 data-[hover=true]:border-default-400"
            }}
          />

          {/* Success Message */}
          {message && (
            <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg text-sm">
              {message}
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
                <span>Sending...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                <span>Send Reset Link</span>
              </div>
            )}
          </Button>
        </form>

        {/* Back to Login Link */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
