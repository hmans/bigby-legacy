export interface IVector2 {
  x: number
  y: number
}

export class Vector2 implements IVector2 {
  protected _x = 0
  protected _y = 0

  constructor(x = 0, y = 0) {
    this.set(x, y)
  }

  get x() {
    return this._x
  }

  get y() {
    return this._y
  }

  set x(value: number) {
    this._x = value
  }

  set y(value: number) {
    this._y = value
  }

  set(x = 0, y = 0) {
    this.x = x
    this.y = y
    return this
  }

  copy(vec2: IVector2) {
    this.x = vec2.x
    this.y = vec2.y
    return this
  }

  add(vec2: IVector2) {
    this.x += vec2.x
    this.y += vec2.y
    return this
  }

  addScalar(scalar: number) {
    this.x += scalar
    this.y += scalar
    return this
  }

  subtract(vec2: IVector2) {
    this.x -= vec2.x
    this.y -= vec2.y
    return this
  }

  subtractScalar(scalar: number) {
    this.x -= scalar
    this.y -= scalar
    return this
  }

  multiply(vec2: IVector2) {
    this.x *= vec2.x
    this.y *= vec2.y
    return this
  }

  multiplyScalar(scalar: number) {
    this.x *= scalar
    this.y *= scalar
    return this
  }

  divide(vec2: IVector2) {
    this.x /= vec2.x
    this.y /= vec2.y
    return this
  }

  divideScalar(scalar: number) {
    this.x /= scalar
    this.y /= scalar
    return this
  }
}
