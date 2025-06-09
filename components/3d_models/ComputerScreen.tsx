'use client';
import { useGLTF } from '@react-three/drei';

function Model3D() {
    const { scene } = useGLTF('/models/computer_screen.glb');
    return(
        <mesh
            castShadow
            receiveShadow
            scale={0.2}
            position={[0, -0.024, 0]}
            rotation={[0, 0, 0]}
        >
            <primitive object={scene} />
        </mesh>
    );
}

export default function ComputerScreen() {
    return(
        <>
            <Model3D />
        </>
    )
}


useGLTF.preload('/models/computer_screen.glb')