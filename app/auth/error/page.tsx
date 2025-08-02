'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '../../../components/ui/button';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Invalid email or password.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to access this resource.';
      default:
        return 'An authentication error occurred.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {getErrorMessage(error)}
          </p>
        </div>
        <div className="flex justify-center">
          <Button asChild>
            <a href="/auth/signin">Back to Sign In</a>
          </Button>
        </div>
      </div>
    </div>
  );
} 