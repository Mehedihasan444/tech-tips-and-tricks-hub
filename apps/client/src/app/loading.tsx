
import { Spinner } from "@nextui-org/react";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-200">
      <div className="flex flex-col items-center">
        {/* Loading Spinner */}
        <Spinner size="lg" label="please wait..."  color="primary" labelColor="foreground"/>
      </div>
    </div>
  );
};

export default LoadingPage;

  