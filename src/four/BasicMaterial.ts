import { Material } from "./Material"

export class BasicMaterial extends Material {
  constructor(color = [1, 1, 1]) {
    super({
      uniforms: { color },

      vertex: /* glsl */ `#version 300 es
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;

        in vec3 position;

        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,

      fragment: /* glsl */ `#version 300 es
        precision highp float;

        uniform vec3 color;

        out vec4 pc_fragColor;

        void main() {
          pc_fragColor = vec4(color, 1.0);
        }
      `,

      side: "both",
      transparent: false,
      depthWrite: true
    })
  }
}
