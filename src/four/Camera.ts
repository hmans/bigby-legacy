import { mat4 } from "gl-matrix"
import { Object3D } from "./Object3D"

export class Camera extends Object3D {
  public fov: number
  public aspect: number
  public near: number
  public far: number
  readonly projectionMatrix = mat4.create()
  readonly viewMatrix = mat4.create()

  constructor(fov = 45, aspect = 1, near = 0.1, far = 1000) {
    super()

    this.fov = fov
    this.aspect = aspect
    this.near = near
    this.far = far
  }

  updateMatrix(): void {
    super.updateMatrix()
    if (this.matrixAutoUpdate)
      mat4.perspectiveNO(
        this.projectionMatrix,
        this.fov * (Math.PI / 180),
        this.aspect,
        this.near,
        this.far
      )
    mat4.copy(this.viewMatrix, this.matrix)
    mat4.invert(this.viewMatrix, this.viewMatrix)
  }
}
