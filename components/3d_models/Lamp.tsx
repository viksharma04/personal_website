'use client';
import { useGLTF } from '@react-three/drei';
import { useLamp } from '../LampContext';

function Model3D() {
    const { scene } = useGLTF('/models/desk_lamp.glb');
    const { toggleLamp } = useLamp();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleLamp();
    };

    return(
        <mesh
            castShadow
            receiveShadow
            scale={0.25}
            position={[0.55, 0.2, 0.19]}
            rotation={[0, -3.6, 0]}
            onClick={handleClick}
            onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'auto';
            }}
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