import { Geometry } from "../geometry/Geometry"
import { Material } from "../materials/Material"

export class Mesh {
  vao?: WebGLVertexArrayObject

  constructor(public geometry: Geometry, public material: Material) {}
}
