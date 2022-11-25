import { Material } from "../materials/Material"

export class Mesh {
  vao?: WebGLVertexArrayObject

  constructor(public material: Material) {}

  get isCompiled() {
    return this.vao
  }

  compile(gl: WebGL2RenderingContext) {
    /* Make sure material is compiled */
    if (!this.material.isCompiled) this.material.compile(gl)

    /* Upload positions */
    const positionAttributeLocation = gl.getAttribLocation(
      this.material.program!,
      "a_position"
    )

    /* Fill the position buffer */
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 0, 0.7, 0.7, 0]),
      gl.STATIC_DRAW
    )

    /* Create VAO */
    const vao = gl.createVertexArray()!
    gl.bindVertexArray(vao)
    gl.enableVertexAttribArray(positionAttributeLocation)

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

    this.vao = vao
  }
}
