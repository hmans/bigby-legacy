import "./style.css"
import { World } from "@miniplex/core"

type Entity = {
  engine?: true
}

const world = new World<Entity>()

world.add({ engine: true })

console.log("Let's go! 🐝")

/* Initialize canvas */
const canvas = document.body.appendChild(document.createElement("canvas"))

/* Initialize WebGL */
const gl = canvas.getContext("webgl2", {
  antialias: true,
  powerPreference: "high-performance"
})!

if (!gl) throw new Error("WebGL2 not supported")
