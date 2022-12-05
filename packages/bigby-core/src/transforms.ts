import {
  IMatrix4,
  IQuaternion,
  IVector3,
  Matrix4,
  Quaternion,
  Vector3
} from "@bigby/math"
import { App } from "./App"

export interface ITransform3D {
  position: IVector3
  quaternion: IQuaternion
  scale: IVector3
  matrix: IMatrix4
}

export class Transform3D implements ITransform3D {
  autoUpdate = true

  readonly matrix = new Matrix4()

  constructor(
    public position: IVector3 = new Vector3(),
    public quaternion: IQuaternion = new Quaternion(),
    public scale: IVector3 = new Vector3(1, 1, 1)
  ) {}
}

export const TransformsPlugin = (app: App) =>
  app.registerComponent(Transform3D).onStart((app) => {
    const withTransform = app.query([Transform3D])

    app.onRender(() => {
      for (const [_, transform] of withTransform) {
        if (!transform.autoUpdate) return

        Matrix4.compose(
          transform.matrix,
          transform.position,
          transform.quaternion,
          transform.scale
        )
      }
    })
  })
