import {
  $,
  Attribute,
  compileShader,
  GlobalTime,
  Input,
  Master,
  Vec3,
} from "shader-composer"
import { createProgram, createShader } from "../helpers"

function MaterialRoot({ color = Vec3([1, 1, 1]) }: { color: Input<"vec3"> }) {
  return Master({
    vertex: {
      body: $`
        // ${GlobalTime}
        gl_Position = ${Attribute("vec4", "a_position")};
      `,
    },
    fragment: {
      body: $`
        gl_FragColor = vec4(${color}, 1.0);
      `,
    },
  })
}

export class Material {
  program?: WebGLProgram
  uniforms?: Record<string, { value: any }>

  constructor(public color: Input<"vec3">) {}

  get isCompiled() {
    return this.program
  }

  compile(gl: WebGL2RenderingContext) {
    /* Create our shaders */
    const [shader] = compileShader(MaterialRoot({ color: this.color }))
    this.uniforms = shader.uniforms

    const vertex = createShader(gl, gl.VERTEX_SHADER, shader.vertexShader)
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, shader.fragmentShader)

    /* Link them into a program */
    this.program = createProgram(gl, vertex, fragment)

    /* At this point, we no longer need the shaders */
    gl.deleteShader(vertex)
    gl.deleteShader(fragment)
  }
}
