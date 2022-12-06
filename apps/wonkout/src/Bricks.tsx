import * as Physics from "@bigby/plugin-physics3d"
import { loadGLTF } from "@bigby/plugin-three"
import { App, apply, Transform3D } from "bigby"

export const Bricks = (app: App) =>
  app.onStart(async (app) => {
    const gltf = await loadGLTF("/models/wonkout_brick.gltf")

    /* Bricks */
    for (let x = -3; x <= 3; x++) {
      for (let y = -2; y <= 2; y++) {
        app.add([
          new Transform3D([x * 3, y * 2 + 2, 0]),

          new Physics.DynamicBody((body) =>
            body
              .enabledTranslations(true, true, false)
              .setLinearDamping(1)
              .setAngularDamping(1)
          ),

          new Physics.BoxCollider([2, 1, 1])
            .setDensity(2)
            .onCollisionStart((other) => {
              console.log("OH NO")
            }),

          apply(gltf.scene.children[0].clone(), {
            castShadow: true,
            receiveShadow: false
          })
        ])
      }
    }
  })
