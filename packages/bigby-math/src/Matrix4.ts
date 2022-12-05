import { IQuaternion } from "./Quaternion"
import { IVector3 } from "./Vector3"

export const EPSILON = 0.000001

export interface IMatrix4 {
  elements: Float32Array | number[]
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

  static identity(out: IMatrix4) {
    out.elements[0] = 1
    out.elements[1] = 0
    out.elements[2] = 0
    out.elements[3] = 0
    out.elements[4] = 0
    out.elements[5] = 1
    out.elements[6] = 0
    out.elements[7] = 0
    out.elements[8] = 0
    out.elements[9] = 0
    out.elements[10] = 1
    out.elements[11] = 0
    out.elements[12] = 0
    out.elements[13] = 0
    out.elements[14] = 0
    out.elements[15] = 1

    return out
  }

  static lookAt(out: IMatrix4, eye: IVector3, center: IVector3, up: IVector3) {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len

    let eyex = eye.x
    let eyey = eye.y
    let eyez = eye.z

    let upx = up.x
    let upy = up.y
    let upz = up.z

    let centerx = center.x
    let centery = center.y
    let centerz = center.z

    if (
      Math.abs(eyex - centerx) < EPSILON &&
      Math.abs(eyey - centery) < EPSILON &&
      Math.abs(eyez - centerz) < EPSILON
    ) {
      return Matrix4.identity(out)
    }

    z0 = eyex - centerx
    z1 = eyey - centery
    z2 = eyez - centerz

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2)
    z0 *= len
    z1 *= len
    z2 *= len

    x0 = upy * z2 - upz * z1
    x1 = upz * z0 - upx * z2
    x2 = upx * z1 - upy * z0
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2)
    if (!len) {
      x0 = 0
      x1 = 0
      x2 = 0
    } else {
      len = 1 / len
      x0 *= len
      x1 *= len
      x2 *= len
    }

    y0 = z1 * x2 - z2 * x1
    y1 = z2 * x0 - z0 * x2
    y2 = z0 * x1 - z1 * x0

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2)
    if (!len) {
      y0 = 0
      y1 = 0
      y2 = 0
    } else {
      len = 1 / len
      y0 *= len
      y1 *= len
      y2 *= len
    }

    out.elements[0] = x0
    out.elements[1] = y0
    out.elements[2] = z0
    out.elements[3] = 0
    out.elements[4] = x1
    out.elements[5] = y1
    out.elements[6] = z1
    out.elements[7] = 0
    out.elements[8] = x2
    out.elements[9] = y2
    out.elements[10] = z2
    out.elements[11] = 0
    out.elements[12] = -(x0 * eyex + x1 * eyey + x2 * eyez)
    out.elements[13] = -(y0 * eyex + y1 * eyey + y2 * eyez)
    out.elements[14] = -(z0 * eyex + z1 * eyey + z2 * eyez)
    out.elements[15] = 1

    return out
  }

  static copy(out: IMatrix4, source: IMatrix4) {
    out.elements[0] = source.elements[0]
    out.elements[1] = source.elements[1]
    out.elements[2] = source.elements[2]
    out.elements[3] = source.elements[3]
    out.elements[4] = source.elements[4]
    out.elements[5] = source.elements[5]
    out.elements[6] = source.elements[6]
    out.elements[7] = source.elements[7]
    out.elements[8] = source.elements[8]
    out.elements[9] = source.elements[9]
    out.elements[10] = source.elements[10]
    out.elements[11] = source.elements[11]
    out.elements[12] = source.elements[12]
    out.elements[13] = source.elements[13]
    out.elements[14] = source.elements[14]
    out.elements[15] = source.elements[15]

    return out
  }

  static targetTo(
    out: IMatrix4,
    eye: IVector3,
    target: IVector3,
    up: IVector3
  ) {
    let eyex = eye.x,
      eyey = eye.y,
      eyez = eye.z,
      upx = up.x,
      upy = up.y,
      upz = up.z

    let z0 = eyex - target.x,
      z1 = eyey - target.y,
      z2 = eyez - target.z

    let len = z0 * z0 + z1 * z1 + z2 * z2
    if (len > 0) {
      len = 1 / Math.sqrt(len)
      z0 *= len
      z1 *= len
      z2 *= len
    }

    let x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0

    len = x0 * x0 + x1 * x1 + x2 * x2
    if (len > 0) {
      len = 1 / Math.sqrt(len)
      x0 *= len
      x1 *= len
      x2 *= len
    }

    out.elements[0] = x0
    out.elements[1] = x1
    out.elements[2] = x2
    out.elements[3] = 0
    out.elements[4] = z1 * x2 - z2 * x1
    out.elements[5] = z2 * x0 - z0 * x2
    out.elements[6] = z0 * x1 - z1 * x0
    out.elements[7] = 0
    out.elements[8] = z0
    out.elements[9] = z1
    out.elements[10] = z2
    out.elements[11] = 0
    out.elements[12] = eyex
    out.elements[13] = eyey
    out.elements[14] = eyez
    out.elements[15] = 1

    return out
  }
}
