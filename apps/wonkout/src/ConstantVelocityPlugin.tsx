import { RigidBody } from "@bigby/plugin-physics3d"
import { App, System } from "bigby"

export class ConstantVelocity {
  constructor(public velocity: number) {}
}

class ConstantVelocitySystem extends System {
  protected query = this.app.query([ConstantVelocity, RigidBody])

  onEarlyUpdate(dt: number): void {
    for (const [_, v, rigidbody] of this.query) {
      const rb = rigidbody.raw!
      const vel = rb.linvel()
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z)
      const ratio = speed !== 0 ? v.velocity / speed : 1

      if (ratio > 1)
        rb.setLinvel(
          { x: vel.x * ratio, y: vel.y * ratio, z: vel.z * ratio },
          true
        )
    }
  }
}

export const ConstantVelocityPlugin = (app: App) =>
  app
    .requireComponent(RigidBody)
    .registerComponent(ConstantVelocity)
    .onStart((app) => {
      app.spawn([new ConstantVelocitySystem(app)])
    })
