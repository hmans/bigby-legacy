import { App } from "./App"
import { Vector3, Quaternion, Matrix4, Euler } from "three"

export class Transform3D {
  position: Vector3
  quaternion: Quaternion
  rotation: Euler
  scale: Vector3

  constructor(
    position: Vector3 | [number, number, number] = new Vector3(),
    rotation: Euler | [number, number, number] = new Euler(),
    scale: Vector3 | [number, number, number] = new Vector3(1, 1, 1),
    quaternion = new Quaternion()
  ) {
    this.position = Array.isArray(position)
      ? new Vector3(...position)
      : position

    this.rotation = Array.isArray(rotation) ? new Euler(...rotation) : rotation

    this.scale = Array.isArray(scale) ? new Vector3(...scale) : scale

    this.quaternion = quaternion
  }
}

export const TransformsPlugin = (app: App) => app.registerComponent(Transform3D)
