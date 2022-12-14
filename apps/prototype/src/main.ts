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

  // await wait(2000)
  // app.addSystem((dt) => console.log("dt", dt))

  return () => {
    console.log("shutting down!")
  }
})

class LoadingSystem extends System {
  async start() {
    console.log("Loading a thing")
    await wait(1000)
    console.log("Done loading")
  }

  run() {
    /* This will only run when the system is ready */
    console.log("running")
  }

  dispose() {
    console.log("disposing")
  }
}

const loadingSystem = new LoadingSystem(app)

app.addSystem(loadingSystem)

function systemsReady(systems: System[]) {
  return Promise.all(systems.map((system) => system.promise))
}

await systemsReady([loadingSystem])

console.log("moving on")

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
