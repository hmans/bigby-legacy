import { ThreePlugin } from "@bigby/plugin-three"
import { App, make, setup, TickerPlugin } from "bigby"
import * as THREE from "three"
import { Color, Object3D, Vector3 } from "three"
import "./style.css"

class AutoRotate {
  constructor(public velocity = new Vector3()) {}
}

export const AutorotatePlugin = (app: App) =>
  app.registerComponent(AutoRotate).onStart((app) => {
    const query = app.query([Object3D, AutoRotate])

    app.onUpdate((dt: number) => {
      for (const [_, transform, autorotate] of query) {
        transform.rotation.x += autorotate.velocity.x * dt
        transform.rotation.y += autorotate.velocity.y * dt
        transform.rotation.z += autorotate.velocity.z * dt
      }
    })
  })

const app = new App().use(TickerPlugin).use(ThreePlugin).use(AutorotatePlugin)

await app.start()

/* Camera */
app.add([
  make(
    THREE.PerspectiveCamera,
    {
      fov: 75,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 1000,
      position: [0, 0, 5],
    },
    (camera) => {
      camera.updateProjectionMatrix()
    }
  ),
])

/* Lights */
app.add([make(THREE.AmbientLight, { intensity: 0.2 })])
app.add([
  make(THREE.DirectionalLight, {
    intensity: 1,
    position: [10, 20, 30],
  }),
])

/* Rotating cube */
app.add([
  new AutoRotate(new Vector3(1, 2, 3)),
  new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: "hotpink" })
  ),
])
