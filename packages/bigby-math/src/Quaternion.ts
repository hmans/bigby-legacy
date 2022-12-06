import { EPSILON } from "./constants"
import { IMatrix4 } from "./Matrix4"

export interface IQuaternion {
  x: number
  y: number
  z: number
  w: number
}

export class Quaternion implements IQuaternion {
  protected _x = 0
  protected _y = 0
  protected _z = 0
  protected _w = 0

  constructor(x = 0, y = 0, z = 0, w = 1) {
    this._x = x
    this._y = y
    this._z = z
    this._w = w
  }

  get x() {
    return this._x
  }

  get y() {
    return this._y
  }

  get z() {
    return this._z
  }

  get w() {
    return this._w
  }

  set x(v: number) {
    this._x = v
  }

  set y(v: number) {
    this._y = v
  }

  set z(v: number) {
    this._z = v
  }

  set w(v: number) {
    this._w = v
  }

  static set(target: IQuaternion, x = 0, y = 0, z = 0, w = 1) {
    target.x = x
    target.y = y
    target.z = z
    target.w = w

    return target
  }

  static rotateX(quat: IQuaternion, rad: number) {
    const { x, y, z, w } = quat

    rad *= 0.5

    const bx = Math.sin(rad)
    const bw = Math.cos(rad)

    quat.x = x * bw + w * bx
    quat.y = y * bw + z * bx
    quat.z = z * bw - y * bx
    quat.w = w * bw - x * bx

    return quat
  }

  static rotateY(quat: IQuaternion, rad: number) {
    const { x, y, z, w } = quat

    rad *= 0.5

    const by = Math.sin(rad)
    const bw = Math.cos(rad)

    quat.x = x * bw - z * by
    quat.y = y * bw + w * by
    quat.z = z * bw + x * by
    quat.w = w * bw - y * by

    return quat
  }

  static rotateZ(quat: IQuaternion, rad: number) {
    const { x, y, z, w } = quat

    rad *= 0.5

    const bz = Math.sin(rad)
    const bw = Math.cos(rad)

    quat.x = x * bw + y * bz
    quat.y = y * bw - x * bz
    quat.z = z * bw + w * bz
    quat.w = w * bw - z * bz

    return quat
  }

  static setFromRotationMatrix(out: IQuaternion, m: IMatrix4) {
    const te = m.elements,
      m11 = te[0],
      m12 = te[4],
      m13 = te[8],
      m21 = te[1],
      m22 = te[5],
      m23 = te[9],
      m31 = te[2],
      m32 = te[6],
      m33 = te[10],
      trace = m11 + m22 + m33

    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1.0)

      out.w = 0.25 / s
      out.x = (m32 - m23) * s
      out.y = (m13 - m31) * s
      out.z = (m21 - m12) * s
    } else if (m11 > m22 && m11 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33)

      out.w = (m32 - m23) / s
      out.x = 0.25 * s
      out.y = (m12 + m21) / s
      out.z = (m13 + m31) / s
    } else if (m22 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33)

      out.w = (m13 - m31) / s
      out.x = (m12 + m21) / s
      out.y = 0.25 * s
      out.z = (m23 + m32) / s
    } else {
      const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22)

      out.w = (m21 - m12) / s
      out.x = (m13 + m31) / s
      out.y = (m23 + m32) / s
      out.z = 0.25 * s
    }

    return this
  }

  static slerp(out: IQuaternion, a: IQuaternion, b: IQuaternion, t: number) {
    let ax = a.x,
      ay = a.y,
      az = a.z,
      aw = a.w

    let bx = b.x,
      by = b.y,
      bz = b.z,
      bw = b.w

    let omega, cosom, sinom, scale0, scale1

    cosom = ax * bx + ay * by + az * bz + aw * bw

    if (cosom < 0.0) {
      cosom = -cosom
      bx = -bx
      by = -by
      bz = -bz
      bw = -bw
    }

    if (1.0 - cosom > EPSILON) {
      omega = Math.acos(cosom)
      sinom = Math.sin(omega)
      scale0 = Math.sin((1.0 - t) * omega) / sinom
      scale1 = Math.sin(t * omega) / sinom
    } else {
      scale0 = 1.0 - t
      scale1 = t
    }

    out.x = scale0 * ax + scale1 * bx
    out.y = scale0 * ay + scale1 * by
    out.z = scale0 * az + scale1 * bz
    out.w = scale0 * aw + scale1 * bw

    return out
  }
}
