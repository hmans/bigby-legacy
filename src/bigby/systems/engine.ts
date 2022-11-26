import { With, World } from "@miniplex/core"
import { mat4, vec3 } from "gl-matrix"
import { Mesh } from "../core/Mesh"
import { Transform } from "../core/Transform"

export type Entity = {
  transform?: Transform
  parent?: With<Entity, "transform">
  mesh?: Mesh
  autorotate?: vec3
}

export default (world: World<Entity>) => {
  console.log("Let's go! 🐝")

  /* Initialize canvas */
  const canvas = document.body.appendChild(document.createElement("canvas"))
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  /* Initialize WebGL */
  const gl = canvas.getContext("webgl2", {
    antialias: true,
    powerPreference: "high-performance",
  })!

  if (!gl) throw new Error("WebGL2 not supported")

  /* Configure viewport */
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  const meshes = world.with("mesh", "transform")

  return (dt: number) => {
    /* Clear canvas */
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, canvas.width, canvas.height)

    /* Draw */
    for (const { mesh, transform } of meshes) {
      /* Ensure that the mesh is compiled */
      if (!mesh.isCompiled) mesh.compile(gl)

      /* Use this mesh's material's program */
      gl.useProgram(mesh.material.program!)

      /* Update the material's uniforms */
      /* TODO: Change this so this only happens once per frame per material */
      mesh.material.updateUniforms(gl)

      /* Update modelMatrix uniform */
      const location = gl.getUniformLocation(mesh.material.program!, "modelMatrix")
      if (location !== null) gl.uniformMatrix4fv(location, false, transform.matrix)

      /* Update viewMatrix uniform */
      const viewMatrix = mat4.create()
      mat4.lookAt(viewMatrix, [0, 0, 5], [0, 0, 0], [0, 1, 0])
      const viewLocation = gl.getUniformLocation(
        mesh.material.program!,
        "viewMatrix"
      )
      if (viewLocation !== null) gl.uniformMatrix4fv(viewLocation, false, viewMatrix)

      /* Update projectionMatrix uniform */
      const perspectiveMatrix = mat4.create()
      const projectionLocation = gl.getUniformLocation(
        mesh.material.program!,
        "projectionMatrix"
      )
      if (projectionLocation !== null)
        gl.uniformMatrix4fv(
          projectionLocation,
          false,
          mat4.perspectiveNO(
            perspectiveMatrix,
            75 * (Math.PI / 180),
            gl.canvas.width / gl.canvas.height,
            0.1,
            1000
          )
        )

      /* Draw the geometry */
      gl.bindVertexArray(mesh.vao!)

      /* Cull back faces... for now */
      gl.enable(gl.CULL_FACE)
      gl.cullFace(gl.BACK)

      /* Enable depth testing */
      gl.enable(gl.DEPTH_TEST)

      if (mesh.geometry.attributes.index) {
        gl.drawElements(
          gl.TRIANGLES,
          mesh.geometry.attributes.index.data.length /
            mesh.geometry.attributes.index.size,
          gl.UNSIGNED_INT,
          0
        )
      } else {
        gl.drawArraysInstanced(
          gl.TRIANGLES,
          0,
          mesh.geometry.attributes.position.data.length /
            mesh.geometry.attributes.position.size,
          1
        )
      }
    }
  }
}
