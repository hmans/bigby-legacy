import { Components, ECS } from "./state"

function App() {
  return (
    <ECS.Entity>
      <p>moo</p>
      <Components.FrameCount />
    </ECS.Entity>
  )
}

export default App
