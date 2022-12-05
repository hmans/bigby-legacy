import { App, make, Transform3D } from "bigby"
import * as THREE from "three"

export const Floor = (app: App) =>
  app.onStart((app) => {
    app.add([
      make(Transform3D, [[0, 0, -2]]),
      make(THREE.Mesh, [], {
        receiveShadow: true,
        geometry: new THREE.PlaneGeometry(100, 100),
        material: new THREE.MeshStandardMaterial({ color: "#555" })
      })
    ])
  })
