import { Color } from "three"
import { App } from "./bigby/App"
import { Camera } from "./bigby/core/Camera"
import { Mesh } from "./bigby/core/Mesh"
import { Transform } from "./bigby/core/Transform"
import { BoxGeometry } from "./bigby/geometry/BoxGeometry"
import { Material } from "./bigby/materials/Material"
import "./style.css"

new App((world) => {
  world.add({
    // autorotate: [1, 1.3, 0],
    transform: new Transform([0, 0, 5]),
    camera: new Camera(70, 0.1, 1000),
  })

  world.add({
    autorotate: [0.3, 0.1, 0.2],
    transform: new Transform([0, 0, -30], [0, 0, 0, 1], [20, 20, 20]),
    mesh: new Mesh(
      new BoxGeometry(),
      new Material({
        color: new Color("orange"),
      })
    ),
  })

  world.add({
    autorotate: [1, 1.3, 0],
    transform: new Transform([-2, 0, 0]),
    mesh: new Mesh(
      new BoxGeometry(),
      new Material({
        color: new Color("hotpink"),
      })
    ),
  })

  world.add({
    autorotate: [0, -1, 1.3],
    transform: new Transform([2, 0, 0]),
    mesh: new Mesh(
      new BoxGeometry(),
      new Material({
        color: new Color("cyan"),
      })
    ),
  })
})
