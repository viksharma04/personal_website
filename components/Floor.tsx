// components/MossFloor.tsx
'use client';

import { useTexture } from '@react-three/drei';
import {
  RepeatWrapping,
  SRGBColorSpace,
  LinearSRGBColorSpace,
} from 'three';

export default function FoamFloor() {
  // Load all maps from S3 via API route
  const [
    albedo,
    normal,
    roughness,
    ao,
    displacement,
  ] = useTexture([
    '/api/textures/foam/AcousticFoam_albedo.jpg',
    '/api/textures/foam/AcousticFoam_normal.jpg',
    '/api/textures/foam/AcousticFoam_roughness.jpg',
    '/api/textures/foam/AcousticFoam_ao.jpg',
    '/api/textures/foam/AcousticFoam_height.jpg',
  ]);

  // Common setup helper
  [albedo, normal, roughness, ao, displacement].forEach(tex => {
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(4, 4);          // tile 4×4 across the plane
    tex.anisotropy = 16;           // crisper at glancing angles
  });
  albedo.colorSpace = SRGBColorSpace;
  [normal, roughness, ao, displacement].forEach(
    tex => (tex.colorSpace = LinearSRGBColorSpace),
  );

  return (
    <mesh
      rotation-x={-Math.PI / 2}   // lay the plane flat
      position={[0, -0.95, 0]}
      receiveShadow               // let it catch shadows
    >
      {/* Add subdivisions so the height map can displace vertices */}
      <planeGeometry args={[50, 50, 64, 64]} />
      <meshStandardMaterial
        map={albedo}
        normalMap={normal}
        roughnessMap={roughness}
        aoMap={ao}
        displacementMap={displacement}
        displacementScale={0.25}   // tweak to taste
      />
    </mesh>
  );
}
