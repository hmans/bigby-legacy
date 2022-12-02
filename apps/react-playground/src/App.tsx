import { Canvas } from "@react-three/fiber"
import { ECS, FrameCount } from "./state"

export const Components = {
  FrameCount: ECS.makeComponent(FrameCount)
}

function App() {
  return (
    <Canvas>
      <ECS.Entity>
        <Components.FrameCount count={123} />

        <mesh>
          <icosahedronGeometry />
          <meshBasicMaterial color="hotpink" />
        </mesh>
      </ECS.Entity>
    </Canvas>
  )
}

export default App
