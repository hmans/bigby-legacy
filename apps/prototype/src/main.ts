import { AnimationFrameTicker, App, make, System } from "bigby"
import {
  DirectionalLight,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
} from "three"
import { ThreePlugin } from "../../../packages/bigby-plugin-three/src"
import "./style.css"

/* Set up the application */
const app = new App()
app.use(AnimationFrameTicker)
app.use(ThreePlugin)

class FooSystem extends System {
  onStart(): void {
    console.log("FooSystem started")
  }

  onStop(): void {
    console.log("FooSystem stopped")
  }

  onUpdate(dt: number) {
    console.log("FooSystem update")
  }
}

app.addSystem(FooSystem)

/* Add a silly little system, just for fun */
class RotatesAllMeshesSystem extends System {
  speed = 1

  protected meshes = this.app.query([Mesh])

  onUpdate(dt: number) {
    for (const [_, mesh] of this.meshes) {
      mesh.rotation.x += dt * this.speed
      mesh.rotation.y += dt * this.speed
    }
  }
}

app.addSystem(RotatesAllMeshesSystem, { speed: 1 })

/* Set up the scene */
app.spawn([make(DirectionalLight, { position: [1, 2, 3] })])

app.spawn([
  make(PerspectiveCamera, {
    args: [75, window.innerWidth / window.innerHeight, 0.1, 1000],
    position: [0, 0, 5],
  }),
])

app.spawn([
  make(Mesh, {
    geometry: make(IcosahedronGeometry),
    material: make(MeshStandardMaterial),
  }),
])

app.start()

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// await wait(1000)

// app.stop()
