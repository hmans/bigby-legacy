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

  constructor() {}

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
}
