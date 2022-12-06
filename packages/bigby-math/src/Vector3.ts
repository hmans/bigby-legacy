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
    this._x = x
    this._y = y
    this._z = z
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

  static magnitude(v: IVector3) {
    return Math.sqrt(Vector3.magnitudeSquared(v))
  }

  static magnitudeSquared(v: IVector3) {
    return v.x * v.x + v.y * v.y + v.z * v.z
  }

  static normalize(target: IVector3, v: IVector3 = target) {
    const magnitude = Vector3.magnitude(v)

    if (magnitude > 0) {
      target.x = v.x / magnitude
      target.y = v.y / magnitude
      target.z = v.z / magnitude
    } else {
      target.x = 0
      target.y = 0
      target.z = 0
    }

    return target
  }

  static set(target: IVector3, x = 0, y = 0, z = 0) {
    target.x = x
    target.y = y
    target.z = z
    return target
  }

  static copy(target: IVector3, s: IVector3) {
    target.x = s.x
    target.y = s.y
    target.z = s.z
    return target
  }

  static add(target: IVector3, v: IVector3) {
    target.x += v.x
    target.y += v.y
    target.z += v.z
    return target
  }

  static addScalar(target: IVector3, v: number) {
    target.x += v
    target.y += v
    target.z += v
    return target
  }

  static subtract(target: IVector3, v: IVector3) {
    target.x -= v.x
    target.y -= v.y
    target.z -= v.z
    return target
  }

  static subtractScalar(target: IVector3, v: number) {
    target.x -= v
    target.y -= v
    target.z -= v
    return target
  }

  static multiply(target: IVector3, v: IVector3) {
    target.x *= v.x
    target.y *= v.y
    target.z *= v.z
    return target
  }

  static multiplyScalar(target: IVector3, v: number) {
    target.x *= v
    target.y *= v
    target.z *= v
    return target
  }

  static divide(target: IVector3, v: IVector3) {
    target.x /= v.x
    target.y /= v.y
    target.z /= v.z
    return target
  }

  static divideScalar(target: IVector3, scalar: number) {
    target.x /= scalar
    target.y /= scalar
    target.z /= scalar
    return target
  }

  static cross(target: IVector3, v: IVector3) {
    const { x, y, z } = target

    target.x = y * v.z - z * v.y
    target.y = z * v.x - x * v.z
    target.z = x * v.y - y * v.x

    return target
  }

  static dot(a: IVector3, b: IVector3) {
    return a.x * b.x + a.y * b.y + a.z * b.z
  }

  static distance(target: IVector3, v: IVector3) {
    return Math.sqrt(Vector3.distanceSquared(target, v))
  }

  static distanceSquared(target: IVector3, v: IVector3) {
    const x = target.x - v.x
    const y = target.y - v.y
    const z = target.z - v.z

    return x * x + y * y + z * z
  }

  static lerp(target: IVector3, a: IVector3, b: IVector3, alpha: number) {
    target.x = a.x + (b.x - a.x) * alpha
    target.y = a.y + (b.y - a.y) * alpha
    target.z = a.z + (b.z - a.z) * alpha

    return target
  }

  static equals(target: IVector3, v: IVector3) {
    return target.x === v.x && target.y === v.y && target.z === v.z
  }
}
