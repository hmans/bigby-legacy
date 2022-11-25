import { With, World } from "@miniplex/core"
import { Mesh } from "../core/Mesh"
import { Transform } from "../core/Transform"

export type Entity = {
  transform?: Transform
  parent?: With<Entity, "transform">
  mesh?: Mesh
}

export default (world: World<Entity>) => {
  console.log("Let's go! 🐝")

  const meshes = world.with("mesh")

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

  return () => {
    /* Clear canvas */
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    /* Draw */
    for (const { mesh } of meshes) {
      if (!mesh.material.isCompiled) mesh.material.compile(gl)
      if (!mesh.isCompiled) mesh.compile(gl)

      /* Prepare material */
      gl.useProgram(mesh.material.program!)

      /* Prepare geometry */

      /*
      NOTE: I don't know if we're supposed to do all this every frame. Still trying
      to understand VAOs!
      */
      gl.bindVertexArray(mesh.vao!)

      const positionAttributeLocation = gl.getAttribLocation(
        mesh.material.program!,
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

      var primitiveType = gl.TRIANGLES
      var offset = 0
      var count = 3
      gl.drawArrays(primitiveType, offset, count)
    }
  }
}
