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

const a = world.add({
  autorotate: true,

  transform: new Transform(),

  mesh: new Mesh(
    new Geometry({
      position: {
        size: 3,
        data: new Float32Array([
          0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, 0.5,
          -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5,
          0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5,
          0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
          0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
          -0.5, 0.5, 0.5, -0.5, 0.5,
        ]),
      },
      index: {
        size: 1,
        data: new Uint32Array([
          0, 2, 1, 2, 3, 1, 4, 6, 5, 6, 7, 5, 8, 10, 9, 10, 11, 9, 12, 14, 13, 14,
          15, 13, 16, 18, 17, 18, 19, 17, 20, 22, 21, 22, 23, 21,
        ]),
      },
      normal: {
        size: 3,
        data: new Float32Array([
          0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, 0.5,
          -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5,
          0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5,
          0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
          0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
          -0.5, 0.5, 0.5, -0.5, 0.5,
        ]),
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

a.transform.position[0] = 0

function animate() {
  requestAnimationFrame(animate)
  systems.forEach((system) => system())
}

animate()
