import { useGLTF } from '@react-three/drei';
import { useEffect, useState } from 'react';

export function Cat({onClick}) {
    
    const { scene } = useGLTF('../src/assets/models/sleepy_comfy_cat.glb')

    const [hover, sethover] = useState(false)

    useEffect(() => {
        document.body.style.cursor = hover ? "pointer" : "grab";
    }, [hover])

    return (
        <mesh 
            castShadow
            receiveShadow
            onClick={onClick}
            scale={0.5}
            position={[0, 0.4, 0.5]}
            rotation={[0, -Math.PI/6, 0]}
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

useGLTF.preload('../src/assets/models/sleepy_comfy_cat.glb')
