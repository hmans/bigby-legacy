import { IQuaternion } from "./Quaternion"
import { IVector3 } from "./Vector3"

export interface IMatrix4 {
  m00: number
  m01: number
  m02: number
  m03: number

  m10: number
  m11: number
  m12: number
  m13: number

  m20: number
  m21: number
  m22: number
  m23: number

  m30: number
  m31: number
  m32: number
  m33: number
}

export class Matrix4 implements IMatrix4 {
  protected _m00 = 0
  protected _m01 = 0
  protected _m02 = 0
  protected _m03 = 0
  protected _m10 = 0
  protected _m11 = 0
  protected _m12 = 0
  protected _m13 = 0
  protected _m20 = 0
  protected _m21 = 0
  protected _m22 = 0
  protected _m23 = 0
  protected _m30 = 0
  protected _m31 = 0
  protected _m32 = 0
  protected _m33 = 0

  constructor(
    m00 = 0,
    m01 = 0,
    m02 = 0,
    m03 = 0,
    m10 = 0,
    m11 = 0,
    m12 = 0,
    m13 = 0,
    m20 = 0,
    m21 = 0,
    m22 = 0,
    m23 = 0,
    m30 = 0,
    m31 = 0,
    m32 = 0,
    m33 = 0
  ) {
    this.set(
      m00,
      m01,
      m02,
      m03,
      m10,
      m11,
      m12,
      m13,
      m20,
      m21,
      m22,
      m23,
      m30,
      m31,
      m32,
      m33
    )
  }

  get m00() {
    return this._m00
  }

  get m01() {
    return this._m01
  }

  get m02() {
    return this._m02
  }

  get m03() {
    return this._m03
  }

  get m10() {
    return this._m10
  }

  get m11() {
    return this._m11
  }

  get m12() {
    return this._m12
  }

  get m13() {
    return this._m13
  }

  get m20() {
    return this._m20
  }

  get m21() {
    return this._m21
  }

  get m22() {
    return this._m22
  }

  get m23() {
    return this._m23
  }

  get m30() {
    return this._m30
  }

  get m31() {
    return this._m31
  }

  get m32() {
    return this._m32
  }

  get m33() {
    return this._m33
  }

  set m00(v: number) {
    this._m00 = v
  }

  set m01(v: number) {
    this._m01 = v
  }

  set m02(v: number) {
    this._m02 = v
  }

  set m03(v: number) {
    this._m03 = v
  }

  set m10(v: number) {
    this._m10 = v
  }

  set m11(v: number) {
    this._m11 = v
  }

  set m12(v: number) {
    this._m12 = v
  }

  set m13(v: number) {
    this._m13 = v
  }

  set m20(v: number) {
    this._m20 = v
  }

  set m21(v: number) {
    this._m21 = v
  }

  set m22(v: number) {
    this._m22 = v
  }

  set m23(v: number) {
    this._m23 = v
  }

  set m30(v: number) {
    this._m30 = v
  }

  set m31(v: number) {
    this._m31 = v
  }

  set m32(v: number) {
    this._m32 = v
  }

  set m33(v: number) {
    this._m33 = v
  }

  set(
    m00 = 0,
    m01 = 0,
    m02 = 0,
    m03 = 0,
    m10 = 0,
    m11 = 0,
    m12 = 0,
    m13 = 0,
    m20 = 0,
    m21 = 0,
    m22 = 0,
    m23 = 0,
    m30 = 0,
    m31 = 0,
    m32 = 0,
    m33 = 0
  ) {
    this.m00 = m00
    this.m01 = m01
    this.m02 = m02
    this.m03 = m03
    this.m10 = m10
    this.m11 = m11
    this.m12 = m12
    this.m13 = m13
    this.m20 = m20
    this.m21 = m21
    this.m22 = m22
    this.m23 = m23
    this.m30 = m30
    this.m31 = m31
    this.m32 = m32
    this.m33 = m33
    return this
  }

  compose(position: IVector3, quaternion: IQuaternion, scale: IVector3) {
    const { x, y, z, w } = quaternion

    const x2 = x + x,
      y2 = y + y,
      z2 = z + z

    const xx = x * x2,
      xy = x * y2,
      xz = x * z2

    const yy = y * y2,
      yz = y * z2,
      zz = z * z2

    const wx = w * x2,
      wy = w * y2,
      wz = w * z2

    const sx = scale.x,
      sy = scale.y,
      sz = scale.z

    this.m00 = (1 - (yy + zz)) * sx
    this.m01 = (xy + wz) * sx
    this.m02 = (xz - wy) * sx
    this.m03 = 0

    this.m10 = (xy - wz) * sy
    this.m11 = (1 - (xx + zz)) * sy
    this.m12 = (yz + wx) * sy
    this.m13 = 0

    this.m20 = (xz + wy) * sz
    this.m21 = (yz - wx) * sz
    this.m22 = (1 - (xx + yy)) * sz
    this.m23 = 0

    this.m30 = position.x
    this.m31 = position.y
    this.m32 = position.z
    this.m33 = 1

    return this
  }
}
