import { Geometry } from "../geometry/Geometry"
import { Material } from "../materials/Material"

export class Mesh {
  vao?: WebGLVertexArrayObject

  constructor(public geometry: Geometry, public material: Material) {}

  get isCompiled() {
    return this.vao
  }

  compile(gl: WebGL2RenderingContext) {
    /* Ensure that material is compiled */
    if (!this.material.isCompiled) this.material.compile(gl)

    /* Create VAO */
    this.vao = gl.createVertexArray()!
    if (!this.vao) throw new Error("Could not create VAO")

    gl.bindVertexArray(this.vao)

    /* Upload all of the geometry's attributes */
    for (const [name, attribute] of Object.entries(this.geometry.attributes)) {
      const buffer = gl.createBuffer()
      if (!buffer) throw new Error("Failed to create buffer")

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, attribute.data, gl.STATIC_DRAW)

      const location = gl.getAttribLocation(this.material.program!, name)
      if (location === -1) throw new Error(`Attribute ${name} not found in program`)

      gl.enableVertexAttribArray(location)
      gl.vertexAttribPointer(location, attribute.size, gl.FLOAT, false, 0, 0)
    }
  }

  render(gl: WebGL2RenderingContext) {
    if (!this.isCompiled) this.compile(gl)

    gl.useProgram(this.material.program!)
    this.material.updateUniforms(gl)
    gl.bindVertexArray(this.vao!)

    var primitiveType = gl.TRIANGLES
    var offset = 0
    var count = 3
    gl.drawArrays(primitiveType, offset, count)
  }
}
