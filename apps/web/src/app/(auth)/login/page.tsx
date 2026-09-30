import React from "react";
import Image from "next/image";
import photo from "@/assets/authenticationIMG.svg";
import LoginForm from "@/app/(commonLayout)/components/LoginForm";


const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-default-100">
      <div className="h-screen flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left side - Image with gradient overlay */}
        <div className="w-full flex-1 h-full relative hidden lg:flex items-center justify-center">
          <div className="relative w-full h-3/4 max-w-2xl">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl opacity-20 blur-3xl"></div>
            
            {/* Image container */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image 
                src={photo} 
                alt="Login illustration" 
                width={600}
                height={600}
                priority 
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full h-full flex-1 flex justify-center items-center py-12">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;