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
import { BoxGeometry } from "./bigby/geometry/BoxGeometry"
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
  mesh: new Mesh(new BoxGeometry(), new Material({ color: new Color("hotpink") })),
})

a.transform.position[0] = -2

const b = world.add({
  autorotate: true,
  transform: new Transform(),
  mesh: new Mesh(new BoxGeometry(), new Material({ color: new Color("cyan") })),
})

b.transform.position[0] = +2

function animate() {
  requestAnimationFrame(animate)
  systems.forEach((system) => system())
}

animate()
