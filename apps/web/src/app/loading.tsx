"use client";
import { Spinner } from "@heroui/react";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-200 dark:from-background dark:to-content1">
      <div className="flex flex-col items-center">
        {/* Loading Spinner */}
        <Spinner size="lg" label="Please wait..." color="primary" labelColor="foreground" />
      </div>
    </div>
  );
};

export default LoadingPage;
