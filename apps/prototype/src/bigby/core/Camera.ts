import { mat4, vec3 } from "gl-matrix"

export class Camera {
  readonly target = vec3.create()
  readonly projectionMatrix = mat4.create()
  readonly viewMatrix = mat4.create()

  constructor(public fov = 75, public near = 0.1, public far = 1000) {}

  updateProjectionMatrix(gl: WebGL2RenderingContext) {
    mat4.perspectiveNO(
      this.projectionMatrix,
      this.fov * (Math.PI / 180),
      gl.canvas.width / gl.canvas.height,
      this.near,
      this.far
    )
  }
}
