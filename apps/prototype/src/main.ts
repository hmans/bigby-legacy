import {
  App,
  AutorotatePlugin,
  BoxGeometry,
  Camera,
  Material,
  Mesh,
  PhysicsPlugin,
  RigidBody,
  TickerPlugin,
  Transform,
  TransformsPlugin,
  WebGL2RenderingPlugin,
} from "bigby"
import "./style.css"

new App()
  .addPlugin(TickerPlugin)
  .addPlugin(AutorotatePlugin)
  .addPlugin(PhysicsPlugin)
  .addPlugin(TransformsPlugin)
  .addPlugin(WebGL2RenderingPlugin)

  /* Game initialization */
  .addStartupSystem((app) => {
    /* Add a camera */
    app.world.add([new Transform([0, 0, 5]), new Camera()])

    /* Add a box */
    app.world.add([
      new Transform([0, 2, 0]),
      new Mesh(new BoxGeometry(), new Material({ color: [1, 0.5, 0] })),
      // new AutoRotate([1, 2, 0.1]),
      new RigidBody(),
    ])
  })

  .run()
