import { World } from "@miniplex/core"
import {
  Add,
  Cos,
  GlobalTime,
  Mul,
  NormalizePlusMinusOne,
  Sin,
} from "shader-composer"
import { Color } from "three"
import { Mesh } from "./bigby/core/Mesh"
import { Transform } from "./bigby/core/Transform"
import { Geometry } from "./bigby/geometry/Geometry"
import { Material } from "./bigby/materials/Material"
import engine, { Entity } from "./bigby/systems/engine"
import transforms from "./bigby/systems/transforms"
import "./style.css"

const world = new World<Entity>()

const systems = [transforms(world), engine(world)]

world.add({
  transform: new Transform(),
  mesh: new Mesh(
    new Geometry({
      position: {
        // prettier-ignore
        data: new Float32Array([
          0.0, 0.0, 0.0,
          0.0, 0.7, 0.0,
          0.7, 0.7, 0.0,

          0.0, 0.0, 0.0,
          0.7, 0.7, 0.0,
          0.7, 0.0, 0.0,
        ]),
        size: 3,
      },
    }),

    new Material({
      color: Add(
        new Color("hotpink"),
        NormalizePlusMinusOne(Sin(Mul(GlobalTime, 1.3)))
      ),
    })
  ),
})

function animate() {
  requestAnimationFrame(animate)
  systems.forEach((system) => system())
}

animate()
