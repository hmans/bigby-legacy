import { IQuaternion } from "./Quaternion"
import { IVector3 } from "./Vector3"

export interface IMatrix4 {
  elements: Float32Array
}

export class Matrix4 implements IMatrix4 {
  constructor(
    public elements: Float32Array = new Float32Array([
      1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
    ])
  ) {}

  static compose(
    mat4: IMatrix4,
    position: IVector3,
    quaternion: IQuaternion,
    scale: IVector3
  ) {
    const { x, y, z, w } = quaternion
    const { x: sx, y: sy, z: sz } = scale
    const { x: px, y: py, z: pz } = position

    const x2 = x + x
    const y2 = y + y
    const z2 = z + z

    const xx = x * x2
    const xy = x * y2
    const xz = x * z2

    const yy = y * y2
    const yz = y * z2
    const zz = z * z2

    const wx = w * x2
    const wy = w * y2
    const wz = w * z2

    mat4.elements[0] = (1 - (yy + zz)) * sx
    mat4.elements[1] = (xy + wz) * sx
    mat4.elements[2] = (xz - wy) * sx
    mat4.elements[3] = 0

    mat4.elements[4] = (xy - wz) * sy
    mat4.elements[5] = (1 - (xx + zz)) * sy
    mat4.elements[6] = (yz + wx) * sy
    mat4.elements[7] = 0

    mat4.elements[8] = (xz + wy) * sz
    mat4.elements[9] = (yz - wx) * sz
    mat4.elements[10] = (1 - (xx + yy)) * sz
    mat4.elements[11] = 0

    mat4.elements[12] = px
    mat4.elements[13] = py
    mat4.elements[14] = pz
    mat4.elements[15] = 1

    return mat4
  }
}
