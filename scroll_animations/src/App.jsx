import { useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import './App.css'
import Experience from './components/Experience'
import { Suspense } from 'react'

function App() { 

  return (
    <Suspense>
      <Canvas 
        camera={{
          fov:75,
          position: [2.3, 1.5, 2.3],
        }}
      >
        <Experience />
        {/* <axesHelper /> */}
      </Canvas>
    </Suspense>
  )
}
// position: [2.3, 1.5, 2.3],
// [0.8, 0.8, 0.8]

export default App
