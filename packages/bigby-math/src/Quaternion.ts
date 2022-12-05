export class Quaternion {
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
}
