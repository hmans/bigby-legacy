import {
  App,
  BoxGeometry,
  Camera,
  Input,
  InputPlugin,
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

/* The app! */
new App()
  /* We'll need some system plugins to make it do something. */
  .addPlugin(TickerPlugin)
  .addPlugin(TransformsPlugin)
  .addPlugin(WebGL2RenderingPlugin)
  .addPlugin(PhysicsPlugin)

  /* Let's add some game-specific plugins. */
  .addPlugin(InputPlugin)
  .addPlugin(PlayerPlugin)

  /* Create stuff on startup. */
  .addStartupSystem((app) => {
    app.world.add([new Transform([0, 0, 20]), new Camera(70, 0.1, 1000)])

    const geometry = new BoxGeometry()
    const material = new Material({
      color: { r: 0.5, g: 0.5, b: 0.5 },
    })

    for (let i = 0; i < 200; i++) {
      app.world.add([
        new Transform([plusMinus(30), plusMinus(30), 0], quat.random(quat.create())),
        new Mesh(geometry, material),
        new RigidBody(),
      ])
    }
  })

  .run()

/* Components are class instances. */
class Player {}

/* A custom plugin that adds and manages a player entity. Plugins
are just functions that get passed a reference to the app. */
function PlayerPlugin(app: App) {
  const entities = app.world.query([Player, Input, RigidBody])

  app.addSystem((dt) => {
    entities.iterate((entity, [player, input, rigidbody]) => {
      rigidbody.rigidBody!.applyImpulse({ ...input, z: 0 }, true)
    })
  })

  app.addStartupSystem(() => {
    app.world.add([
      new Player(),
      new Input(),
      new RigidBody(),
      new Transform(),
      new Mesh(new BoxGeometry(), new Material({ color: { r: 1, g: 0.5, b: 0 } })),
    ])
  })

  return app
}
