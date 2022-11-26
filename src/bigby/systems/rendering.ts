import { World } from "@miniplex/core"
import { mat4 } from "gl-matrix"
import { Entity } from "../Entity"

export default (world: World<Entity>) => {
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

  const transforms = world.with("transform")
  const meshes = transforms.with("mesh")
  const cameras = transforms.with("camera")

  const viewMatrix = mat4.create()

  return (dt: number) => {
    /* Clear canvas */
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, canvas.width, canvas.height)

    /* Get camera */
    const camera = cameras.first
    if (!camera) return

    for (const { mesh, transform } of meshes) {
      /* Prepare Material */
      {
        /* Use this mesh's material's program */
        if (!mesh.material.isCompiled) mesh.material.compile(gl)
        gl.useProgram(mesh.material.program!)

        /* Update modelMatrix uniform */
        const location = gl.getUniformLocation(mesh.material.program!, "modelMatrix")
        if (location !== null) gl.uniformMatrix4fv(location, false, transform.matrix)

        /* Update viewMatrix uniform */
        mat4.invert(viewMatrix, camera.transform.matrix)
        mesh.material.uniforms.viewMatrix = { value: viewMatrix }

        /* Update projectionMatrix uniform */
        camera.camera.updateProjectionMatrix(gl)
        mesh.material.uniforms.projectionMatrix = {
          value: camera.camera.projectionMatrix,
        }

        /* Update the material's uniforms */
        mesh.material.updateUniforms(gl)
      }

      /* Prepare Geometry */
      {
        /* If this is the first time we're rendering this mesh, set up its VAO. */
        if (!mesh.vao) {
          /* Create our VAO */
          mesh.vao = gl.createVertexArray()!
          if (!mesh.vao) throw new Error("Could not create VAO")

          gl.bindVertexArray(mesh.vao)

          /* Upload all of the geometry's attributes */
          /* TODO: do this in the loop, checking for dirty attributes */
          for (const [name, attribute] of Object.entries(mesh.geometry.attributes)) {
            const type = name === "index" ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER

            const buffer = gl.createBuffer()
            if (!buffer) throw new Error("Failed to create buffer")

            /* Upload buffer */
            gl.bindBuffer(type, buffer)
            gl.bufferData(type, attribute.data, gl.STATIC_DRAW)

            /* Find the attribute's location in the shader */
            const location = gl.getAttribLocation(mesh.material.program!, name)

            /* Enable vertex attribute */
            if (location !== -1) {
              gl.enableVertexAttribArray(location)
              gl.vertexAttribPointer(location, attribute.size, gl.FLOAT, false, 0, 0)
            }
          }
        }
      }

      /* Draw */
      {
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

      /* Done! */
    }
  }
}
