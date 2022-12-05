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
    this.set(x, y, z, w)
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

  set(x = 0, y = 0, z = 0, w = 1) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w

    return this
  }

  rotateX(rad: number) {
    const { x, y, z, w } = this

    rad *= 0.5

    const bx = Math.sin(rad)
    const bw = Math.cos(rad)

    this.x = x * bw + w * bx
    this.y = y * bw + z * bx
    this.z = z * bw - y * bx
    this.w = w * bw - x * bx

    return this
  }

  rotateY(rad: number) {
    const { x, y, z, w } = this

    rad *= 0.5

    const by = Math.sin(rad)
    const bw = Math.cos(rad)

    this.x = x * bw - z * by
    this.y = y * bw + w * by
    this.z = z * bw + x * by
    this.w = w * bw - y * by

    return this
  }

  rotateZ(rad: number) {
    const { x, y, z, w } = this

    rad *= 0.5

    const bz = Math.sin(rad)
    const bw = Math.cos(rad)

    this.x = x * bw + y * bz
    this.y = y * bw - x * bz
    this.z = z * bw + w * bz
    this.w = w * bw - z * bz

    return this
  }
}
