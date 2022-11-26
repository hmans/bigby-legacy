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
import autorotate from "./bigby/systems/autorotate"
import engine, { Entity } from "./bigby/systems/engine"
import transforms from "./bigby/systems/transforms"
import "./style.css"

const world = new World<Entity>()

const systems = [autorotate(world), transforms(world), engine(world)]

world.add({
  autorotate: true,

  transform: new Transform(),

  mesh: new Mesh(
    new Geometry({
      position: {
        // prettier-ignore
        data: new Float32Array([
          -0.5, -0.5, -0.5,
          -0.5, +0.5, -0.5,
          +0.5, +0.5, -0.5,

          -0.5, -0.5, -0.5,
          +0.5, +0.5, -0.5,
          +0.5, -0.5, -0.5,
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
