'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LandingHub from '@/components/LandingHub';
import EnterTransition from '@/components/EnterTransition';

export default function Home() {
  const router = useRouter();
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    router.prefetch('/room'); // warm the 3D route so entering is snappy
  }, [router]);

  return (
    <>
      <LandingHub onEnter={() => setEntering(true)} />
      <EnterTransition active={entering} onComplete={() => router.push('/room')} />
    </>
  );
}
