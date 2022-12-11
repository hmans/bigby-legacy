import { App, Entity, Object3D, System } from "@bigby/core"
import { clamp } from "@bigby/math"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { ColliderHandle, RigidBodyDesc } from "@dimforge/rapier3d-compat"

export abstract class RigidBody {
  desc: RigidBodyDesc = undefined!
  raw?: RAPIER.RigidBody

  protected abstract initialize(): void

  constructor(fun?: (desc: RigidBodyDesc) => void) {
    this.initialize()
    fun?.(this.desc)
    return this
  }
}

export class DynamicBody extends RigidBody {
  protected initialize(): void {
    this.desc = RAPIER.RigidBodyDesc.dynamic()
  }
}

export class StaticBody extends RigidBody {
  protected initialize(): void {
    this.desc = RAPIER.RigidBodyDesc.fixed()
  }
}

export abstract class Collider {
  raw?: RAPIER.Collider
  abstract descriptor: RAPIER.ColliderDesc

  _onCollisionStart?: (other: Entity) => void
  _onCollisionEnd?: (other: Entity) => void

  setDensity(density: number) {
    this.descriptor.setDensity(density)
    return this
  }

  onCollisionStart(fn: (other: Entity) => void) {
    this._onCollisionStart = (other) => fn(other)
    return this
  }

  onCollisionEnd(fn: (other: Entity) => void) {
    this._onCollisionEnd = (other) => fn(other)
    return this
  }
}

export class BoxCollider extends Collider {
  descriptor: RAPIER.ColliderDesc

  constructor(size: [number, number, number] = [1, 1, 1]) {
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
  ({ gravity = [0, -9.81, 0] }: { gravity?: [number, number, number] } = {}) =>
  (app: App) =>
    app
      /* Make sure this component is known to the app. We'll need it! */
      .requireComponent(Object3D)

      /* Let the app know which components we will be adding. */
      .registerComponent(RigidBody)
      .registerComponent(Collider)

      /* Initialize Rapier (the physics engine) */
      .onLoad(RAPIER.init)

      /* Let's go! */
      .onStart((app) => {
        const world = new RAPIER.World({
          x: gravity[0],
          y: gravity[1],
          z: gravity[2]
        })

        /* ... */

        const rigidbodyQuery = app.query([Object3D, RigidBody])

        /* Create new RAPIER rigidbodies when entities appear */
        rigidbodyQuery.onEntityAdded.add((entity) => {
          let desc = entity.get(RigidBody)!.desc

          const transform = entity.get(Object3D)!
          const rigidbody = entity.get(RigidBody)!

          desc.setTranslation(
            transform.position.x,
            transform.position.y,
            transform.position.z
          )

          desc.setRotation({
            x: transform.quaternion.x,
            y: transform.quaternion.y,
            z: transform.quaternion.z,
            w: transform.quaternion.w
          })

          rigidbody.raw = world.createRigidBody(desc)
        })

        /* Remove rigidbodies from the world */
        rigidbodyQuery.onEntityRemoved.add((entity) => {
          const rigidbody = entity.get(RigidBody)!
          world.removeRigidBody(rigidbody.raw!)
        })

        /* Create new RAPIER colliders when entities appear */
        const colliderQuery = app.query([RigidBody, Collider])

        /* Wire up colliders to their rigidbodies */
        const collidersToComponent = new Map<ColliderHandle, Collider>()
        const collidersToEntity = new Map<ColliderHandle, Entity>()

        colliderQuery.onEntityAdded.add((entity) => {
          const rigidbody = entity.get(RigidBody)!
          const collider = entity.get(Collider)!

          collider.raw = world.createCollider(
            collider.descriptor,
            rigidbody.raw
          )

          collidersToComponent.set(collider.raw.handle, collider)
          collidersToEntity.set(collider.raw.handle, entity)
        })

        colliderQuery.onEntityRemoved.add((entity) => {
          const collider = entity.get(Collider)!

          collidersToComponent.delete(collider.raw!.handle)
          collidersToEntity.delete(collider.raw!.handle)
        })

        const eventQueue = new RAPIER.EventQueue(true)

        class PhysicsSystem extends System {
          onFixedUpdate(dt: number): void {
            /* Simulate physics world */
            world.timestep = clamp(dt, 0.01, 0.2)
            world.step(eventQueue)

            /* Check collisions */
            eventQueue.drainCollisionEvents((handle1, handle2, started) => {
              const collider1 = collidersToComponent.get(handle1)
              const collider2 = collidersToComponent.get(handle2)
              const entity1 = collidersToEntity.get(handle1)!
              const entity2 = collidersToEntity.get(handle2)!

              if (collider1 && collider2) {
                if (started) {
                  collider1._onCollisionStart?.(entity2)
                  collider2._onCollisionStart?.(entity1)
                } else {
                  collider1._onCollisionEnd?.(entity2)
                  collider2._onCollisionEnd?.(entity1)
                }
              }
            })

            /* Transfer physics transforms to the transform component */
            for (const [_, transform, rigidbody] of rigidbodyQuery) {
              const position = rigidbody.raw!.translation()

              transform.position.set(position.x, position.y, position.z)

              const rotation = rigidbody.raw!.rotation()
              transform.quaternion.set(
                rotation.x,
                rotation.y,
                rotation.z,
                rotation.w
              )

              /* Reset forces */
              rigidbody.raw!.resetForces(true)
            }
          }
        }

        app.spawn([new PhysicsSystem(app)])
      })
