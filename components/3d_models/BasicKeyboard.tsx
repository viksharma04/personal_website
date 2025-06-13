'use client';
import { useGLTF } from '@react-three/drei';

function Model3D() {
    const { scene } = useGLTF('/models/basic_keyboard.glb');
    return(
        <mesh
            castShadow
            receiveShadow
            scale={1.2}
            position={[-0.9, -0.035, -0.3]}
            rotation={[0, 0, 0]}
        >
            <primitive object={scene} />
        </mesh>
    );
}

export default function BasicKeyboard() {
    return(
        <>
            <Model3D />
        </>
    )
}