import {
  App,
  BoxGeometry,
  Camera,
  IInput,
  Input,
  InputPlugin,
  IRigidBody,
  Material,
  Mesh,
  PhysicsPlugin,
  RigidBody,
  TickerPlugin,
  Transform,
  TransformsPlugin,
  WebGL2RenderingPlugin,
} from "bigby"
import { quat } from "gl-matrix"
import { plusMinus } from "randomish"
import "./style.css"

function PlayerPlugin(app: App<Partial<IRigidBody & IInput> & { isPlayer?: true }>) {
  const entities = app.world.with("isPlayer", "input", "rigidbody")

  app.addSystem((dt) => {
    for (const { input, rigidbody } of entities) {
      rigidbody.rigidBody!.applyImpulse({ ...input, z: 0 }, true)
    }
  })

  app.addStartupSystem(() => {
    app.world.add({
      isPlayer: true,
      input: new Input(),
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
  .addPlugin(TickerPlugin)
  .addPlugin(TransformsPlugin)
  .addPlugin(WebGL2RenderingPlugin)
  .addPlugin(PhysicsPlugin)

  .addPlugin(InputPlugin)
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
