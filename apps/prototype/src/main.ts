import {
  App,
  BoxGeometry,
  Camera,
  Material,
  Mesh,
  TickerPlugin,
  Transform,
  TransformsPlugin,
  WebGL2RenderingPlugin,
} from "bigby"
import "./style.css"

new App()
  .addPlugin(TickerPlugin)
  .addPlugin(TransformsPlugin)
  .addPlugin(WebGL2RenderingPlugin)

  /* Game initialization */
  .addStartupSystem((app) => {
    console.log("hello world")

    /* Add a camera */
    app.world.add([new Transform([0, 0, 5]), new Camera()])

    /* Add a box */
    app.world.add([
      new Transform([0, 0, 0]),
      new Mesh(new BoxGeometry(), new Material({ color: [1, 0.5, 0] })),
    ])
  })

  .run()
