import { OrbitControls, ScrollControls } from '@react-three/drei';
import { Office } from './Office'
import { useFrame, useThree } from '@react-three/fiber'
import { Chair } from './Chair';
import { Desk } from './Desk';
import { Screen } from './Screen';
import * as THREE from 'three'
import { useEffect, useRef } from 'react';

const Experience = () => {

    return (
        <>  
            <ambientLight intensity={1}/>
            <directionalLight position={[0, 1, 1]} intensity={[2]}/>
            <spotLight position={[2, 2, -2]}/>         
            <OrbitControls enableZoom={false}/>

            <ScrollControls pages={2} damping={0.5}>
                <Chair />
                <Screen />
                <Desk />
            </ScrollControls>
            
        </>
    )
}

export default Experience