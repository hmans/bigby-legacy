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

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/* Set up the application */
const app = new App()
app.use(AnimationFrameTicker)
app.use(ThreePlugin)

app.use(async () => {
  console.log("Starting up!")

  // app.addSystem((dt) => console.log("dt", dt))

  return () => {
    console.log("shutting down!")
  }
})

class LoadingSystem extends System {
  ready = false
  promise: Promise<any> | null = null

  async start() {
    console.log("Loading a thing")
    this.promise = wait(1000)
    await this.promise

    this.ready = true
    console.log("Done loading")
  }

  run() {
    if (!this.ready) return

    console.log("run")
  }
}

app.addSystem(LoadingSystem)

/* Add a silly little system, just for fun */
class RotatesAllMeshesSystem extends System {
  speed = 1

  protected meshes = this.app.query([Mesh])

  run(dt: number) {
    for (const [_, mesh] of this.meshes) {
      mesh.rotation.x += dt * this.speed
      mesh.rotation.y += dt * this.speed
    }
  }
}

app.addSystem(RotatesAllMeshesSystem)

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

await wait(5000)

app.dispose()
