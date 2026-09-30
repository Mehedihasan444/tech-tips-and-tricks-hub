"use client";
import { Button } from "@nextui-org/react";
import React from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const GoogleLoginBtn = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  return (
    <>
      <Button
        onClick={() => {
          signIn("google", { callbackUrl: redirect ? redirect : "/" });
        }}
        size="lg"
        type="button"
        className="w-full flex items-center justify-center px-4 py-3 border border-default-300 rounded-md shadow-sm text-lg font-medium  bg-default-50 hover:bg-default-100"
      >
        <svg
          className="w-7 h-7 mr-2"
          aria-hidden="true"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.25 0 5.8 1.2 7.3 2.2l5.25-5.25C33.9 3.25 29.45 1.5 24 1.5 14.45 1.5 6.75 7.85 4.5 16.5l6.25 4.85C12.45 15.85 17.7 9.5 24 9.5z"
          />
          <path
            fill="#34A853"
            d="M46.5 24.5c0-1.25-.1-2.5-.35-3.75H24v7.5h12.5c-.5 2.55-2.1 4.55-4.55 6.25l6.9 5.45c4.05-3.75 6.55-9.35 6.55-15.45z"
          />
          <path
            fill="#4A90E2"
            d="M10.75 28.2c-1.05-1.35-1.7-2.95-1.7-4.7s.65-3.35 1.7-4.7l-6.25-4.85C3.35 17.95 2.5 21.15 2.5 24.5s.85 6.55 2.5 9.85l6.25-4.85z"
          />
          <path
            fill="#FBBC05"
            d="M24 47.5c5.45 0 10-1.8 13.35-4.9l-6.9-5.45c-1.85 1.25-4.2 2.05-6.45 2.05-6.3 0-11.55-5.35-12.25-12.2L4.5 33.85C6.75 42.5 14.45 47.5 24 47.5z"
          />
        </svg>
        Continue with Google
      </Button>
    </>
  );
};

export default GoogleLoginBtn;
