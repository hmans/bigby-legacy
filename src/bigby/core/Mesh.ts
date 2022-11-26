import { mat4 } from "gl-matrix"
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

    /* Update viewMatrix uniform */
    const viewMatrix = mat4.create()
    mat4.lookAt(viewMatrix, [0, 0, -5], [0, 0, 0], [0, 1, 0])
    const viewLocation = gl.getUniformLocation(this.material.program!, "viewMatrix")
    if (viewLocation !== null) gl.uniformMatrix4fv(viewLocation, false, viewMatrix)

    /* Update projectionMatrix uniform */
    const perspectiveMatrix = mat4.create()
    const projectionLocation = gl.getUniformLocation(
      this.material.program!,
      "projectionMatrix"
    )
    if (projectionLocation !== null)
      gl.uniformMatrix4fv(
        projectionLocation,
        false,
        mat4.perspective(
          perspectiveMatrix,
          Math.PI * 1.5,
          gl.canvas.width / gl.canvas.height,
          0.1,
          1000
        )
      )

    /* Draw the geometry */
    gl.bindVertexArray(this.vao!)

    /* Cull back faces... for now */
    gl.enable(gl.CULL_FACE)
    gl.cullFace(gl.BACK)

    /* Enable depth testing */
    gl.enable(gl.DEPTH_TEST)

    if (this.geometry.attributes.index) {
      gl.drawElements(
        gl.TRIANGLES,
        this.geometry.attributes.index.data.length /
          this.geometry.attributes.index.size,
        gl.UNSIGNED_INT,
        0
      )
    } else {
      gl.drawArraysInstanced(
        gl.TRIANGLES,
        0,
        this.geometry.attributes.position.data.length /
          this.geometry.attributes.position.size,
        1
      )
    }
  }
}
