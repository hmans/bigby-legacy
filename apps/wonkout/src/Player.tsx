import { Input } from "@bigby/plugin-input"
import * as Physics from "@bigby/plugin-physics3d"
import { loadGLTF } from "@bigby/plugin-three"
import { App, apply, Transform3D } from "bigby"

export class PlayerComponent {}

export const Player = (app: App) => {
  app.registerComponent(PlayerComponent)

  app.onStart(async (app) => {
    const gltf = await loadGLTF("/models/wonkout_paddle.gltf")

    /* Player */
    app.add([
      new PlayerComponent(),
      new Input(),

      new Physics.DynamicBody()
        .setEnabledRotations(false, false, true)
        .setEnabledTranslations(true, true, false),

      new Physics.BoxCollider([5, 1, 1]),

      new Transform3D([0, -8.5, 0]),

      apply(gltf.scene.children[0]!.clone(), { castShadow: true })
    ])

    const playerQuery = app.query([PlayerComponent])

    app.onUpdate(() => {
      const player = playerQuery.first

      if (player) {
        const { move, aim } = player.get(Input)!
        const rigidbody = player.get(Physics.RigidBody)!

        const rb = rigidbody.raw!
        rb.resetForces(false)
        rb.resetTorques(false)

        /* Move */
        rb.applyImpulse({ x: move.x * 2, y: move.y * 2, z: 0 }, true)

        /* Rotate */
        rb.applyTorqueImpulse({ x: 0, y: 0, z: aim.x * -1 }, true)
      }
    })
  })
  return app
}
