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

    /* Fill the position buffer */
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this.geometry.attributes.position.data,
      gl.STATIC_DRAW
    )

    /* Create VAO */
    const vao = gl.createVertexArray()!
    gl.bindVertexArray(vao)

    const positionAttributeLocation = gl.getAttribLocation(
      this.material.program!,
      "a_position"
    )

    var size = 2 // 2 components per iteration
    var type = gl.FLOAT // the data is 32bit floats
    var normalize = false // don't normalize the data
    var stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0 // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    )

    gl.enableVertexAttribArray(positionAttributeLocation)

    this.vao = vao
  }

  render(gl: WebGL2RenderingContext) {
    if (!this.isCompiled) this.compile(gl)

    gl.useProgram(this.material.program!)
    gl.bindVertexArray(this.vao!)

    var primitiveType = gl.TRIANGLES
    var offset = 0
    var count = 3
    gl.drawArrays(primitiveType, offset, count)
  }
}
