import { Material } from "../materials/Material"

export class Mesh {
  vao?: WebGLVertexArrayObject

  constructor(public material: Material) {}

  get isCompiled() {
    return this.vao
  }

  compile(gl: WebGL2RenderingContext) {
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

    this.vao = vao
  }
}
