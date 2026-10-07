"use client";
import { useState, useEffect } from "react";
import { Input } from "@heroui/react";
import { EyeIcon, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserLogin } from "@/hooks/auth.hook";
import { useUser } from "@/context/user.provider";
import SubmitBtn from "./SubmitBtn";
import GoogleLoginBtn from "./shared/GoogleLoginBtn";
import FormDivider from "./shared/FormDivider";
import DemoLoginPanel from "./shared/DemoLoginPanel";
import { isDemoLoginEnabled, type TDemoAccount } from "@/contants/demoUsers";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const toggleVisibility = () => setIsVisible((v) => !v);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { setIsLoading: userLoading } = useUser();
  const { mutate: handleUserLogin, isPending, isSuccess, isError, error } = useUserLogin();

  useEffect(() => {
    userLoading(isPending);
    if (!isPending && isSuccess) {
      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/");
      }
    } else if (isError) {
      setErrors(error?.message || "Login failed. Please try again.");
    }
  }, [isPending, isSuccess, isError, error, redirect, router, userLoading]);

  const login = (nextEmail: string, nextPassword: string) => {
    setErrors(null);
    handleUserLogin({ email: nextEmail, password: nextPassword });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);

    if (!email || !password) {
      setErrors("Both email and password are required.");
      return;
    }
    login(email, password);
  };

  // One-click role login: fill the fields visibly (so it is obvious what was
  // submitted) and sign in immediately.
  const handleDemoSelect = (account: TDemoAccount) => {
    if (isPending) return;
    setEmail(account.email);
    setPassword(account.password);
    setIsVisible(false);
    login(account.email, account.password);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome Back</h1>
        <p className="text-default-500 text-sm">Sign in to your account to continue</p>
      </div>

      {/* Main Form Card */}
      <form
        className="w-full space-y-5 bg-content1 p-8 rounded-2xl shadow-lg border border-divider"
        onSubmit={handleSubmit}
      >
        {/* Email Input */}
        <Input
          id="email"
          name="email"
          label="Email Address"
          variant="bordered"
          isRequired
          size="lg"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isDisabled={isPending}
          aria-describedby={errors ? "login-error" : undefined}
          classNames={{
            input: "text-base",
            inputWrapper: "border-default-200 data-[hover=true]:border-default-400",
          }}
        />

        {/* Password Input */}
        <Input
          id="password"
          name="password"
          label="Password"
          variant="bordered"
          isRequired
          size="lg"
          autoComplete="current-password"
          endContent={
            <button
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
              aria-pressed={isVisible}
              className="rounded-md p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {isVisible ? (
                <EyeOff className="w-5 h-5 text-default-500 pointer-events-none" />
              ) : (
                <EyeIcon className="w-5 h-5 text-default-500 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isDisabled={isPending}
          aria-describedby={errors ? "login-error" : undefined}
          classNames={{
            input: "text-base",
            inputWrapper: "border-default-200 data-[hover=true]:border-default-400",
          }}
        />

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            href="/forget-password"
            className="text-sm text-primary-fg hover:text-primary-600 transition-colors font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Error Message */}
        {errors && (
          <div
            id="login-error"
            role="alert"
            className="bg-danger-50 dark:bg-danger-500/10 border border-danger-200 text-danger-700 dark:text-danger-300 px-4 py-3 rounded-lg text-sm"
          >
            {errors}
          </div>
        )}

        {/* Submit Button */}
        <SubmitBtn text="Sign In" loadingText="Signing in..." isLoading={isPending} />

        {/* Divider */}
        <FormDivider />

        {/* Google Login */}
        <GoogleLoginBtn />
      </form>

      {isDemoLoginEnabled && (
        <DemoLoginPanel
          onSelect={handleDemoSelect}
          pendingEmail={isPending ? email || null : null}
        />
      )}

      {/* Register Link */}
      <div className="text-center">
        <p className="text-sm text-default-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary-fg hover:text-primary-600 font-semibold transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
