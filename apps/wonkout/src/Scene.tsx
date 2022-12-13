import { App, make, setup, System } from "bigby"
import * as THREE from "three"
import { FollowCamera } from "./FollowCamera"

export function Scene(app: App) {
  /* Camera */
  app.spawn([
    make(FollowCamera, { delta: 0.01 }),
    setup(
      new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      ),
      ({ position }) => position.set(0, 0, 20)
    )
  ])

  /* Lights */
  app.spawn([new THREE.AmbientLight(0xffffff, 1)])

  {
    const light = new THREE.DirectionalLight(0xffffff, 0.2)
    light.position.set(50, 80, 100)
    app.spawn([light])

    light.castShadow = true

    const { shadow } = light
    shadow.bias = 0.0001
    shadow.camera.left = -15
    shadow.camera.right = 15
    shadow.camera.top = 15
    shadow.camera.bottom = -15
    shadow.mapSize.width = 1024
    shadow.mapSize.height = 1024
  }
}
