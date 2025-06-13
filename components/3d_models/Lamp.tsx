'use client';
import { useGLTF } from '@react-three/drei';

function Model3D() {
    const { scene } = useGLTF('/models/desk_lamp.glb');
    return(
        <mesh
            castShadow
            receiveShadow
            scale={0.25}
            position={[0.55, 0.2, 0.19]}
            rotation={[0, -3.6, 0]}
        >
            <primitive object={scene} />
        </mesh>
    );
}

export default function Lamp() {
    return(
        <>
            <Model3D />
        </>
    )
}