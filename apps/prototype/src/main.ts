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
await app.start()

class HelloSystem extends System {
  tick(dt: number) {}
}

app.spawn([HelloSystem, EarlyUpdate])

app.spawn([make(DirectionalLight, { position: [1, 2, 3] })])

app.spawn([
  make(PerspectiveCamera, { args: [75, 2, 0.1, 1000], position: [0, 0, 5] }),
])

app.spawn([
  make(Mesh, {
    geometry: make(IcosahedronGeometry),
    material: make(MeshStandardMaterial),
  }),
])
