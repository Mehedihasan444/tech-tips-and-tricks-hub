"use client";
import React, { useEffect, useState } from "react";
import GoogleLoginBtn from "./shared/GoogleLoginBtn";
import FormDivider from "./shared/FormDivider";
import SubmitBtn from "./SubmitBtn";
import { Input } from "@nextui-org/react";
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
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const { setIsLoading: userLoading,user } = useUser();
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
  const toggleVisibility = () => setIsVisible(!isVisible);

  // 1) Registration effect
  useEffect(() => {
    if (isSuccess && !isPending) {
      const nickLogin = setTimeout(() => {
        handleUserLogin({ email, password });
      }, 0)
      
      return () => clearTimeout(nickLogin)
    }
 
    if (isError) {
      setErrors(error?.message || "Registration failed. Please try again.");
    }
  }, [isSuccess, isPending, isError, error, handleUserLogin, email, password]);


  // 2) Login effect after registration
  useEffect(() => {
       userLoading(isloginPending)
    if (isloginSuccess && !isloginPending) {
      if (redirect) {
        router.push(redirect);
      } else if(user) {
        router.push("/");
      }else{
        router.push("/login");
      }
    }

    if (isloginError) {
      setErrors(loginError?.message || "Login after registration failed.");
    }
  }, [isloginSuccess, isloginPending, isloginError, loginError, redirect, router,user,userLoading]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);

    if (!name || !email || !password || !confirmPassword) {
      setErrors("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrors("Passwords do not match.");
      return;
    }
    const nickName = generateNickname(name)
    handleUserRegistration({ name, email, password, profilePhoto, nickName });

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
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          classNames={{
            input: "text-base",
            inputWrapper: "border-default-200 data-[hover=true]:border-default-400"
          }}
        />

        {/* Email input */}
        <Input
          label="Email"
          variant="bordered"
          isRequired
          size="lg"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          classNames={{
            input: "text-base",
            inputWrapper: "border-default-200 data-[hover=true]:border-default-400"
          }}
        />

        {/* Password input */}
        <Input
          label="Password"
          variant="bordered"
          isRequired
          size="lg"
          placeholder="Enter your password"
          classNames={{
            input: "text-base",
            inputWrapper: "border-default-200 data-[hover=true]:border-default-400"
          }}
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
          className="max-w-lg"
        />

        {/* Confirm Password input */}
        <Input
          label="Confirm Password"
          variant="bordered"
          isRequired
          size="lg"
          placeholder="Confirm your password"
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
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          classNames={{
            input: "text-base",
            inputWrapper: "border-default-200 data-[hover=true]:border-default-400"
          }}
        />

        {/* Error message */}
        {errors && <p className="text-red-500 text-center text-sm">{errors}</p>}

        {/* Submit button */}
        <SubmitBtn text="Create Account" loadingText="Creating account..." isLoading={isPending || isloginPending} />

        {/* Divider */}
        <FormDivider />

        {/* Google Login Button */}
        <GoogleLoginBtn />

        {/* Already registered */}
        <div className="text-center">
          <p className="text-sm text-default-600">
            Already registered?{" "}
            <Link href="/login" className="text-primary hover:text-primary-600 font-semibold transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
