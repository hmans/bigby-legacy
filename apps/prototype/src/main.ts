import { ThreePlugin } from "@bigby/plugin-three"
import {
  App,
  AutoRotate,
  AutorotatePlugin,
  TickerPlugin,
  Transform3D,
  TransformsPlugin,
  Vector3,
} from "bigby"
import * as THREE from "three"
import "./style.css"

const app = new App()
  .use(TickerPlugin)
  .use(TransformsPlugin)
  .use(ThreePlugin)
  .use(AutorotatePlugin)

await app.start()

/* Camera */
app.add([
  new Transform3D(new Vector3(0, 0, 10)),
  new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
])

/* Lights */
app.add([new Transform3D(), new THREE.AmbientLight(0xffffff, 0.2)])
app.add([
  new Transform3D(new Vector3(10, 20, 30)),
  new THREE.DirectionalLight(0xffffff, 1),
])

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: "hotpink" })
)

/* Rotating cube */
app.add([new AutoRotate(new Vector3(1, 2, 3)), new Transform3D(), mesh])
