"use client";
import Link from "next/link";
import { Button } from "@heroui/react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 text-center">
      <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
      <h2 className="text-2xl text-default-600 mb-8">Page Not Found</h2>
      <p className="text-lg text-default-500 mb-6 max-w-md">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <Button color="primary" className="px-6 py-3 rounded-md shadow">
          Back to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
