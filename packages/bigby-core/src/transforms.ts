import { IMatrix4, IVector3, Matrix4, Quaternion, Vector3 } from "@bigby/math"
import { App } from "./App"

export interface ITransform3D {
  position: IVector3
  quaternion: Quaternion
  scale: IVector3
  matrix: IMatrix4
}

export class Transform3D implements ITransform3D {
  autoUpdate = true

  readonly matrix = new Matrix4()

  constructor(
    public readonly position = new Vector3(),
    public readonly quaternion = new Quaternion(),
    public readonly scale = new Vector3(1, 1, 1)
  ) {}
}

export const TransformsPlugin = (app: App) =>
  app.registerComponent(Transform3D).onStart((app) => {
    const withTransform = app.query([Transform3D])

    app.onRender(() => {
      for (const [_, transform] of withTransform) {
        if (!transform.autoUpdate) return

        transform.matrix.compose(
          transform.position,
          transform.quaternion,
          transform.scale
        )
      }
    })
  })
