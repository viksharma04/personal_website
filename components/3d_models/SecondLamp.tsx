'use client';
import { useGLTF } from '@react-three/drei';
import { useLamp } from '../LampContext';

function Model3D() {
    const { scene } = useGLTF('/api/models/lamp.glb');
    const { toggleSecondLamp } = useLamp();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleSecondLamp();
    };

    return(
        <mesh
            castShadow
            receiveShadow
            scale={1}
            position={[-0.8, -0.8, -1]}
            rotation={[0, 0, 0]}
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

export default function SecondLamp() {
    return(
        <>
            <Model3D />
        </>
    )
}

useGLTF.preload('/api/models/lamp.glb')