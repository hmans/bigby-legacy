import { Components, ECS } from "./state"

function App() {
  return (
    <ECS.Entity>
      <p>moo</p>
      <Components.FrameCount count={123} />
    </ECS.Entity>
  )
}

export default App
