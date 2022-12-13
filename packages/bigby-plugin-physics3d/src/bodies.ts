import RAPIER, { RigidBodyDesc } from "@dimforge/rapier3d-compat"

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
