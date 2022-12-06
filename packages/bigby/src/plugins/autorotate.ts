import { App, Transform3D } from "@bigby/core"
import { Quaternion, Vector3 } from "@bigby/math"

export class AutoRotate {
  constructor(public velocity = new Vector3()) {}
}

export const AutorotatePlugin = (app: App) =>
  app.registerComponent(AutoRotate).onStart((app) => {
    const query = app.query([Transform3D, AutoRotate])

    app.onUpdate((dt: number) => {
      for (const [_, transform, autorotate] of query) {
        Quaternion.rotateX(
          transform.quaternion,
          transform.quaternion,
          autorotate.velocity.x * dt
        )

        Quaternion.rotateY(
          transform.quaternion,
          transform.quaternion,
          autorotate.velocity.y * dt
        )

        Quaternion.rotateZ(
          transform.quaternion,
          transform.quaternion,
          autorotate.velocity.z * dt
        )
      }
    })
  })
