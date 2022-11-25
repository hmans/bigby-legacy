import { createProgram, createShader } from "../helpers"

export class Material {
  readonly vertexShader!: string
  readonly fragmentFragment!: string

  program?: WebGLProgram

  constructor(options: Material) {
    Object.assign(this, options)
  }

  get isCompiled() {
    return this.program
  }

  compile(gl: WebGL2RenderingContext) {
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

    this.program = createProgram(gl, vertexShader, fragmentShader)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
  }
}
