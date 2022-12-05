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
  position: IVector3
  quaternion: IQuaternion
  scale: IVector3
  matrix: IMatrix4

  autoUpdate = true

  constructor(
    position: IVector3 | [number, number, number] = new Vector3(),
    quaternion:
      | IQuaternion
      | [number, number, number, number] = new Quaternion(),
    scale: IVector3 | [number, number, number] = new Vector3(1, 1, 1),
    matrix: IMatrix4 = new Matrix4()
  ) {
    this.position = Array.isArray(position)
      ? new Vector3(...position)
      : position

    this.quaternion = Array.isArray(quaternion)
      ? new Quaternion(...quaternion)
      : quaternion

    this.scale = Array.isArray(scale) ? new Vector3(...scale) : scale

    this.matrix = matrix

    this.updateMatrix()
  }

  updateMatrix() {
    Matrix4.compose(this.matrix, this.position, this.quaternion, this.scale)
  }
}

export const TransformsPlugin = (app: App) =>
  app.registerComponent(Transform3D).onStart((app) => {
    const withTransform = app.query([Transform3D])

    app.onRender(() => {
      for (const [_, transform] of withTransform) {
        if (!transform.autoUpdate) return
        transform.updateMatrix()
      }
    })
  })
