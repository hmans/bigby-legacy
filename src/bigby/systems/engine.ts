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

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, canvas.width, canvas.height)

    /* Draw */
    for (const { mesh } of meshes) {
      /* Render mesh */
      mesh.render(gl)
    }
  }
}
