import { App, Transform } from "@bigby/core"
import { quat, vec3 } from "gl-matrix"

export class AutoRotate {
  constructor(public velocity = vec3.create()) {}
}

export const AutorotatePlugin = (app: App) =>
  app.registerComponent(AutoRotate).addStartupSystem((app) => {
    const query = app.query([Transform, AutoRotate])

    app.addSystem((dt: number) => {
      for (const [_, transform, autorotate] of query) {
        quat.rotateX(
          transform.quaternion,
          transform.quaternion,
          autorotate.velocity[0] * dt
        )
        quat.rotateY(
          transform.quaternion,
          transform.quaternion,
          autorotate.velocity[1] * dt
        )
        quat.rotateZ(
          transform.quaternion,
          transform.quaternion,
          autorotate.velocity[2] * dt
        )
      }
    })
  })
