"use client";
import { useState, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import { EyeIcon, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserLogin } from "@/hooks/auth.hook";
import { useUser } from "@/context/user.provider";
import SubmitBtn from "./SubmitBtn";
import GoogleLoginBtn from "./shared/GoogleLoginBtn";
import FormDivider from "./shared/FormDivider";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { setIsLoading: userLoading } = useUser();
  const {
    mutate: handleUserLogin,
    isPending,
    isSuccess,
    isError,
    error,
  } = useUserLogin();

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);

    if (!email || !password) {
      setErrors("Both email and password are required.");
      return;
    }
    handleUserLogin({ email, password });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="text-default-500 text-sm">
          Sign in to your account to continue
        </p>
      </div>

      {/* Demo Credentials - More subtle */}
      <div className="flex gap-2 justify-center">
        <Button
          size="sm"
          variant="flat"
          color="default"
          className="text-xs"
          onClick={() => {
            setEmail("admin@gmail.com");
            setPassword("admin@gmail.com");
          }}
        >
          Try Admin
        </Button>
        <Button
          size="sm"
          variant="flat"
          color="default"
          className="text-xs"
          onClick={() => {
            setEmail("user@gmail.com");
            setPassword("user@gmail.com");
          }}
        >
          Try User
        </Button>
      </div>

      {/* Main Form Card */}
      <form
        className="w-full space-y-5 bg-content1 p-8 rounded-2xl shadow-lg border border-divider"
        onSubmit={handleSubmit}
      >
        {/* Email Input */}
        <Input
          label="Email Address"
          variant="bordered"
          isRequired
          size="lg"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          classNames={{
            input: "text-base",
            inputWrapper: "border-default-200 data-[hover=true]:border-default-400"
          }}
        />

        {/* Password Input */}
        <Input
          label="Password"
          variant="bordered"
          isRequired
          size="lg"
          placeholder="Enter your password"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <EyeOff className="w-5 h-5 text-default-400 pointer-events-none" />
              ) : (
                <EyeIcon className="w-5 h-5 text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          classNames={{
            input: "text-base",
            inputWrapper: "border-default-200 data-[hover=true]:border-default-400"
          }}
        />

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            href="/forget-password"
            className="text-sm text-primary hover:text-primary-600 transition-colors font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Error Message */}
        {errors && (
          <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
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

      {/* Register Link */}
      <div className="text-center">
        <p className="text-sm text-default-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-primary-600 font-semibold transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;