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
import { vec3 } from "gl-matrix"
import * as THREE from "three"
import "./style.css"

const app = new App()
  .use(TickerPlugin)
  .use(TransformsPlugin)
  .use(ThreePlugin)
  .use(AutorotatePlugin)

await app.start()

/* Camera */
{
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  camera.position.z = 10

  app.add([camera])
}
/* Lights */
app.add([new Transform3D(), new THREE.AmbientLight(0xffffff, 0.2)])

{
  const dlight = new THREE.DirectionalLight(0xffffff, 1)
  dlight.position.set(10, 20, 30)
  app.add([dlight])
}

/* Rotating cube */
{
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: "hotpink" })
  )

  app.add([new AutoRotate(new Vector3(vec3.fromValues(1, 2, 3))), mesh])
}
