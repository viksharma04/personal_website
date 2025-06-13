'use client';

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import ComputerScreen from './3d_models/ComputerScreen';
import ComputerDesk from './3d_models/ComputerDesk';
import { Html, OrbitControls } from '@react-three/drei';
import Terminal from './Terminal';
import BasicKeyboard from './3d_models/BasicKeyboard';
import Lamp from './3d_models/Lamp';
import React, { useRef, useEffect } from 'react';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { createRoot, Root } from 'react-dom/client';

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

// CSS3D fallback component for iOS
const CSS3DFallback = () => {
  const { gl, scene, camera, size } = useThree();
  const rendererRef = useRef<CSS3DRenderer | null>(null);

  useEffect(() => {
    const renderer = new CSS3DRenderer();
    renderer.setSize(size.width, size.height);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    // append CSS3D canvas alongside WebGL canvas
    gl.domElement.parentElement?.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // create DOM container for Terminal
    const domEl = document.createElement('div');
    domEl.style.width = '300px';
    domEl.style.height = '200px';
    domEl.style.pointerEvents = 'auto';
    domEl.style.transformStyle = 'preserve-3d';
    const root: Root = createRoot(domEl);
    root.render(<Terminal />);

    // wrap in CSS3DObject
    const cssObject = new CSS3DObject(domEl);
    cssObject.position.set(0, 0.266, -0.045);
    cssObject.scale.set(0.1, 0.1, 0.1);
    scene.add(cssObject);

    return () => {
      scene.remove(cssObject);
      renderer.domElement.remove();
      root.unmount();
    };
  }, [gl, scene, camera, size]);

  useFrame(() => {
    if (rendererRef.current) rendererRef.current.render(scene, camera);
  });

  return null;
};

export default function MainScene() {
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  return (
    <Canvas 
      className="w-full h-screen" 
      camera={{ position: [0, 0.7, 1.5], fov: 75 }}
      style={{ background: 'black' }}
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
      {isIOS ? (
        <CSS3DFallback />
      ) : (
        <Html
          className='bg-black z-10 relative pointer-events-auto touch-action-auto'
          transform
          occlude="blending"
          position={[0, 0.266, -0.045]}
          rotation={[0, 0, 0]}
          center={true}
          scale={0.1}
          zIndexRange={[100, 0]}
        >
          <Terminal />
        </Html>
      )}
      <ComputerScreen />
      <ComputerDesk />
      <BasicKeyboard />
      <Lamp />
      {/* x:red y:green z:blue */}
      {/* <axesHelper position={[0.4, 0.32, 0.15]}/> */}
    </Canvas>
  );
}
