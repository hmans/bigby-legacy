import { App, Transform } from "@bigby/core"
import { clamp } from "@bigby/math"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { quat, vec3 } from "gl-matrix"

export class RigidBody {
  raw?: RAPIER.RigidBody
}

export class Collider {
  raw?: RAPIER.Collider
  descriptor!: RAPIER.ColliderDesc
}

export class BoxCollider extends Collider {
  descriptor: RAPIER.ColliderDesc

  constructor(public size: vec3 = [1, 1, 1]) {
    super()

    this.descriptor = RAPIER.ColliderDesc.cuboid(
      size[0] / 2,
      size[1] / 2,
      size[2] / 2
    )
  }
}

export const PhysicsPlugin =
  ({ gravity = [0, -9.81, 0] }: { gravity?: vec3 } = {}) =>
  (app: App) =>
    app
      .addInitializer(async function () {
        await RAPIER.init()
      })
      .addStartupSystem((app) => {
        /* Create physics world */
        const physics = new RAPIER.World({
          x: gravity[0],
          y: gravity[1],
          z: gravity[2]
        })

        const rigidbodyQuery = app.world.query([Transform, RigidBody])

        /* Create new RAPIER rigidbodies when entities appear */
        rigidbodyQuery.onEntityAdded.add((entity) => {
          let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()

          const transform = entity.get(Transform)!
          const rigidbody = entity.get(RigidBody)!

          rigidBodyDesc.setTranslation(
            transform.position[0],
            transform.position[1],
            transform.position[2]
          )

          rigidBodyDesc.setRotation({
            x: transform.quaternion[0],
            y: transform.quaternion[1],
            z: transform.quaternion[2],
            w: transform.quaternion[3]
          })

          rigidBodyDesc.enabledTranslations(true, true, false)
          rigidBodyDesc.setLinearDamping(0.5)
          rigidBodyDesc.setAngularDamping(0.5)

          rigidbody.raw = physics.createRigidBody(rigidBodyDesc)
        })

        /* Create new RAPIER colliders when entities appear */
        const colliderQuery = app.world.query([RigidBody, Collider])

        /* Wire up colliders to their rigidbodies */
        colliderQuery.onEntityAdded.add((entity) => {
          const rigidbody = entity.get(RigidBody)!
          const collider = entity.get(Collider)!

          collider.raw = physics.createCollider(
            collider.descriptor,
            rigidbody.raw
          )
        })

        app.addSystem((dt: number) => {
          /* Simulate physics world */
          physics.timestep = clamp(dt, 0.01, 0.2)
          physics.step()

          /* Transfer physics transforms to the transform component */
          rigidbodyQuery.iterate((_, [transform, rigidbody]) => {
            const position = rigidbody.raw!.translation()
            vec3.set(transform.position, position.x, position.y, position.z)

            const rotation = rigidbody.raw!.rotation()
            quat.set(
              transform.quaternion,
              rotation.x,
              rotation.y,
              rotation.z,
              rotation.w
            )
          })
        })
      })
