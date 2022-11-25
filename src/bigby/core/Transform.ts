import { mat4, quat, vec3 } from "gl-matrix"

export class Transform {
  autoUpdate = true

  readonly position = vec3.create()
  readonly scale = vec3.set(vec3.create(), 1, 1, 1)
  readonly quaternion = quat.create()

  readonly matrix = mat4.create()
}
