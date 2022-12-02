import { Canvas } from "@react-three/fiber"
import { ECS, FrameCount } from "./state"

export const Components = {
  FrameCount: ECS.makeComponent(FrameCount)
}

function App() {
  return (
    <Canvas>
      <ECS.Entity>
        {/* This is a component component (ahem) that we explicitly
        created. It will automatically expost properties on the component
        as props. */}
        <Components.FrameCount count={123} />

        {/* But we can also use the generic `Component` component to
        capture any object as a component into the entity. */}
        <ECS.Component>
          <mesh>
            <icosahedronGeometry />
            <meshBasicMaterial color="hotpink" />
          </mesh>
        </ECS.Component>
      </ECS.Entity>
    </Canvas>
  )
}

export default App
