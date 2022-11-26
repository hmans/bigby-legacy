import { mat4 } from "gl-matrix"
import { $, Attribute, compileShader, Input, Master, Vec3 } from "shader-composer"
import { createProgram, createShader } from "../helpers"

export type Uniform = number | mat4

function MaterialRoot({ color = Vec3([1, 1, 1]) }: { color: Input<"vec3"> }) {
  return Master({
    vertex: {
      header: $`
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projectionMatrix;

        flat varying float vLight;

        attribute vec3 normal;
      `,
      body: $`
        vec3 lightDirection = normalize(vec3(1.0, 2.0, 3.0));

        /* Calculate the light intensity */
        vLight = 0.0;
        vLight += 0.4;
        vLight += max(dot(normalize(mat3(modelMatrix) * normal), lightDirection), 0.0) * 0.6;

        /* Calculate the vertex position */
        gl_Position = projectionMatrix
          * viewMatrix
          * modelMatrix
          * ${Attribute("vec4", "position")};
      `,
    },
    fragment: {
      header: $`
        flat varying float vLight;
        out vec4 fragColor;
      `,
      body: $`
        fragColor = vec4(${color} * vLight, 1.0);
      `,
    },
  })
}

export class Material {
  program?: WebGLProgram
  shader: ReturnType<typeof compileShader>

  constructor(props: { color: Input<"vec3"> }) {
    this.shader = compileShader(MaterialRoot(props))
  }

  get isCompiled() {
    return this.program
  }

  compile(gl: WebGL2RenderingContext) {
    const vertexDefines = `#version 300 es
      precision mediump sampler2DArray;
			#define attribute in
			#define varying out
			#define texture2D texture
    `

    const fragmentDefines = `#version 300 es
      precision mediump sampler2DArray;
      #define varying in
      #define texture2D texture
      `

    /* Create our shaders */
    const vertex = createShader(
      gl,
      gl.VERTEX_SHADER,
      vertexDefines + this.shader[0].vertexShader
    )
    const fragment = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentDefines + this.shader[0].fragmentShader
    )

    /* Link them into a program */
    this.program = createProgram(gl, vertex, fragment)

    /* At this point, we no longer need the shaders */
    gl.deleteShader(vertex)
    gl.deleteShader(fragment)
  }

  uniforms: Record<string, Uniform> = {}

  updateUniforms(gl: WebGL2RenderingContext) {
    if (!this.program) return

    /* Update uniforms */
    this.shader[1].update(0.01, undefined!, undefined!, undefined!)

    /* Upload shader composer uniforms */
    for (const [name, uniform] of Object.entries(this.shader[0].uniforms!)) {
      const location = gl.getUniformLocation(this.program, name)
      if (location === null) throw new Error(`Uniform ${name} not found in program`)
      gl.uniform1f(location, (uniform as any).value)
    }

    /* Upload my own uniforms */
    for (const [name, value] of Object.entries(this.uniforms)) {
      const location = gl.getUniformLocation(this.program, name)
      if (location === null) throw new Error(`Uniform ${name} not found in program`)

      if (typeof value === "number") {
        gl.uniform1f(location, value)
      } else if (value instanceof Float32Array) {
        gl.uniformMatrix4fv(location, false, value)
      }
    }
  }
}
