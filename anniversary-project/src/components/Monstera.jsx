import { useGLTF } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';

export function Monstera({onClick}) {
    
    const ref = useRef();
    const { scene } = useGLTF('../src/assets/models/monstera.glb')
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
            position={[4, 0.5, 4]}
            rotation={[0, Math.PI/2, 0]}
            onPointerOver={() => {
                sethover(true)
            }}
            onPointerOut={() => {
                sethover(false)
            }}
        >
            <primitive object={scene}/>
        </mesh>
    )
}

useGLTF.preload('../src/assets/models/monstera.glb')
