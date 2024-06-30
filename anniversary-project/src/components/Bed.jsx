import { useGLTF } from '@react-three/drei';
import { useEffect, useState } from 'react';

export function Bed({onClick}) {
    
    const { scene } = useGLTF('../src/assets/models/bed.glb')

    const [hover, sethover] = useState(false)

    useEffect(() => {
        document.body.style.cursor = hover ? "pointer" : "grab";
    }, [hover])

    return (
        <mesh 
            castShadow
            receiveShadow
            onClick={onClick}
            scale={2}
            position={[0, 0.5, -2.4]}
            rotation={[0, Math.PI/2, 0]}
            onPointerOver={() => {
                sethover(true)
            }}
            onPointerOut={() => {
                sethover(false)
            }}
        >
            <primitive object={scene} />
        </mesh>
    )
}

useGLTF.preload('../src/assets/models/bed.glb')
