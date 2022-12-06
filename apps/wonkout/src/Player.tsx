import { Input } from "@bigby/plugin-input"
import * as Physics from "@bigby/plugin-physics3d"
import { loadGLTF } from "@bigby/plugin-three"
import { App, apply } from "bigby"
import { Object3D } from "three"

export class PlayerComponent {}

export const Player = (app: App) => {
  app.registerComponent(PlayerComponent)

  app.onStart(async (app) => {
    const gltf = await loadGLTF("/models/wonkout_paddle.gltf")

    /* Player */
    app.add([
      new PlayerComponent(),
      new Input(),

      new Physics.DynamicBody((desc) =>
        desc
          .enabledRotations(false, false, true)
          .enabledTranslations(true, true, false)
          .setLinearDamping(5)
          .setAngularDamping(3)
      ),

      new Physics.BoxCollider([5, 1, 1]).setDensity(10),

      apply(
        gltf.scene.children[0]!.clone(),
        { castShadow: true },
        (obj: Object3D) => obj.position.set(0, -8.5, 0)
      )
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
        rb.applyImpulse({ x: move.x * 30, y: move.y * 30, z: 0 }, true)

        /* Rotate */
        rb.applyTorqueImpulse({ x: 0, y: 0, z: aim.x * -10 }, true)
      }
    })
  })
  return app
}
