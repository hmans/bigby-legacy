import * as Physics from "@bigby/plugin-physics3d"
import { App, apply, make, Transform3D } from "bigby"
import * as THREE from "three"

export const Walls = (app: App) =>
  app.onStart((app) => {
    const height = 4
    /* North Wall */
    app.add([
      new Physics.StaticBody(),
      new Physics.BoxCollider([24, 1, height]).setDensity(0),
      new Transform3D([0, 8.5, 0]),
      make(THREE.Mesh, [], {
        geometry: new THREE.BoxGeometry(24, 1, height),
        material: new THREE.MeshStandardMaterial({ color: "#999" }),
        castShadow: true
      })
    ])

    /* West Wall */
    app.add([
      new Physics.StaticBody(),
      new Physics.BoxCollider([1, 18, height]).setDensity(0),
      new Transform3D([-12.5, 0, 0]),
      apply(
        new THREE.Mesh(
          new THREE.BoxGeometry(1, 18, height),
          new THREE.MeshStandardMaterial({ color: "#999" })
        ),
        { castShadow: true }
      )
    ])

    /* East Wall */
    app.add([
      new Physics.StaticBody(),
      new Physics.BoxCollider([1, 18, height]).setDensity(0),
      new Transform3D([+12.5, 0, 0]),
      apply(
        new THREE.Mesh(
          new THREE.BoxGeometry(1, 18, height),
          new THREE.MeshStandardMaterial({ color: "#999" })
        ),
        { castShadow: true }
      )
    ])

    /* South (Death) Wall */
    app.add([
      new Physics.StaticBody(),
      new Physics.BoxCollider([27, 1, 1]).setDensity(0),
      new Transform3D([0, -9.5, 0])
    ])
  })
