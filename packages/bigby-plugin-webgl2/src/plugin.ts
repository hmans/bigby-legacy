import { App, Transform } from "@bigby/core"
import { mat3, mat4 } from "gl-matrix"
import { Camera } from "./Camera"
import { Mesh } from "./Mesh"

function RenderingSystem(app: App) {
  /* Initialize canvas */
  const canvas = document.body.appendChild(document.createElement("canvas"))
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  /* Initialize WebGL */
  const gl = canvas.getContext("webgl2", {
    antialias: true,
    powerPreference: "high-performance"
  })!

  if (!gl) throw new Error("WebGL2 not supported")

  /* Configure viewport */
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  const transforms = app.world.query([Transform])
  const meshes = app.world.query([Transform, Mesh])
  const cameras = app.world.query([Transform, Camera])

  const viewMatrix = mat4.create()
  const normalMatrix = mat3.create()
  const modelViewMatrix = mat4.create()

  return (dt: number) => {
    /* Clear canvas */
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    /* Get camera */
    if (!cameras.first) return

    const cameraTransform = app.world.getComponent(cameras.first, Transform)!
    const cameraCamera = app.world.getComponent(cameras.first, Camera)!

    /* Check if we need to update the renderer size */
    if (
      gl.canvas.width !== canvas.clientWidth ||
      gl.canvas.height !== canvas.clientHeight
    ) {
      gl.canvas.width = canvas.clientWidth
      gl.canvas.height = canvas.clientHeight
      cameraCamera.updateProjectionMatrix(gl)
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, canvas.width, canvas.height)

    meshes.iterate((entity, [transform, mesh]) => {
      const { geometry, material } = mesh

      /* Prepare Material */
      {
        /* Use this mesh's material's program */
        if (!material.isCompiled) material.compile(gl)
        gl.useProgram(material.program!)

        /* Update modelMatrix uniform */
        material.uniforms.modelMatrix = transform.matrix

        /* Update viewMatrix uniform */
        mat4.invert(viewMatrix, cameraTransform.matrix)
        material.uniforms.viewMatrix = viewMatrix

        /* Update modelViewMatrix uniform */
        mat4.copy(modelViewMatrix, viewMatrix)
        mat4.multiply(modelViewMatrix, modelViewMatrix, transform.matrix)
        material.uniforms.modelViewMatrix = modelViewMatrix

        /* Update normalMatrix uniform */
        mat3.normalFromMat4(normalMatrix, modelViewMatrix)
        material.uniforms.normalMatrix = normalMatrix

        /* Update projectionMatrix uniform */
        cameraCamera.updateProjectionMatrix(gl)
        material.uniforms.projectionMatrix = cameraCamera.projectionMatrix

        /* Update the material's uniforms */
        material.updateUniforms(gl, dt)
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
          for (const [name, attribute] of Object.entries(geometry.attributes)) {
            const type =
              name === "index" ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER

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
              gl.vertexAttribPointer(
                location,
                attribute.size,
                gl.FLOAT,
                false,
                0,
                0
              )
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

        if (geometry.attributes.index) {
          gl.drawElements(
            gl.TRIANGLES,
            geometry.attributes.index.data.length /
              geometry.attributes.index.size,
            gl.UNSIGNED_INT,
            0
          )
        } else {
          gl.drawArraysInstanced(
            gl.TRIANGLES,
            0,
            geometry.attributes.position.data.length /
              geometry.attributes.position.size,
            1
          )
        }
      }

      /* Done! */
    })
  }
}

export const WebGL2RenderingPlugin = (app: App) =>
  app.addSystem(RenderingSystem(app))
