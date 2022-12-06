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

  static angle(a: IVector3, b: IVector3) {
    const denominator = Math.sqrt(
      Vector3.magnitudeSquared(a) * Vector3.magnitudeSquared(b)
    )

    if (denominator > 0) {
      return Math.acos(Vector3.dot(a, b) / denominator)
    } else {
      return 0
    }
  }

  static magnitude(v: IVector3) {
    return Math.sqrt(Vector3.magnitudeSquared(v))
  }

  static magnitudeSquared(v: IVector3) {
    return v.x * v.x + v.y * v.y + v.z * v.z
  }

  static normalize(out: IVector3, v: IVector3) {
    const magnitude = Vector3.magnitude(v)

    if (magnitude > 0) {
      out.x = v.x / magnitude
      out.y = v.y / magnitude
      out.z = v.z / magnitude
    } else {
      out.x = 0
      out.y = 0
      out.z = 0
    }

    return out
  }

  static set(out: IVector3, x = 0, y = 0, z = 0) {
    out.x = x
    out.y = y
    out.z = z
    return out
  }

  static copy(out: IVector3, s: IVector3) {
    out.x = s.x
    out.y = s.y
    out.z = s.z
    return out
  }

  static add(out: IVector3, v: IVector3) {
    out.x += v.x
    out.y += v.y
    out.z += v.z
    return out
  }

  static addScalar(out: IVector3, v: number) {
    out.x += v
    out.y += v
    out.z += v
    return out
  }

  static subtract(out: IVector3, v: IVector3) {
    out.x -= v.x
    out.y -= v.y
    out.z -= v.z
    return out
  }

  static subtractScalar(out: IVector3, v: number) {
    out.x -= v
    out.y -= v
    out.z -= v
    return out
  }

  static multiply(out: IVector3, v: IVector3) {
    out.x *= v.x
    out.y *= v.y
    out.z *= v.z
    return out
  }

  static multiplyScalar(out: IVector3, v: number) {
    out.x *= v
    out.y *= v
    out.z *= v
    return out
  }

  static divide(out: IVector3, v: IVector3) {
    out.x /= v.x
    out.y /= v.y
    out.z /= v.z
    return out
  }

  static divideScalar(out: IVector3, scalar: number) {
    out.x /= scalar
    out.y /= scalar
    out.z /= scalar
    return out
  }

  static cross(out: IVector3, a: IVector3, b: IVector3) {
    const ax = a.x
    const ay = a.y
    const az = a.z

    const bx = b.x
    const by = b.y
    const bz = b.z

    out.x = ay * bz - az * by
    out.y = az * bx - ax * bz
    out.z = ax * by - ay * bx

    return out
  }

  static dot(a: IVector3, b: IVector3) {
    return a.x * b.x + a.y * b.y + a.z * b.z
  }

  static distance(a: IVector3, b: IVector3) {
    return Math.sqrt(Vector3.distanceSquared(a, b))
  }

  static distanceSquared(a: IVector3, b: IVector3) {
    const x = a.x - b.x
    const y = a.y - b.y
    const z = a.z - b.z

    return x * x + y * y + z * z
  }

  static lerp(out: IVector3, a: IVector3, b: IVector3, alpha: number) {
    out.x = a.x + (b.x - a.x) * alpha
    out.y = a.y + (b.y - a.y) * alpha
    out.z = a.z + (b.z - a.z) * alpha

    return out
  }

  static equals(a: IVector3, b: IVector3) {
    return a.x === b.x && a.y === b.y && a.z === b.z
  }
}
