import { App, make } from "bigby"
import * as THREE from "three"

export const Floor = (app: App) =>
  app.onStart((app) => {
    app.spawn([
      make(THREE.Mesh, {
        receiveShadow: true,
        geometry: new THREE.PlaneGeometry(1000, 1000),
        material: new THREE.MeshStandardMaterial({ color: "#555" }),
        setup: ({ position }) => position.set(0, -0, -2)
      })
    ])
  })
