import { App, Transform3D } from "@bigby/core"
import { Vector3 } from "@bigby/math"

export class AutoRotate {
  constructor(public velocity = new Vector3()) {}
}

export const AutorotatePlugin = (app: App) =>
  app.registerComponent(AutoRotate).onStart((app) => {
    const query = app.query([Transform3D, AutoRotate])

    app.onUpdate((dt: number) => {
      for (const [_, transform, autorotate] of query) {
        // quat.rotateX(
        //   transform.quaternion,
        //   transform.quaternion,
        //   autorotate.velocity[0] * dt
        // )
        // quat.rotateY(
        //   transform.quaternion,
        //   transform.quaternion,
        //   autorotate.velocity[1] * dt
        // )
        // quat.rotateZ(
        //   transform.quaternion,
        //   transform.quaternion,
        //   autorotate.velocity[2] * dt
        // )
      }
    })
  })
