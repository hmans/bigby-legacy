import {
  App,
  BoxGeometry,
  Camera,
  Material,
  Mesh,
  PhysicsPlugin,
  RigidBody,
  Transform,
  WebGL2Game,
} from "bigby"
import { quat } from "gl-matrix"
import { plusMinus } from "randomish"
import { Color } from "three"
import "./style.css"

new App()
  .addPlugin(WebGL2Game)
  .addPlugin(PhysicsPlugin)

  .addStartupSystem((app) => {
    app.world.add({
      transform: new Transform([0, 0, 20]),
      camera: new Camera(70, 0.1, 1000),
    })

    const geometry = new BoxGeometry()
    const material = new Material({
      color: new Color("hotpink"),
    })

    for (let i = 0; i < 200; i++) {
      app.world.add({
        transform: new Transform(
          [plusMinus(16), plusMinus(10), 0],
          quat.random(quat.create())
        ),
        mesh: new Mesh(geometry, material),
        rigidbody: new RigidBody(),
      })
    }
  })
  .run()
