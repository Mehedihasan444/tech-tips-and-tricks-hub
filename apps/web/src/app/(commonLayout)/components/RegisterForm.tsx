"use client";
import React, { useEffect, useState } from "react";
import GoogleLoginBtn from "./shared/GoogleLoginBtn";
import FormDivider from "./shared/FormDivider";
import SubmitBtn from "./SubmitBtn";
import { Input } from "@heroui/react";
import { EyeIcon, EyeOff } from "lucide-react";
import { useUserLogin, useUserRegistration } from "@/hooks/auth.hook";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { generateNickname } from "@/utils/generateNickname";
import { useUser } from "@/context/user.provider";

const profilePhoto =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const { setIsLoading: userLoading, user } = useUser();
  const {
    mutate: handleUserRegistration,
    isPending,
    isSuccess,
    isError,
    error,
  } = useUserRegistration();
  const {
    mutate: handleUserLogin,
    isPending: isloginPending,
    isSuccess: isloginSuccess,
    isError: isloginError,
    error: loginError,
  } = useUserLogin();
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);
  const busy = isPending || isloginPending;

  // 1) Registration effect
  useEffect(() => {
    if (isSuccess && !isPending) {
      const nickLogin = setTimeout(() => {
        handleUserLogin({ email, password });
      }, 0);

      return () => clearTimeout(nickLogin);
    }

    if (isError) {
      setErrors(error?.message || "Registration failed. Please try again.");
    }
  }, [isSuccess, isPending, isError, error, handleUserLogin, email, password]);

  // 2) Login effect after registration
  useEffect(() => {
    userLoading(isloginPending);
    if (isloginSuccess && !isloginPending) {
      if (redirect) {
        router.push(redirect);
      } else if (user) {
        router.push("/");
      } else {
        router.push("/login");
      }
    }

    if (isloginError) {
      setErrors(loginError?.message || "Login after registration failed.");
    }
  }, [
    isloginSuccess,
    isloginPending,
    isloginError,
    loginError,
    redirect,
    router,
    user,
    userLoading,
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setErrors("All fields are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrors("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrors("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrors("Passwords do not match.");
      return;
    }
    const nickName = generateNickname(name.trim());
    handleUserRegistration({
      name: name.trim(),
      email: email.trim(),
      password,
      profilePhoto,
      nickName,
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <form
        onSubmit={handleSubmit}
        className="w-full space-y-5 bg-content1 p-8 rounded-2xl shadow-lg border border-divider"
      >
        <h1 className="text-3xl font-semibold text-center">Register</h1>

        {/* Name input */}
        <Input
          label="Name"
          variant="bordered"
          isRequired
          size="lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          isDisabled={busy}
          classNames={{
            input: "text-base",
            inputWrapper: "border-default-200 data-[hover=true]:border-default-400",
          }}
        />

        {/* Email input */}
        <Input
          label="Email"
          variant="bordered"
          isRequired
          size="lg"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isDisabled={busy}
          classNames={{
            input: "text-base outline-none focus:outline-none",
            inputWrapper: "border-default-200 data-[hover=true]:border-default-400",
          }}
        />

        {/* Password input */}
        <Input
          label="Password"
          variant="bordered"
          isRequired
          size="lg"
          classNames={{
            input: "text-base outline-none focus:outline-none",
            inputWrapper: "border-default-200 data-[hover=true]:border-default-400",
          }}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={togglePasswordVisibility}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            >
              {isPasswordVisible ? (
                <EyeOff className="w-5 h-5 text-default-600 pointer-events-none" />
              ) : (
                <EyeIcon className="w-5 h-5 text-default-600 pointer-events-none" />
              )}
            </button>
          }
          type={isPasswordVisible ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isDisabled={busy}
          className="max-w-lg"
        />

        {/* Confirm Password input */}
        <Input
          label="Confirm Password"
          variant="bordered"
          isRequired
          size="lg"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleConfirmVisibility}
              aria-label={isConfirmVisible ? "Hide confirm password" : "Show confirm password"}
            >
              {isConfirmVisible ? (
                <EyeOff className="w-5 h-5 text-default-600 pointer-events-none" />
              ) : (
                <EyeIcon className="w-5 h-5 text-default-600 pointer-events-none" />
              )}
            </button>
          }
          type={isConfirmVisible ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          isDisabled={busy}
          classNames={{
            input: "text-base",
            inputWrapper: "border-default-200 data-[hover=true]:border-default-400",
          }}
        />

        {/* Error message */}
        {errors && (
          <p
            role="alert"
            className="bg-danger-50 dark:bg-danger-500/10 border border-danger-200 text-danger-700 dark:text-danger-300 px-4 py-3 rounded-lg text-center text-sm"
          >
            {errors}
          </p>
        )}

        {/* Submit button */}
        <SubmitBtn
          text="Create Account"
          loadingText="Creating account..."
          isLoading={isPending || isloginPending}
        />

        {/* Divider */}
        <FormDivider />

        {/* Google Login Button */}
        <GoogleLoginBtn />

        {/* Already registered */}
        <div className="text-center">
          <p className="text-sm text-default-600">
            Already registered?{" "}
            <Link
              href="/login"
              className="text-primary-fg hover:text-primary-600 font-semibold transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
