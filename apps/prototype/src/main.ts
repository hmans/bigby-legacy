import {
  App,
  AutorotatePlugin,
  BoxGeometry,
  Camera,
  Material,
  Mesh,
  RenderingPlugin,
  Transform,
} from "bigby"
import { quat } from "gl-matrix"
import { plusMinus } from "randomish"
import { Color } from "three"
import "./style.css"

new App()
  .addPlugin(AutorotatePlugin)
  .addPlugin(RenderingPlugin)
  .addStartupSystem((app) => {
    app.world.add({
      transform: new Transform([0, 0, 20]),
      camera: new Camera(70, 0.1, 1000),
    })

    const geometry = new BoxGeometry()
    const material = new Material({
      color: new Color("hotpink"),
    })

    for (let i = 0; i < 100; i++) {
      app.world.add({
        transform: new Transform(
          [plusMinus(20), plusMinus(10), 0],
          quat.random(quat.create())
        ),
        mesh: new Mesh(geometry, material),
      })
    }
  })
  .run()
