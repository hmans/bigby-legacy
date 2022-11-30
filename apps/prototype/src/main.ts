import {
  App,
  BoxGeometry,
  Camera,
  IRigidBody,
  Material,
  Mesh,
  PhysicsPlugin,
  RigidBody,
  Transform,
  WebGL2Game,
} from "bigby"
import { quat } from "gl-matrix"
import { plusMinus } from "randomish"
import "./style.css"

function PlayerPlugin(app: App<Partial<IRigidBody> & { isPlayer?: true }>) {
  const entities = app.world.with("isPlayer", "rigidbody")

  const keys = new Set<string>()

  const isPressed = (key: string) => (keys.has(key) ? 1 : 0)

  const stick = {
    x: 0,
    y: 0,
  }

  app.addStartupSystem(() => {
    document.addEventListener("keydown", (e) => {
      keys.add(e.key)
    })

    document.addEventListener("keyup", (e) => {
      keys.delete(e.key)
    })
  })

  app.addSystem((dt) => {
    stick.x = isPressed("d") - isPressed("a")
    stick.y = isPressed("w") - isPressed("s")
  })

  app.addSystem((dt) => {
    const player = entities.first
    if (!player) return

    const rigidBody = player.rigidbody.rigidBody
    if (!rigidBody) return

    rigidBody.applyImpulse({ ...stick, z: 0 }, true)
  })

  app.addStartupSystem(() => {
    app.world.add({
      isPlayer: true,
      rigidbody: new RigidBody(),
      transform: new Transform(),
      mesh: new Mesh(
        new BoxGeometry(),
        new Material({ color: { r: 1, g: 0.5, b: 0 } })
      ),
    })
  })

  return app
}

new App()
  .addPlugin(WebGL2Game)
  .addPlugin(PhysicsPlugin)

  .addPlugin(PlayerPlugin)

  .addStartupSystem((app) => {
    app.world.add({
      transform: new Transform([0, 0, 20]),
      camera: new Camera(70, 0.1, 1000),
    })

    const geometry = new BoxGeometry()
    const material = new Material({
      color: { r: 0.5, g: 0.5, b: 0.5 },
    })

    for (let i = 0; i < 200; i++) {
      app.world.add({
        transform: new Transform(
          [plusMinus(30), plusMinus(30), 0],
          quat.random(quat.create())
        ),
        mesh: new Mesh(geometry, material),
        rigidbody: new RigidBody(),
      })
    }
  })

  .run()
