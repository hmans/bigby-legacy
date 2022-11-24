export class Game {
  start() {
    console.log("Let's go! 🐝")

    const canvas = document.createElement("canvas")

    canvas.width = 500
    canvas.height = 500

    const gl = canvas.getContext("webgl2", {
      antialias: true,
      powerPreference: "high-performance"
    })

    console.log(gl)
  }

  stop() {}

  update() {}
}
