export class Game {
  canvas: HTMLCanvasElement
  gl: WebGLRenderingContext

  constructor() {
    console.log("Let's go! 🐝")

    /* Initialize canvas */
    this.canvas = document.body.appendChild(document.createElement("canvas"))
    this.canvas.width = 500
    this.canvas.height = 500

    /* Initialize WebGL */
    const gl = this.canvas.getContext("webgl2", {
      antialias: true,
      powerPreference: "high-performance"
    })

    if (!gl) throw new Error("WebGL2 not supported")

    this.gl = gl
  }

  dispoe() {}

  update() {}
}
