'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LandingHub from '@/components/LandingHub';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/room'); // warm the 3D route so entering is snappy
  }, [router]);

  return <LandingHub onEnter={() => router.push('/room')} />;
}
