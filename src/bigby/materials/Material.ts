import { createProgram, createShader } from "../helpers"

export class Material {
  constructor(public color = "1, 0, .5") {}

  program?: WebGLProgram

  get isCompiled() {
    return this.program
  }

  compile(gl: WebGL2RenderingContext) {
    const vertexShader = /*glsl*/ `#version 300 es
    in vec4 a_position;
    void main() {
      gl_Position = a_position;
    }
  `

    const fragmentShader = /*glsl*/ `#version 300 es
    precision highp float;
    out vec4 outColor;
    
    void main() {
      outColor = vec4(${this.color}, 1);
    }
  `

    const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader)
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader)

    this.program = createProgram(gl, vertex, fragment)

    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
  }
}
