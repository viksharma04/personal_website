'use client';

import { useEffect } from 'react';

export default function HomeKeyRedirect() {
  useEffect(() => {
    window.location.href = 'https://santo-nonloving-chandler.ngrok-free.dev/';
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'monospace'
    }}>
      Redirecting...
    </div>
  );
}