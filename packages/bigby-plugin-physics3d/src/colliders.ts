import { Entity } from "@bigby/core"
import RAPIER from "@dimforge/rapier3d-compat"

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
