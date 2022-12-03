import { mat4, quat, vec3 } from "gl-matrix"
import { App } from "./App"

export class Transform {
  autoUpdate = true

  readonly matrix = mat4.create()

  constructor(
    public readonly position = vec3.create(),
    public readonly quaternion = quat.create(),
    public readonly scale = vec3.set(vec3.create(), 1, 1, 1)
  ) {}
}

export const TransformsPlugin = (app: App) =>
  app.registerComponent(Transform).onStart((app) => {
    const withTransform = app.query([Transform])

    app.onRender(() => {
      for (const [_, transform] of withTransform) {
        if (!transform.autoUpdate) return

        mat4.fromRotationTranslationScale(
          transform.matrix,
          transform.quaternion,
          transform.position,
          transform.scale
        )
      }
    })
  })
