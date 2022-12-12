import * as Physics from "@bigby/plugin-physics3d"
import { loadGLTF } from "@bigby/plugin-three"
import { App, apply, System } from "bigby"

export class Brick {
  health = 1
}

class BricksSystem extends System {
  async onStart() {
    const gltf = await loadGLTF("/models/wonkout_brick.gltf")

    /* Bricks */
    for (let x = -3; x <= 3; x++) {
      for (let y = -2; y <= 2; y++) {
        this.app.spawn([
          new Brick(),

          new Physics.DynamicBody((body) =>
            body
              .enabledTranslations(true, true, false)
              .setLinearDamping(1)
              .setAngularDamping(1)
          ),

          new Physics.BoxCollider([2, 1, 1]).setDensity(2),

          apply(gltf.scene.children[0].clone(), {
            castShadow: true,
            receiveShadow: false,
            position: [x * 3, y * 2 + 2, 0]
          })
        ])
      }
    }
  }
}

export const Bricks = (app: App) => {
  app.registerComponent(Brick)
  app.addSystem(BricksSystem)
}
