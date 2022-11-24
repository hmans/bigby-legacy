import { mat4, mat3 } from "gl-matrix"
import { Geometry } from "./Geometry"
import { Object3D } from "./Object3D"
import { Material } from "./materials/Material"

export type Mode = "TRIANGLES" | "POINTS" | "LINES"

export class Mesh extends Object3D {
  readonly geometry: Geometry
  readonly material: Material
  readonly modelViewMatrix = mat4.create()
  readonly normalMatrix = mat3.create()
  public mode: Mode = "TRIANGLES"
  public instances = 1

  constructor(geometry: Geometry, material: Material) {
    super()
    this.geometry = geometry
    this.material = material
  }
}
