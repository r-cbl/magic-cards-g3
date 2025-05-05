// components/RequireAuth.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: Props) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('tokens');
    if (!token) {
      router.push('/login');
    }
  }, []);

  return <>{children}</>;
};

export default RequireAuth;
