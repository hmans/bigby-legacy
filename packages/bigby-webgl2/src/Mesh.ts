import { Geometry } from "./Geometry"
import { Material } from "./Material"

export class Mesh {
  vao?: WebGLVertexArrayObject

  constructor(public geometry: Geometry, public material: Material) {}
}
