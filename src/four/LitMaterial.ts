import { Material } from "./four"

export class LitMaterial extends Material {
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
          // // Ambient Light
          // float ambientLight = 0.2;

          // // Directional Light
          // vec3 lightDirection = vec3(-1.0, -1.0, -3.0);
          // vec3 normal = normalize(gl_FragCoord.xyz);
          // float directionalLight = max(dot(normal, lightDirection), 0.0);

          // float finalLight = ambientLight + directionalLight;

          float finalLight = 1.0;

          pc_fragColor = vec4(color * finalLight, 1.0);
        }
      `,

      side: "both",
      transparent: false,
      depthWrite: true
    })
  }
}
