'use client';

import { useRef, useMemo } from 'react';
import { Mesh, BufferGeometry, PointsMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

const Stars = () => {
  const pointsRef = useRef<Mesh<BufferGeometry, PointsMaterial>>(null);

  const starPositions = useMemo(() => {
    const positions = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      const radius = 120 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[starPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.3}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.6}
      />
    </points>
  );
};

export default Stars;