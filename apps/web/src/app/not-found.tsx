import Link from 'next/link';
import { Button } from '@nextui-org/react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-default-800 mb-4">404</h1>
      <h2 className="text-2xl text-default-600 mb-8">Page Not Found</h2>
      <p className="text-lg text-default-500 mb-6">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" passHref>
        <Button  className="bg-teal-500 text-default-50 px-6 py-3 rounded-md shadow hover:bg-teal-600">
          Back to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
