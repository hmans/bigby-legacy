import { Geometry } from "../geometry/Geometry"
import { Material } from "../materials/Material"
import { Transform } from "./Transform"

export class Mesh {
  vao?: WebGLVertexArrayObject

  constructor(public geometry: Geometry, public material: Material) {}

  get isCompiled() {
    return this.vao
  }

  compile(gl: WebGL2RenderingContext) {
    /* Ensure that material is compiled */
    if (!this.material.isCompiled) this.material.compile(gl)

    /* Create our VAO */
    this.vao = gl.createVertexArray()!
    if (!this.vao) throw new Error("Could not create VAO")

    gl.bindVertexArray(this.vao)

    /* Upload all of the geometry's attributes */
    for (const [name, attribute] of Object.entries(this.geometry.attributes)) {
      const type = name === "index" ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER

      const buffer = gl.createBuffer()
      if (!buffer) throw new Error("Failed to create buffer")

      /* Upload buffer */
      gl.bindBuffer(type, buffer)
      gl.bufferData(type, attribute.data, gl.STATIC_DRAW)

      /* Find the attribute's location in the shader */
      const location = gl.getAttribLocation(this.material.program!, name)

      /* Enable vertex attribute */
      if (location !== -1) {
        gl.enableVertexAttribArray(location)
        gl.vertexAttribPointer(location, attribute.size, gl.FLOAT, false, 0, 0)
      }
    }
  }

  render(gl: WebGL2RenderingContext, transform: Transform) {
    /* Ensure that the mesh is compiled */
    if (!this.isCompiled) this.compile(gl)

    /* Use this mesh's material's program */
    gl.useProgram(this.material.program!)

    /* Update the material's uniforms */
    /* TODO: Change this so this only happens once per frame per material */
    this.material.updateUniforms(gl)

    /* Update modelMatrix uniform */
    const location = gl.getUniformLocation(this.material.program!, "modelMatrix")
    if (location !== null) gl.uniformMatrix4fv(location, false, transform.matrix)

    /* Draw the geometry */
    gl.bindVertexArray(this.vao!)
    gl.drawArraysInstanced(
      gl.TRIANGLES,
      0,
      this.geometry.attributes.position.data.length /
        this.geometry.attributes.position.size,
      1
    )
  }
}
