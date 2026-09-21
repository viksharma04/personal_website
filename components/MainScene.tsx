'use client';

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { SpotLight } from 'three';
import { OrbitControls } from '@react-three/drei';
import RoomLoader from './RoomLoader';
import ComputerScreen from './3d_models/ComputerScreen';
import ComputerDesk from './3d_models/ComputerDesk';
import BasicKeyboard from './3d_models/BasicKeyboard';
import Lamp from './3d_models/Lamp';
import SecondLamp from './3d_models/SecondLamp';
import { LampProvider, useLamp } from './LampContext';
import Floor from './Floor';
import Stars from './Stars';

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

// SecondLampGlow component: a glowing sphere for the second lamp
const SecondLampGlow = () => {
    const { isSecondLampOn } = useLamp();
    
    return (
        <mesh position={[-0.75 , 0.35, -0.9]}>
            <sphereGeometry args={[0.035, 24, 24]} />
            <meshPhysicalMaterial
                emissive={isSecondLampOn ? "#ffffff" : "#000000"}
                emissiveIntensity={isSecondLampOn ? 5 : 0}
                color={isSecondLampOn ? "#fffbe6" : "#333333"}
                transparent
                opacity={isSecondLampOn ? 1 : 0.3}
            />
        </mesh>
    );
};

// SecondSpotLight component with helper
const SecondSpotLight = () => {
    const spotLightRef = useRef<SpotLight>(null);
    // useHelper(spotLightRef as any, SpotLightHelper, 'cyan');
    
    return (
      <spotLight
        ref={spotLightRef}
        position={[-0.76 , 0.32, -0.9]}
        target-position={[0, -0.7 , 0]} // Aims at origin, change these coordinates to aim elsewhere
        angle={0.4}
        penumbra={0.7}
        intensity={1}
        castShadow
        color="#ffdeae"
        distance={3}
      />
    );
};

// Corner rim lights (the camera sits at +z looking toward the screen at -z).
// Intensities and temperatures are deliberately uneven so the room has some
// texture: the back-left / front-right diagonal carries the light in cool
// tones, the other diagonal is barely there and warm, and the two lights on
// each diagonal differ slightly from each other.
const RIM_LIGHTS: { position: [number, number, number]; intensity: number; color: string }[] = [
    { position: [-2, 1.5, 1.5], intensity: 0.8, color: '#5a6a9c' },   // back-left: cool blue
    { position: [2, 1.5, 1.5], intensity: 0.1, color: '#b08a6a' },    // back-right: warm amber
    { position: [-2, 1.5, -1.5], intensity: 0.1, color: '#a88c78' },  // front-left: warm, slightly muted
    { position: [2, 1.5, -1.5], intensity: 0.5, color: '#6a7a92' },   // front-right: cool steel
];

// Lights component
const Lights = () => {
    const { isLampOn, isSecondLampOn } = useLamp();
    
    // Detect if device is iPhone
    const isIPhone = typeof navigator !== 'undefined' && /iPhone/i.test(navigator.userAgent);
    
    // Increase fill light intensities for iPhone
    const fillLightMultiplier = isIPhone ? 1.5 : 1;
    
    return (
        <>
            {/* Warm, low ambient light for overall darkness */}
            <ambientLight intensity={isLampOn ? 5 : 0} color="#2c1a0b" />
            <ambientLight intensity={isSecondLampOn ? 5 : 0} color="#2c1a0b" />
            
            {/* Desk lamp: warm, focused, cozy - only when lamp is on */}
            {isLampOn && (
                <spotLight
                    position={[0.4, 0.32, 0.15]}
                    angle={0.6}
                    penumbra={0.7}
                    intensity={2}
                    castShadow
                    color="#ffdeae"
                    distance={3}
                />
            )}
            
            {/* Rim lights in all four corners for depth - increased for iPhone */}
            {RIM_LIGHTS.map(({ position, intensity, color }) => (
                <directionalLight
                    key={position.join(',')}
                    position={position}
                    intensity={intensity * fillLightMultiplier}
                    color={color}
                />
            ))}

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

            {/* Second lamp: cool, focused light - only when second lamp is on */}
            {isSecondLampOn && (
                <SecondSpotLight />
            )}

            {/* Lamp glow meshes */}
            <LampGlow />
            <SecondLampGlow />
        </>
    );
};

// Scene content component that uses the lamp context.
// The loading visual is the DOM-level <RoomLoader /> overlay (a sibling of the
// Canvas), so the in-Canvas Suspense fallback renders nothing.
const SceneContent = () => (
  <Suspense fallback={null}>
    <OrbitControls
      minDistance={0.5}
      maxDistance={3}
      enablePan={false}
      enableZoom={true}
      enableRotate={true}
      target={[0, 0.25, 0]}
      minPolarAngle={Math.PI / 2 - 0.30}
      maxPolarAngle={Math.PI / 2 + 0.30}
      minAzimuthAngle={-2}
      maxAzimuthAngle={2}
    />
    <Lights />
    {/* <axesHelper args={[1]} position={[0, -1, 0]} /> */}
    <ComputerScreen />
    <ComputerDesk />
    <BasicKeyboard />
    <Lamp />
    <SecondLamp />
    <Floor />
    <Stars />
  </Suspense>
);

export default function MainScene() {
  return (
    <LampProvider>
      <Canvas
        camera={{ position: [0, 0.7, 2], fov: 90 }}
        style={{ background: 'black' }}
      >
        <SceneContent />
      </Canvas>
      <RoomLoader />
    </LampProvider>
  );
}
