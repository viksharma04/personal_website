'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LandingHub from '@/components/LandingHub';
import EnterTransition from '@/components/EnterTransition';

type Pending = { href: string; variant: 'crt' | 'fade' };

export default function Home() {
  const router = useRouter();
  const [pending, setPending] = useState<Pending | null>(null);

  useEffect(() => {
    // Warm both destinations so the transition hands off to an already-loading route.
    router.prefetch('/room');
    router.prefetch('/terminal');
  }, [router]);

  return (
    <>
      <LandingHub
        onEnterRoom={() => setPending({ href: '/room', variant: 'fade' })}
        onEnterTerminal={() => setPending({ href: '/terminal', variant: 'crt' })}
      />
      <EnterTransition
        active={pending !== null}
        variant={pending?.variant ?? 'crt'}
        onComplete={() => {
          if (pending) router.push(pending.href);
        }}
      />
    </>
  );
}
