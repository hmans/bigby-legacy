import * as Physics from "@bigby/plugin-physics3d"
import { Parent3D } from "@bigby/plugin-three"
import { App, make, System } from "bigby"
import * as THREE from "three"
import { Brick } from "./Bricks"
import { ConstantVelocity } from "./ConstantVelocityPlugin"
import { CameraTarget } from "./FollowCamera"

export class BallSystem extends System {
  onStart() {
    /* Ball */
    const ball = this.app.spawn([
      new CameraTarget(),

      new Physics.DynamicBody((desc) =>
        desc.enabledTranslations(true, true, false)
      ),

      new Physics.BallCollider(0.3).setDensity(1).onCollisionEnd((other) => {
        const brick = other.get(Brick)

        if (brick) {
          brick.health--

          if (brick.health <= 0) {
            this.app.destroy(other)
          }
        }
      }),

      new ConstantVelocity(10),

      make(THREE.Mesh, {
        geometry: new THREE.IcosahedronGeometry(0.4, 0),
        material: make(THREE.MeshStandardMaterial, {
          color: new THREE.Color("white").multiplyScalar(2),
          side: THREE.BackSide
        }),
        castShadow: true,
        setup: ({ position }) => position.set(0, -5.5, 0)
      })
    ])

    /* Light */
    this.app.spawn([
      make(THREE.PointLight, { args: ["hotpink", 3, 10], castShadow: true }),
      make(Parent3D, { parent: ball.get(THREE.Object3D) })
    ])

    /* I don't have the APIs yet, so please don't look at this */
    const rb = ball.get(Physics.DynamicBody)!.raw!
    const coll = ball.get(Physics.BallCollider)!.raw!
    console.log(rb, ball)
    rb.setLinearDamping(0)
    // rb.applyImpulse({ x: 0, y: 5, z: 0 }, true)
    coll.setRestitution(1)
  }
}

export const Ball = (app: App) => app.addSystem(BallSystem)
