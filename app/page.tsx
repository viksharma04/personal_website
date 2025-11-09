'use client';
import MainScene from "@/components/MainScene";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import InfoButton from "@/components/InfoButton";
import QuotesButton from "@/components/QuotesButton";
import { useState, useEffect } from "react";

export default function Home() {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // Show overlay on first visit
    const hasVisited = localStorage.getItem('hasVisitedWebsite');
    if (!hasVisited) {
      setShowOverlay(true);
      localStorage.setItem('hasVisitedWebsite', 'true');
    }
  }, []);

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const handleShowInfo = () => {
    setShowOverlay(true);
  };

  return (
    <main className="w-full h-screen relative">
      <MainScene />
      <QuotesButton />
      <InfoButton onClick={handleShowInfo} />
      <WelcomeOverlay isVisible={showOverlay} onClose={handleCloseOverlay} />
    </main>
  );
}
