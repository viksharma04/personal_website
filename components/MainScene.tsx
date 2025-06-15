'use client';

import { Canvas } from '@react-three/fiber';
import ComputerScreen from './3d_models/ComputerScreen';
import ComputerDesk from './3d_models/ComputerDesk';
import { Html, OrbitControls } from '@react-three/drei';
import Terminal from './Terminal';
import BasicKeyboard from './3d_models/BasicKeyboard';
import Lamp from './3d_models/Lamp';

// LampGlow component: a glowing sphere to simulate the lamp bulb
const LampGlow = () => (
    <mesh position={[0.4, 0.32, 0.15]}>
        <sphereGeometry args={[0.035, 24, 24]} />
        <meshPhysicalMaterial
            emissive="#ffffff"
            emissiveIntensity={5}
            color="#fffbe6"
            transparent
            opacity={1}
        />
    </mesh>
);

// Lights component
const Lights = () => (
    <>
        {/* Warm, low ambient light for overall darkness */}
        <ambientLight intensity={10} color="#2c1a0b" />

        {/* Desk lamp: warm, focused, cozy */}
        <spotLight
            position={[0.4, 0.32, 0.15]}
            angle={0.8}
            penumbra={0.7}
            intensity={1.5}
            castShadow
            color="#ffdeae"
            distance={3}
        />

        {/* Subtle blue rim light for depth */}
        <directionalLight
            position={[-2, 1.5, 1.5]}
            intensity={1.5}
            color="#3a4a7c"
        />

        {/* Gentle fill light from the monitor */}
        <pointLight
            position={[0, 0.266, -0.045]}
            intensity={0.1}
            color="#00FF00"
            distance={1.2}
        />

        {/* Optional: faint backlight for separation */}
        <pointLight
            position={[0, 1.2, -1.5]}
            intensity={1}
            color="#a18fff"
            distance={3}
        />

        {/* Lamp glow mesh */}
        <LampGlow />
    </>
);

export default function MainScene() {

  const isIPhone = typeof navigator !== 'undefined' &&
  /iPhone/i.test(navigator.userAgent);
  
  return (
    <Canvas
      className='w-full h-screen'
      camera={{position: [0, 0.7, 1.5], fov:75}}
      style={{background: 'black'}}
    >
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
      {/* render Terminal via CSS3D on iOS, otherwise use Html overlay */}
      <Html
        className='bg-black z-10 relative pointer-events-auto touch-action-auto'
        transform
        occlude="blending"
        // -0.045
        position={[0, isIPhone ? 0.44 : 0.266, isIPhone ? 0: -0.045]}
        rotation={[0, 0, 0]}
        center={true}
        scale={0.1}
        zIndexRange={[100, 0]}
      >
        <Terminal />
      </Html>
      <ComputerScreen />
      <ComputerDesk />
      <BasicKeyboard />
      <Lamp />
      {/* x:red y:green z:blue */}
      {/* <axesHelper position={[0.4, 0.32, 0.15]}/> */}
    </Canvas>
  );
}
