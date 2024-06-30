import { useLoader } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Bed } from './Bed';
import { Monstera } from './Monstera';
import { Frame } from './Frame';
import { Cat } from './Cat';
import { useState } from 'react';
import { images } from './images';
import { texts } from './text';
import ContentBox from './ContentBox';
import HelpInfo from './HelpInfo';

// Wall component
const Wall = ({ position, rotation, color }) => (
    <mesh position={position} rotation={rotation}>
        <boxGeometry args={[10, 5, 0.2]} />
        <meshStandardMaterial color={color} />
    </mesh>
);

// Floor component
const TexturedPlane = ({ position }) => {
    const [baseColor, height, normal, roughness, ao] = useLoader(THREE.TextureLoader, [
        '../src/assets/textures/floor_04/basecolor.jpg',
        '../src/assets/textures/floor_04/height.png',
        '../src/assets/textures/floor_04/normal.jpg',
        '../src/assets/textures/floor_04/roughness.jpg',
        '../src/assets/textures/floor_04/ambientOcculsion.jpg',
    ]);

    return (
        <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial
                map={baseColor}
                displacementMap={height}
                normalMap={normal}
                roughnessMap={roughness}
                aoMap={ao}
            />
        </mesh>
    );
};

// Lights component
const Lights = () => (
    <>
        <pointLight position={[3, 5, 3]} intensity={10} color={"#f7e4b0"} />
        <pointLight position={[-3, 5, 3]} intensity={10} color={"#f7e4b0"} />
        <pointLight position={[0, 3, 1]} intensity={3} color={"#ffffff"} />
        <pointLight position={[3, 5, -3]} intensity={10} color={"#f7e4b0"} />
        <pointLight position={[-3, 5, -3]} intensity={10} color={"#f7e4b0"} />
        <pointLight position={[0, 5, 0]} intensity={10} color={"#f7e4b0"} />
        <pointLight position={[3, 3, 4]} intensity={5} color={"#ffffff"} />
        <pointLight position={[-3, 3, 4]} intensity={5} color={"#ffffff"} />
        <directionalLight position={[0, 5, 0]} intensity={1} />
        <directionalLight position={[-3, 0, -10]} intensity={0.5} color={"#f7e4b0"} />
        <directionalLight position={[3, 0, -10]} intensity={0.5} color={"#f7e4b0"} />
    </>
);

const Room = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [index, setIndex] = useState(0);
    const [showHelp, setShowHelp] = useState(true);

    const handleClick = (newIndex) => {
        setShowPopup(!showPopup);
        setIndex(newIndex);
        setShowHelp(false);
    };

    return (
        <>
            <OrbitControls 
                minDistance={2} 
                maxDistance={15} 
                maxPolarAngle={Math.PI / 2} 
                enablePan={false} 
                dampingFactor={0.25}
                target={[0, 1, 0.5]}
            />
            <Lights />
            <TexturedPlane position={[0, 0, 0]} />
            <Wall position={[0, 2.5, -5]} rotation={[0, 0, 0]} color={"#f7d5f6"} />
            <Wall position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} color={"#f7d5f6"} />
            <Wall position={[5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} color={"#f7d5f6"} />
            <Bed onClick={() => handleClick(1)} />
            <Monstera onClick={() => handleClick(3)} />
            <Frame onClick={() => handleClick(2)} />
            <Cat onClick={() => handleClick(0)} />
            {showPopup && (
              <ContentBox clickFunction={() => handleClick(0)} text={texts[index]} imageSource={images[index]}/>
            )}
            {showHelp && (
              <HelpInfo onClick={handleClick(0)}/>
            )}
        </>
    );
};

export default Room;
