export interface IVector3 {
  x: number
  y: number
  z: number
}

export class Vector3 implements IVector3 {
  protected _x = 0
  protected _y = 0
  protected _z = 0

  constructor(x = 0, y = 0, z = 0) {
    this.set(x, y, z)
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

  set x(value: number) {
    this._x = value
  }

  set y(value: number) {
    this._y = value
  }

  set z(value: number) {
    this._z = value
  }

  set(x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
    return this
  }

  copy(v: Vector3) {
    this.x = v.x
    this.y = v.y
    this.z = v.z
    return this
  }

  add(v: Vector3) {
    this.x += v.x
    this.y += v.y
    this.z += v.z
    return this
  }

  addScalar(v: number) {
    this.x += v
    this.y += v
    this.z += v
    return this
  }

  subtract(v: Vector3) {
    this.x -= v.x
    this.y -= v.y
    this.z -= v.z
    return this
  }

  subtractScalar(v: number) {
    this.x -= v
    this.y -= v
    this.z -= v
    return this
  }

  multiply(v: Vector3) {
    this.x *= v.x
    this.y *= v.y
    this.z *= v.z
    return this
  }

  multiplyScalar(v: number) {
    this.x *= v
    this.y *= v
    this.z *= v
    return this
  }

  divide(v: Vector3) {
    this.x /= v.x
    this.y /= v.y
    this.z /= v.z
    return this
  }

  divideScalar(scalar: number) {
    this.x /= scalar
    this.y /= scalar
    this.z /= scalar
    return this
  }
}
