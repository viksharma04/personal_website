import React, { useRef, useEffect } from 'react';

function getRandomCoordinate() {
  const range = 1000;
  const offset = 50;
  const sign = Math.random() < 0.5 ? -1 : 1;
  return sign * (Math.random() * range + offset);
}

function Star() {
  const starRef = useRef();

  useEffect(() => {
    const [x, y, z] = Array(3).fill().map(() => getRandomCoordinate());
    starRef.current.position.set(x, y, z);
  }, []);

  const radius = Math.random() * 1 + 1;
  return (
    <mesh ref={starRef}>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshBasicMaterial color={0xffffff} />
    </mesh>
  );
}

function Stars() {
  return (
    <>
      {Array(500).fill().map((_, i) => (
        <Star key={i} />
      ))}
    </>
  );
}

const Scene = () => {

  return (
    <>
    <Stars />
    </>
  )
}

export default Scene