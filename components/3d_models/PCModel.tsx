'use client';
import { useGLTF } from '@react-three/drei';

function Model3D() {
    const { scene } = useGLTF('/api/models/pc_model.glb');
    return(
        <mesh
            castShadow
            receiveShadow
            scale={0.1}
            position={[-0.7, 0.2, 0]}
            rotation={[0, 1.5, 0]}
        >
            <primitive object={scene} />
        </mesh>
    );
}

export default function PCModel() {
    return(
        <>
            <Model3D />
        </>
    )
}


useGLTF.preload('/api/models/pc_model.glb')