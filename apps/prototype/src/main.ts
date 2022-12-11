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

/* Add a silly little system, just for fun */
class RotatesAllMeshesSystem extends System {
  meshes = this.app.query([Mesh])

  onUpdate(dt: number) {
    for (const [_, mesh] of this.meshes) {
      mesh.rotation.x += dt
      mesh.rotation.y += dt
    }
  }
}

app.spawn([new RotatesAllMeshesSystem(app)])

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

/* Let's go */
app.start()
