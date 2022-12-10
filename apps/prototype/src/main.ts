import { AnimationFrameTicker, App, EarlyUpdate, make, System } from "bigby"
import {
  DirectionalLight,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
} from "three"
import { ThreePlugin } from "../../../packages/bigby-plugin-three/src"
import "./style.css"

const app = new App()
app.use(AnimationFrameTicker())
app.use(ThreePlugin)

class DummySystem extends System {
  meshes = this.app.query([Mesh])

  tick(dt: number) {
    for (const [_, mesh] of this.meshes) {
      mesh.rotation.x += dt
      mesh.rotation.y += dt
    }
  }
}

app.spawn([new DummySystem(app)])

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

await app.start()
