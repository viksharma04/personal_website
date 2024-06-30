import { Canvas, useFrame } from '@react-three/fiber'
import Scene from './components/Scene'
import Room from './components/Room'
import './App.css'
import { useRef, useEffect, useState } from 'react'

function App() {

  const [grab, setGrab] = useState(false)

  useEffect(() => {
    document.body.style.cursor = grab ? "grabbing" : "grab"
  }, [grab])

  return (
    <Canvas
      camera={{position: [0,10,10], fov: 75}}
      onPointerDown={() => {
        setGrab(true)
      }}
      onPointerUp={() => {
        setGrab(false)
      }}
    >
      {/* x:red y:green z:blue */}
      {/* <axesHelper position={[3, 3, 4]}/> */}
      <Scene />
      <Room />
    </Canvas>
  )
}

export default App
