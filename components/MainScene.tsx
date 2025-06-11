'use client';

import { Canvas } from '@react-three/fiber';
import ComputerScreen from './3d_models/ComputerScreen';
import ComputerDesk from './3d_models/ComputerDesk';
import { Html, OrbitControls } from '@react-three/drei';
import Terminal from './Terminal';

// Lights component
const Lights = () => (
    <>
        <ambientLight intensity={1} />

        <spotLight
        position={[-3, 1, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={30}
        castShadow
        color={"#fcfbd7"}
        />

        <spotLight
        position={[3, 1, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={30}
        castShadow
        color={"#fcfbd7"}
        />

        <spotLight
        position={[0, 1, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={10}
        castShadow
        color={"#ffffff"}
        />

        <spotLight
        position={[0, 1, 3]}
        angle={0.8}
        penumbra={0.5}
        intensity={20}
        castShadow
        color={"#ffffff"}
        />
    </>
);

// Wall component
type WallProps = {
    position: [number, number, number];
    rotation: [number, number, number];
    color: string;
};

const Wall = ({ position, rotation, color }: WallProps) => (
    <mesh position={position} rotation={rotation}>
        <boxGeometry args={[10, 5, 0.2]} />
        <meshStandardMaterial color={color} />
    </mesh>
);

export default function MainScene() {
  return (
    <Canvas 
      className="w-full h-screen" 
      camera={{ position: [0, 0.33, 1.5], fov: 85 }}
      style={{ background: 'black' }}
    >
      <OrbitControls
      minDistance={0.5}
      maxDistance={3}
      enablePan={false}
      enableZoom={true}
      enableRotate={true}
      target={[0, 0.25, 0]}
      minPolarAngle={Math.PI / 2 - 0.2}
      maxPolarAngle={Math.PI / 2 + 0.2}
      minAzimuthAngle={-0.2}
      maxAzimuthAngle={0.2}
      />
      <Lights />
      {/* <Wall position={[0, 0, -5]} rotation={[0, 0, 0]} color={"#f7d5f6"} /> */}
      <Wall position={[0, -0.9, 0]} rotation={[-Math.PI/2, 0, 0]} color={"#282928"} />
      <ComputerScreen />
      <ComputerDesk />
      <Html
        transform
        occlude="blending"
        position={ [0, 0.266, -0.045] }
        rotation={ [0, 0, 0] }
        center={ true }
        scale={ 0.1 }
        style={{background: 'black'}}
      >
        <Terminal />
      </Html>
      {/* x:red y:green z:blue */}
      {/* <axesHelper position={[0, 1, -3]}/> */}
    </Canvas>
  );
}
