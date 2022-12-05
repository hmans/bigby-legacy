import { Quaternion, Vector3 } from "@bigby/math"
import * as THREE from "three"

export class ThreeVector3 extends Vector3 {
  constructor(public raw = new THREE.Vector3()) {
    super()
  }

  get x() {
    return this.raw.x
  }

  set x(value: number) {
    this.raw.x = value
  }

  get y() {
    return this.raw.y
  }

  set y(value: number) {
    this.raw.y = value
  }

  get z() {
    return this.raw.z
  }

  set z(value: number) {
    this.raw.z = value
  }
}

export class ThreeQuaternion extends Quaternion {
  constructor(public raw = new THREE.Quaternion()) {
    super()
  }

  get x() {
    return this.raw.x
  }

  set x(value: number) {
    this.raw.x = value
  }

  get y() {
    return this.raw.y
  }

  set y(value: number) {
    this.raw.y = value
  }

  get z() {
    return this.raw.z
  }

  set z(value: number) {
    this.raw.z = value
  }

  get w() {
    return this.raw.w
  }

  set w(value: number) {
    this.raw.w = value
  }
}
