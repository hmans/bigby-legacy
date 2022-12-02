import { App, Transform } from "@bigby/core"
import { clamp } from "@bigby/math"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { RigidBodyDesc } from "@dimforge/rapier3d-compat"
import { quat, vec3 } from "gl-matrix"

export abstract class RigidBody {
  abstract desc: RigidBodyDesc
  raw?: RAPIER.RigidBody

  setEnabledTranslations(...enabled: [boolean, boolean, boolean]) {
    this.desc.enabledTranslations(...enabled)
    return this
  }

  setEnabledRotations(...enabled: [boolean, boolean, boolean]) {
    this.desc.enabledRotations(...enabled)
    return this
  }
}

export class DynamicBody extends RigidBody {
  desc = RAPIER.RigidBodyDesc.dynamic()
}

export class StaticBody extends RigidBody {
  desc = RAPIER.RigidBodyDesc.fixed()
}

export abstract class Collider {
  raw?: RAPIER.Collider
  abstract descriptor: RAPIER.ColliderDesc

  setDensity(density: number) {
    this.descriptor.setDensity(density)
    return this
  }
}

export class BoxCollider extends Collider {
  descriptor: RAPIER.ColliderDesc

  constructor(size: vec3 = [1, 1, 1]) {
    super()

    this.descriptor = RAPIER.ColliderDesc.cuboid(
      size[0] / 2,
      size[1] / 2,
      size[2] / 2
    )
  }
}

export class BallCollider extends Collider {
  descriptor: RAPIER.ColliderDesc

  constructor(radius: number) {
    super()

    this.descriptor = RAPIER.ColliderDesc.ball(radius)
  }
}

export const Plugin =
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
          let desc = entity.get(RigidBody)!.desc

          const transform = entity.get(Transform)!
          const rigidbody = entity.get(RigidBody)!

          desc.setTranslation(
            transform.position[0],
            transform.position[1],
            transform.position[2]
          )

          desc.setRotation({
            x: transform.quaternion[0],
            y: transform.quaternion[1],
            z: transform.quaternion[2],
            w: transform.quaternion[3]
          })

          desc.setLinearDamping(0.5)
          desc.setAngularDamping(0.5)

          rigidbody.raw = physics.createRigidBody(desc)
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

            /* Reset forces */
            rigidbody.raw!.resetForces(true)
          })
        })
      })
