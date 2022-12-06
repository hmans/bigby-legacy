import { App } from "@bigby/core"
import { Object3D, Vector3 } from "three"

export class AutoRotate {
  constructor(public velocity = new Vector3()) {}
}

export const AutorotatePlugin = (app: App) =>
  app.registerComponent(AutoRotate).onStart((app) => {
    const query = app.query([Object3D, AutoRotate])

    app.onUpdate((dt: number) => {
      for (const [_, transform, autorotate] of query) {
        transform.rotation.x += autorotate.velocity.x * dt
        transform.rotation.y += autorotate.velocity.y * dt
        transform.rotation.z += autorotate.velocity.z * dt
      }
    })
  })
