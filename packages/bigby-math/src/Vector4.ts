export interface IVector4 {
  x: number
  y: number
  z: number
  w: number
}

export class Vector4 implements IVector4 {
  protected _x = 0
  protected _y = 0
  protected _z = 0
  protected _w = 0

  constructor(x = 0, y = 0, z = 0, w = 0) {
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

  set(x = 0, y = 0, z = 0, w = 0) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
    return this
  }

  copy(v: IVector4) {
    this.x = v.x
    this.y = v.y
    this.z = v.z
    this.w = v.w
    return this
  }

  add(v: IVector4) {
    this.x += v.x
    this.y += v.y
    this.z += v.z
    this.w += v.w
    return this
  }

  addScalar(v: number) {
    this.x += v
    this.y += v
    this.z += v
    this.w += v
    return this
  }

  subtract(v: IVector4) {
    this.x -= v.x
    this.y -= v.y
    this.z -= v.z
    this.w -= v.w
    return this
  }

  subtractScalar(v: number) {
    this.x -= v
    this.y -= v
    this.z -= v
    this.w -= v
    return this
  }

  multiply(v: IVector4) {
    this.x *= v.x
    this.y *= v.y
    this.z *= v.z
    this.w *= v.w
    return this
  }

  multiplyScalar(v: number) {
    this.x *= v
    this.y *= v
    this.z *= v
    this.w *= v
    return this
  }

  divide(v: IVector4) {
    this.x /= v.x
    this.y /= v.y
    this.z /= v.z
    this.w /= v.w
    return this
  }

  divideScalar(v: number) {
    this.x /= v
    this.y /= v
    this.z /= v
    this.w /= v
    return this
  }
}
