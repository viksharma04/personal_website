'use client';
import { useRef } from 'react';
import { Mesh, CanvasTexture, RepeatWrapping, MeshBasicMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

function createTerminalTexture(flickerIntensity = 1): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d')!;
  
  // Dark green background (not pure black)
  ctx.fillStyle = '#010300';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add noise for vintage CRT effect
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 8;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));     // Red
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // Green
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // Blue
  }
  ctx.putImageData(imageData, 0, 0);
  
  // Terminal text with flickering
  const alpha = 0.85 + (flickerIntensity * 0.3); // Vary opacity for flicker effect
  ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
  ctx.font = '19px "Courier New", monospace';
  
  const lines = [
    '',
    '$ cd projects',
    '',
    '$ npm run dev',
    '',
    '> dev',
    '> next dev',
    '',
    '  ▲ Next.js 14.2.5',
    '',
    '  - Local:        http://localhost:3000',
    '  - Network:      http://192.168.1.100:3000',
    '',
    ' ✓ Ready in 2.3s',
    '',
    '$ _'
  ];
  
  lines.forEach((line, index) => {
    ctx.fillText(line, 10, 20 + index * 16);
  });
  
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.needsUpdate = true;
  
  return texture;
}

export default function TerminalScreen() {
  const meshRef = useRef<Mesh>(null);
  const textureRef = useRef<CanvasTexture | null>(null);
  
  // Initialize texture
  if (!textureRef.current) {
    textureRef.current = createTerminalTexture();
  }
  
  // Add flickering animation
  useFrame((state) => {
    if (meshRef.current && meshRef.current.material && textureRef.current) {
      // Create flicker effect with random variations
      const flickerBase = Math.sin(state.clock.elapsedTime * 50) * 0.5 + 0.5;
      const randomFlicker = Math.random() * 0.3;
      const flickerIntensity = flickerBase + randomFlicker;
      
      // Update texture with new flicker intensity
      const newTexture = createTerminalTexture(flickerIntensity);
      const material = meshRef.current.material as MeshBasicMaterial;
      material.map = newTexture;
      material.needsUpdate = true;
      
      // Dispose old texture to prevent memory leaks
      if (textureRef.current) {
        textureRef.current.dispose();
      }
      textureRef.current = newTexture;
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={[0, 0.266, -0.045]} // Position on the monitor screen (adjusted to match monitor light position)
      rotation={[0, 0, 0]}
      scale={[0.75, 0.51, 1]} // Scaled 3x larger for better visibility
    >
      <planeGeometry args={[1, 0.75]} />
      <meshBasicMaterial
        map={textureRef.current}
        transparent={false}
      />
    </mesh>
  );
}