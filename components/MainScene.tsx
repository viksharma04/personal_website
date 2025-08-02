'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import ComputerScreen from './3d_models/ComputerScreen';
import ComputerDesk from './3d_models/ComputerDesk';
import BasicKeyboard from './3d_models/BasicKeyboard';
import Lamp from './3d_models/Lamp';
import { LampProvider, useLamp } from './LampContext';

// LampGlow component: a glowing sphere to simulate the lamp bulb
const LampGlow = () => {
    const { isLampOn } = useLamp();
    
    return (
        <mesh position={[0.4, 0.32, 0.15]}>
            <sphereGeometry args={[0.035, 24, 24]} />
            <meshPhysicalMaterial
                emissive={isLampOn ? "#ffffff" : "#000000"}
                emissiveIntensity={isLampOn ? 5 : 0}
                color={isLampOn ? "#fffbe6" : "#333333"}
                transparent
                opacity={isLampOn ? 1 : 0.3}
            />
        </mesh>
    );
};

// Lights component
const Lights = () => {
    const { isLampOn } = useLamp();
    
    // Detect if device is iPhone
    const isIPhone = typeof navigator !== 'undefined' && /iPhone/i.test(navigator.userAgent);
    
    // Increase fill light intensities for iPhone
    const fillLightMultiplier = isIPhone ? 1.5 : 1;
    
    return (
        <>
            {/* Warm, low ambient light for overall darkness */}
            <ambientLight intensity={isLampOn ? 10 : 15} color="#2c1a0b" />

            {/* Desk lamp: warm, focused, cozy - only when lamp is on */}
            {isLampOn && (
                <spotLight
                    position={[0.4, 0.32, 0.15]}
                    angle={0.8}
                    penumbra={0.7}
                    intensity={2}
                    castShadow
                    color="#ffdeae"
                    distance={3}
                />
            )}

            {/* Subtle blue rim light for depth - increased for iPhone */}
            <directionalLight
                position={[-2, 1.5, 1.5]}
                intensity={2 * fillLightMultiplier}
                color="#3a4a7c"
            />

            {/* Gentle fill light from the monitor - increased for iPhone */}
            <pointLight
                position={[0, 0.266, -0.045]}
                intensity={0.2 * fillLightMultiplier}
                color="#00FF00"
                distance={1.2}
            />

            {/* Optional: faint backlight for separation - increased for iPhone */}
            <pointLight
                position={[0, 1.2, -1.5]}
                intensity={1 * fillLightMultiplier}
                color="#a18fff"
                distance={3}
            />

            {/* Lamp glow mesh */}
            <LampGlow />
        </>
    );
};

// Updated: add spinner to Loader
const Loader = () => (
  <Html center>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          border: '4px solid rgba(255,255,255,0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
        }}
      />
      <span style={{ color: 'white', marginTop: '0.5rem', fontSize: '1rem' }}>
        Loading…
      </span>
    </div>
    <style>
      {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
    </style>
  </Html>
);

// Scene content component that uses the lamp context
const SceneContent = () => (
  <Suspense fallback={<Loader />}>
    <OrbitControls
      minDistance={0.5}
      maxDistance={3}
      enablePan={false}
      enableZoom={true}
      enableRotate={true}
      target={[0, 0.25, 0]}
      minPolarAngle={Math.PI / 2 - 0.25}
      maxPolarAngle={Math.PI / 2 + 0.25}
      minAzimuthAngle={-0.25}
      maxAzimuthAngle={0.25}
    />
    <Lights />
    <ComputerScreen />
    <ComputerDesk />
    <BasicKeyboard />
    <Lamp />
  </Suspense>
);

export default function MainScene() {
  return (
    <LampProvider>
      <Canvas
        camera={{ position: [0, 0.7, 1.5], fov: 75 }}
        style={{ background: 'black' }}
      >
        <SceneContent />
      </Canvas>
    </LampProvider>
  );
}
