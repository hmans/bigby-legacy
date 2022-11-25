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
canvas.width = window.innerWidth
canvas.height = window.innerHeight

/* Initialize WebGL */
const gl = canvas.getContext("webgl2", {
  antialias: true,
  powerPreference: "high-performance"
})!

if (!gl) throw new Error("WebGL2 not supported")

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error("Failed to create shader")

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!success)
    throw new Error("Failed to compile shader: " + gl.getShaderInfoLog(shader))

  return shader
}

const vertexShader = createShader(
  gl,
  gl.VERTEX_SHADER,
  /*glsl*/ `#version 300 es
    in vec4 a_position;
    void main() {
      gl_Position = a_position;
    }
  `
)

const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  /*glsl*/ `#version 300 es
    precision highp float;
    out vec4 outColor;
    
    void main() {
      outColor = vec4(1, 0, 0.5, 1);
    }
  `
)

function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram()
  if (!program) throw new Error("Failed to create program")

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!success) throw new Error("Failed to link program")

  return program
}

const program = createProgram(gl, vertexShader, fragmentShader)

const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

const positions = [0, 0, 0, 0.5, 0.7, 0]
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

const vao = gl.createVertexArray()
gl.bindVertexArray(vao)
gl.enableVertexAttribArray(positionAttributeLocation)

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

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

/* Clear */
gl.clearColor(1, 1, 0, 1)
gl.clear(gl.COLOR_BUFFER_BIT)

gl.useProgram(program)
gl.bindVertexArray(vao)

var primitiveType = gl.TRIANGLES
var offset = 0
var count = 3
gl.drawArrays(primitiveType, offset, count)
