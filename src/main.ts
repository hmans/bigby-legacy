import { quat } from "gl-matrix"
import { plusMinus } from "randomish"
import { Color } from "three"
import { App } from "./bigby/App"
import { Camera } from "./bigby/core/Camera"
import { Mesh } from "./bigby/core/Mesh"
import { Transform } from "./bigby/core/Transform"
import { BoxGeometry } from "./bigby/geometry/BoxGeometry"
import { Material } from "./bigby/materials/Material"
import "./style.css"

import("@dimforge/rapier3d-compat").then(() => {
  new App((world) => {
    world.add({
      // autorotate: [1, 1.3, 0],
      transform: new Transform([0, 0, 20]),
      camera: new Camera(70, 0.1, 1000),
    })

    const geometry = new BoxGeometry()
    const material = new Material({ color: new Color(0x00ff00) })

    for (let i = 0; i < 100; i++) {
      world.add({
        // autorotate: [plusMinus(1), plusMinus(1), 0],
        transform: new Transform(
          [plusMinus(20), plusMinus(10), 0],
          quat.random(quat.create())
        ),
        mesh: new Mesh(geometry, material),
      })
    }
  })
})
