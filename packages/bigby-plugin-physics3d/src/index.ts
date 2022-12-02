import { App, Transform } from "@bigby/core"
import { clamp } from "@bigby/math"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { quat, vec3 } from "gl-matrix"

export class RigidBody {
  rigidBody?: RAPIER.RigidBody
  collider?: RAPIER.Collider
}

export const PhysicsPlugin =
  ({ gravity = [0, -9.81, 0] }: { gravity?: vec3 } = {}) =>
  (app: App) =>
    app
      .addInitializer(async function () {
        await RAPIER.init()
      })
      .addStartupSystem((app) => {
        const physics = new RAPIER.World({
          x: gravity[0],
          y: gravity[1],
          z: gravity[2]
        })

        const entities = app.world.query([Transform, RigidBody])

        entities.onEntityAdded.add((entity) => {
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

          rigidbody.rigidBody = physics.createRigidBody(rigidBodyDesc)

          // Create a cuboid collider attached to the dynamic rigidBody.
          let colliderDesc = RAPIER.ColliderDesc.cuboid(
            0.5,
            0.5,
            0.5
          ).setDensity(5.0)
          rigidbody.collider = physics.createCollider(
            colliderDesc,
            rigidbody.rigidBody
          )
        })

        app.addSystem((dt: number) => {
          physics.timestep = clamp(dt, 0.01, 0.2)
          physics.step()

          entities.iterate((entity, [transform, rigidbody]) => {
            const position = rigidbody.rigidBody!.translation()
            vec3.set(transform.position, position.x, position.y, position.z)

            const rotation = rigidbody.rigidBody!.rotation()
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
