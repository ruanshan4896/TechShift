'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminRoot() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirecting to dashboard...</p>
    </div>
  );
}
