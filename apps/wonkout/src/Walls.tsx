import * as Physics from "@bigby/plugin-physics3d"
import { App, make, System } from "bigby"
import * as THREE from "three"

class WallsSystem extends System {
  onStart(): void {
    const height = 4

    const material = new THREE.MeshStandardMaterial({ color: "#999" })

    /* North Wall */
    this.app.spawn([
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
    this.app.spawn([
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
    this.app.spawn([
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
    this.app.spawn([
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
  }
}

export const Walls = (app: App) => app.addSystem(WallsSystem)
