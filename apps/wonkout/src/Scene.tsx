import { App, Transform3D } from "bigby"
import * as THREE from "three"

export const Scene = (app: App) =>
  app.onStart((app) => {
    /* Camera */
    app.add([
      new Transform3D([0, 0, 25]),
      new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
    ])

    /* Lights */
    app.add([new Transform3D([0, 0, 0]), new THREE.AmbientLight(0xffffff, 1)])

    {
      const light = new THREE.DirectionalLight(0xffffff, 0.2)
      app.add([new Transform3D([50, 80, 100]), light])

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
  })
