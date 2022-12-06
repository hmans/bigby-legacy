import * as Physics from "@bigby/plugin-physics3d"
import { App, make } from "bigby"
import * as THREE from "three"

export const Walls = (app: App) =>
  app.onStart((app) => {
    const height = 4

    const material = new THREE.MeshStandardMaterial({ color: "#999" })

    /* North Wall */
    app.spawn([
      new Physics.StaticBody(),
      new Physics.BoxCollider([24, 1, height]).setDensity(0),
      make(THREE.Mesh, {
        geometry: new THREE.BoxGeometry(24, 1, height),
        material,
        castShadow: true,
        receiveShadow: true,
        position: [0, 8.5, 0]
      })
    ])

    /* West Wall */
    app.spawn([
      new Physics.StaticBody(),
      new Physics.BoxCollider([1, 18, height]).setDensity(0),
      make(THREE.Mesh, {
        geometry: new THREE.BoxGeometry(1, 18, height),
        material,
        castShadow: true,
        receiveShadow: true,
        position: [-12.5, 0, 0]
      })
    ])

    /* East Wall */
    app.spawn([
      new Physics.StaticBody(),
      new Physics.BoxCollider([1, 18, height]).setDensity(0),
      make(THREE.Mesh, {
        geometry: new THREE.BoxGeometry(1, 18, height),
        material,
        castShadow: true,
        receiveShadow: true,
        position: [12.5, 0, 0]
      })
    ])

    /* South (Death) Wall */
    /* North Wall */
    app.spawn([
      new Physics.StaticBody(),
      new Physics.BoxCollider([24, 1, height]).setDensity(0),
      make(THREE.Mesh, {
        geometry: new THREE.BoxGeometry(24, 1, height),
        material,
        castShadow: true,
        receiveShadow: true,
        position: [0, -8.5, 0]
      })
    ])
  })
