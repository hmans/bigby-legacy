import { App } from "./App"
import { Vector3, Quaternion, Matrix4 } from "three"

export class Transform3D {
  position: Vector3
  quaternion: Quaternion
  scale: Vector3
  matrix: Matrix4

  autoUpdate = true

  constructor(
    position: Vector3 | [number, number, number] = new Vector3(),
    quaternion:
      | Quaternion
      | [number, number, number, number] = new Quaternion(),
    scale: Vector3 | [number, number, number] = new Vector3(1, 1, 1),
    matrix = new Matrix4()
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
    this.matrix.compose(this.position, this.quaternion, this.scale)
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
