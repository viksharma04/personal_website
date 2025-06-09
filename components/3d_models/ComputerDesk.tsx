'use client';
import { useGLTF } from '@react-three/drei';

function Model3D() {
    const { scene } = useGLTF('/models/computer_desk.glb');
    return(
        <mesh
            castShadow
            receiveShadow
            scale={1}
            position={[0, -0.8, 0]}
            rotation={[0, 0, 0]}
        >
            <primitive object={scene} />
        </mesh>
    );
}

export default function ComputerDesk() {
    return(
        <>
            <Model3D />
        </>
    )
}


useGLTF.preload('/models/computer_desk.glb')