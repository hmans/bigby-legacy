import { vec3 } from "gl-matrix"

export interface IVector3 {
  x: number
  y: number
  z: number
}

export class Vector3 implements IVector3 {
  constructor(public raw = vec3.create()) {}

  get x() {
    return this.raw[0]
  }

  get y() {
    return this.raw[1]
  }

  get z() {
    return this.raw[2]
  }

  set x(value: number) {
    this.raw[0] = value
  }

  set y(value: number) {
    this.raw[1] = value
  }

  set z(value: number) {
    this.raw[2] = value
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
}
