import { Material } from "./Material"

export class LitMaterial extends Material {
  constructor(color = [1, 1, 1]) {
    super({
      uniforms: { color },

      vertex: /* glsl */ `#version 300 es
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;

        in vec3 normal;
        in vec3 position;

        flat out vec3 vNormal;

        void main() {
          vNormal = mat3(modelViewMatrix) * normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,

      fragment: /* glsl */ `#version 300 es
        precision highp float;

        uniform vec3 color;

        flat in vec3 vNormal;
        out vec4 pc_fragColor;

        void main() {
          // Ambient Light
          float ambientLight = 0.2;

          // Directional Light
          vec3 lightDirection = normalize(vec3(-1.0, 0.5, 1.0));
          float directionalLight = max(dot(normalize(vNormal), lightDirection), 0.0);

          float finalLight = ambientLight + directionalLight;
          
          // finalLight = 1.0;

          pc_fragColor = vec4(color * finalLight, 1.0);
        }
      `,

      side: "both",
      transparent: false,
      depthWrite: true
    })
  }
}
