import { RigidBody } from "@bigby/plugin-physics3d"
import { App } from "bigby"

export class ConstantVelocity {
  constructor(public velocity: number) {}
}

export const ConstantVelocityPlugin = (app: App) =>
  app
    .registerComponent(ConstantVelocity)

    .onStart((app) => {
      const query = app.query([ConstantVelocity, RigidBody])

      app.onUpdate(() => {
        for (const [_, v, rigidbody] of query) {
          const rb = rigidbody.raw!
          const vel = rb.linvel()
          const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z)
          const ratio = v.velocity / speed

          rb.setLinvel(
            { x: vel.x * ratio, y: vel.y * ratio, z: vel.z * ratio },
            true
          )
        }
      })
    })
