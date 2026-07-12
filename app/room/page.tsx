'use client';
import MainScene from "@/components/MainScene";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import InfoButton from "@/components/InfoButton";
import { useState, useEffect } from "react";

export default function Room() {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // Show the how-to-explore overlay the first time someone enters the room
    const hasVisited = localStorage.getItem('hasVisitedRoom');
    if (!hasVisited) {
      setShowOverlay(true);
      localStorage.setItem('hasVisitedRoom', 'true');
    }
  }, []);

  const handleCloseOverlay = () => setShowOverlay(false);
  const handleShowInfo = () => setShowOverlay(true);

  return (
    <main className="w-full h-screen relative">
      <MainScene />
      <InfoButton onClick={handleShowInfo} />
      <WelcomeOverlay isVisible={showOverlay} onClose={handleCloseOverlay} />
    </main>
  );
}
