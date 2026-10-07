import React, { Suspense } from "react";
import Image from "next/image";
import photo from "@/assets/authenticationIMG.svg";
import RegisterForm from "@/app/(commonLayout)/components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-default-100">
      <div className="min-h-screen flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        {/* Left side - Image with gradient overlay */}
        <div className="w-full flex-1 h-full relative hidden lg:flex items-center justify-center">
          <div className="relative w-full h-3/4 max-w-2xl">
            {/* Decorative background glow: small offset brand blobs clipped to the
                panel. A full-bleed pastel wash reads as a dirty grey spotlight
                on dark surfaces, so the color stays in the brand mid-tones at
                low opacity instead of near-white tints. */}
            <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl dark:bg-primary-500/15" />
              <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-secondary-500/15 blur-3xl dark:bg-secondary-500/10" />
            </div>

            {/* Image container */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={photo}
                alt="Registration illustration"
                width={600}
                height={600}
                priority
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Right side - Register form */}
        <div className="w-full h-full flex-1 flex justify-center items-center py-12">
          {/* useSearchParams() inside RegisterForm requires a Suspense boundary for prerender */}
          <Suspense>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
