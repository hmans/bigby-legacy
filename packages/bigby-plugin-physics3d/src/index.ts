import { App, Transform } from "@bigby/core"
import { clamp } from "@bigby/math"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { ColliderHandle, RigidBodyDesc } from "@dimforge/rapier3d-compat"
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

  _onCollisionStart?: (other: Collider) => void

  setDensity(density: number) {
    this.descriptor.setDensity(density)
    return this
  }

  onCollisionStart(fn: (other: Collider) => void) {
    this._onCollisionStart = (other) => fn(other)
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

    this.descriptor.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
  }
}

export class BallCollider extends Collider {
  descriptor: RAPIER.ColliderDesc

  constructor(radius: number) {
    super()

    this.descriptor = RAPIER.ColliderDesc.ball(radius)
    this.descriptor.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
  }
}

export const Plugin =
  ({ gravity = [0, -9.81, 0] }: { gravity?: vec3 } = {}) =>
  (app: App) =>
    app
      .registerComponent(RigidBody)
      .registerComponent(Collider)
      .onLoad(async function () {
        await RAPIER.init()
      })
      .onStart((app) => {
        /* Create physics world */
        const physics = new RAPIER.World({
          x: gravity[0],
          y: gravity[1],
          z: gravity[2]
        })

        const rigidbodyQuery = app.query([Transform, RigidBody])

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
        const colliderQuery = app.query([RigidBody, Collider])

        /* Wire up colliders to their rigidbodies */
        const collidersToComponent = new Map<ColliderHandle, Collider>()
        colliderQuery.onEntityAdded.add((entity) => {
          const rigidbody = entity.get(RigidBody)!
          const collider = entity.get(Collider)!

          collider.raw = physics.createCollider(
            collider.descriptor,
            rigidbody.raw
          )

          collidersToComponent.set(collider.raw.handle, collider)
        })

        colliderQuery.onEntityRemoved.add((entity) => {
          const collider = entity.get(Collider)!
          collidersToComponent.delete(collider.raw!.handle)
        })

        const eventQueue = new RAPIER.EventQueue(true)

        app.onUpdate((dt: number) => {
          /* Simulate physics world */
          physics.timestep = clamp(dt, 0.01, 0.2)
          physics.step(eventQueue)

          /* Check collisions */
          eventQueue.drainCollisionEvents((handle1, handle2, started) => {
            const collider1 = collidersToComponent.get(handle1)
            const collider2 = collidersToComponent.get(handle2)

            if (collider1 && collider2) {
              if (started) {
                collider1._onCollisionStart?.(collider2)
              }
            }
          })

          /* Transfer physics transforms to the transform component */
          for (const [_, transform, rigidbody] of rigidbodyQuery) {
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
          }
        })
      })
